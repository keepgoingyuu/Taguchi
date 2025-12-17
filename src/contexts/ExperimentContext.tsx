import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  Factor,
  ExperimentRun,
  ExperimentState,
  ExperimentActions,
  SNRatioType,
  AnalysisResult,
  OrthogonalArray,
} from '../types';
import { selectOrthogonalArray, getArraySubset } from '../utils/taguchi/orthogonalArrays';
import { performTaguchiAnalysis } from '../utils/taguchi/mainEffects';
import { calculateMean } from '../utils/taguchi/snRatio';
import { sampleDatasets } from '../utils/sampleData';

// 初始狀態
const initialState: ExperimentState = {
  factors: [],
  orthogonalArray: null,
  runs: [],
  snRatioType: 'nominal',
  targetValue: null,
  analysisResult: null,
  trialsPerRun: 3,
};

// Action 類型
type Action =
  | { type: 'ADD_FACTOR' }
  | { type: 'REMOVE_FACTOR'; payload: string }
  | { type: 'UPDATE_FACTOR'; payload: { id: string; updates: Partial<Factor> } }
  | { type: 'UPDATE_RUN'; payload: { runId: number; trials: number[] } }
  | { type: 'SET_SN_RATIO_TYPE'; payload: SNRatioType }
  | { type: 'SET_TARGET_VALUE'; payload: number | null }
  | { type: 'SET_TRIALS_PER_RUN'; payload: number }
  | { type: 'SET_ANALYSIS_RESULT'; payload: AnalysisResult | null }
  | { type: 'LOAD_SAMPLE_DATA'; payload?: 'injection' | 'hardness' | 'defect' }
  | { type: 'RESET_EXPERIMENT' }
  | { type: 'UPDATE_ORTHOGONAL_ARRAY' };

// 生成新因子 ID
function generateFactorId(existingFactors: Factor[]): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const letter of letters) {
    if (!existingFactors.some((f) => f.id === letter)) {
      return letter;
    }
  }
  return `F${existingFactors.length + 1}`;
}

// 根據直交表生成實驗序列
function generateRuns(
  orthogonalArray: OrthogonalArray | null,
  factorCount: number,
  trialsPerRun: number
): ExperimentRun[] {
  if (!orthogonalArray) return [];

  const subset = getArraySubset(orthogonalArray, factorCount);
  return subset.map((settings, index) => ({
    runId: index + 1,
    settings,
    trials: Array(trialsPerRun).fill(0),
    average: 0,
  }));
}

// Reducer
function experimentReducer(state: ExperimentState, action: Action): ExperimentState {
  switch (action.type) {
    case 'ADD_FACTOR': {
      const newId = generateFactorId(state.factors);
      const newFactor: Factor = {
        id: newId,
        name: `因子 ${newId}`,
        levels: [1, 2, 3], // 預設 3 水準
      };
      const newFactors = [...state.factors, newFactor];
      const newArray = selectOrthogonalArray(newFactors);
      const newRuns = generateRuns(newArray, newFactors.length, state.trialsPerRun);

      return {
        ...state,
        factors: newFactors,
        orthogonalArray: newArray,
        runs: newRuns,
        analysisResult: null,
      };
    }

    case 'REMOVE_FACTOR': {
      const newFactors = state.factors.filter((f) => f.id !== action.payload);
      const newArray = newFactors.length > 0 ? selectOrthogonalArray(newFactors) : null;
      const newRuns = generateRuns(newArray, newFactors.length, state.trialsPerRun);

      return {
        ...state,
        factors: newFactors,
        orthogonalArray: newArray,
        runs: newRuns,
        analysisResult: null,
      };
    }

    case 'UPDATE_FACTOR': {
      const { id, updates } = action.payload;
      const newFactors = state.factors.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      );

      // 檢查水準數是否改變，需要重新選擇直交表
      const oldFactor = state.factors.find((f) => f.id === id);
      const levelCountChanged =
        updates.levels && oldFactor && updates.levels.length !== oldFactor.levels.length;

      if (levelCountChanged) {
        const newArray = selectOrthogonalArray(newFactors);
        const newRuns = generateRuns(newArray, newFactors.length, state.trialsPerRun);
        return {
          ...state,
          factors: newFactors,
          orthogonalArray: newArray,
          runs: newRuns,
          analysisResult: null,
        };
      }

      return {
        ...state,
        factors: newFactors,
        analysisResult: null,
      };
    }

    case 'UPDATE_RUN': {
      const { runId, trials } = action.payload;
      const newRuns = state.runs.map((run) =>
        run.runId === runId
          ? { ...run, trials, average: calculateMean(trials.filter((t) => !isNaN(t) && t !== 0)) }
          : run
      );

      return {
        ...state,
        runs: newRuns,
        analysisResult: null,
      };
    }

    case 'SET_SN_RATIO_TYPE':
      return {
        ...state,
        snRatioType: action.payload,
        analysisResult: null,
      };

    case 'SET_TARGET_VALUE':
      return {
        ...state,
        targetValue: action.payload,
        analysisResult: null,
      };

    case 'SET_TRIALS_PER_RUN': {
      const newTrialsPerRun = action.payload;
      const newRuns = state.runs.map((run) => {
        const currentLength = run.trials.length;
        let newTrials: number[];

        if (newTrialsPerRun > currentLength) {
          // 擴展
          newTrials = [...run.trials, ...Array(newTrialsPerRun - currentLength).fill(0)];
        } else {
          // 縮減
          newTrials = run.trials.slice(0, newTrialsPerRun);
        }

        return {
          ...run,
          trials: newTrials,
          average: calculateMean(newTrials.filter((t) => !isNaN(t) && t !== 0)),
        };
      });

      return {
        ...state,
        trialsPerRun: newTrialsPerRun,
        runs: newRuns,
        analysisResult: null,
      };
    }

    case 'SET_ANALYSIS_RESULT':
      return {
        ...state,
        analysisResult: action.payload,
      };

    case 'LOAD_SAMPLE_DATA': {
      const sampleKey = action.payload || 'injection';
      const sample = sampleDatasets[sampleKey].data;
      const newArray = selectOrthogonalArray(sample.factors);

      return {
        factors: sample.factors,
        orthogonalArray: newArray,
        runs: sample.runs,
        snRatioType: sample.snRatioType,
        targetValue: sample.targetValue,
        trialsPerRun: sample.trialsPerRun,
        analysisResult: null,
      };
    }

    case 'RESET_EXPERIMENT':
      return initialState;

    case 'UPDATE_ORTHOGONAL_ARRAY': {
      const newArray = selectOrthogonalArray(state.factors);
      const newRuns = generateRuns(newArray, state.factors.length, state.trialsPerRun);

      return {
        ...state,
        orthogonalArray: newArray,
        runs: newRuns,
        analysisResult: null,
      };
    }

    default:
      return state;
  }
}

// Context
interface ExperimentContextType {
  state: ExperimentState;
  actions: ExperimentActions;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

// Provider
export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(experimentReducer, initialState);

  const actions: ExperimentActions = {
    addFactor: () => dispatch({ type: 'ADD_FACTOR' }),
    removeFactor: (id) => dispatch({ type: 'REMOVE_FACTOR', payload: id }),
    updateFactor: (id, updates) =>
      dispatch({ type: 'UPDATE_FACTOR', payload: { id, updates } }),
    updateRun: (runId, trials) =>
      dispatch({ type: 'UPDATE_RUN', payload: { runId, trials } }),
    setSNRatioType: (type) => dispatch({ type: 'SET_SN_RATIO_TYPE', payload: type }),
    setTargetValue: (value) => dispatch({ type: 'SET_TARGET_VALUE', payload: value }),
    setTrialsPerRun: (count) => dispatch({ type: 'SET_TRIALS_PER_RUN', payload: count }),
    calculateAnalysis: () => {
      const result = performTaguchiAnalysis(state.factors, state.runs, state.snRatioType);
      dispatch({ type: 'SET_ANALYSIS_RESULT', payload: result });
    },
    loadSampleData: (sampleKey) => dispatch({ type: 'LOAD_SAMPLE_DATA', payload: sampleKey }),
    resetExperiment: () => dispatch({ type: 'RESET_EXPERIMENT' }),
  };

  return (
    <ExperimentContext.Provider value={{ state, actions }}>
      {children}
    </ExperimentContext.Provider>
  );
}

// Hook
export function useExperiment() {
  const context = useContext(ExperimentContext);
  if (context === undefined) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
}
