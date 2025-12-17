import type { ExperimentRun, Factor, AnalysisResult, SNRatioType, InputMode } from '../../types';
import { calculateSNRatio, calculateMean } from './snRatio';

/**
 * 計算各因子各水準的平均反應值和 S/N 比
 */
export function calculateMainEffects(
  factors: Factor[],
  runs: ExperimentRun[],
  snRatioType: SNRatioType,
  inputMode: InputMode = 'raw'
): { meanResponse: Record<string, number[]>; snRatios: Record<string, number[]> } {
  const meanResponse: Record<string, number[]> = {};
  const snRatios: Record<string, number[]> = {};

  factors.forEach((factor, factorIndex) => {
    const levelCount = factor.levels.length;
    const levelMeans: number[] = [];
    const levelSNRatios: number[] = [];

    // 對每個水準計算
    for (let level = 0; level < levelCount; level++) {
      // 找出使用此水準的所有實驗
      const runsAtLevel = runs.filter((run) => run.settings[factorIndex] === level);

      // 計算該水準的平均反應值
      const averages = runsAtLevel.map((run) => run.average);
      levelMeans.push(calculateMean(averages));

      // 計算該水準的 S/N 比平均
      let snValues: number[];
      if (inputMode === 'snRatio') {
        // S/N 比直接輸入模式：使用已輸入的 S/N 比
        snValues = runsAtLevel
          .filter((run) => run.snRatio !== undefined && !isNaN(run.snRatio))
          .map((run) => run.snRatio!);
      } else {
        // 原始數據模式：從試驗數據計算 S/N 比
        snValues = runsAtLevel.map((run) =>
          calculateSNRatio(run.trials, snRatioType)
        );
      }
      levelSNRatios.push(calculateMean(snValues));
    }

    meanResponse[factor.id] = levelMeans;
    snRatios[factor.id] = levelSNRatios;
  });

  return { meanResponse, snRatios };
}

/**
 * 計算整體平均值
 */
export function calculateGrandMean(runs: ExperimentRun[]): number {
  if (runs.length === 0) return 0;
  const allAverages = runs.map((run) => run.average);
  return calculateMean(allAverages);
}

/**
 * 識別各因子的最佳水準
 * 對於望大和望目特性：選擇 S/N 比最大的水準
 * 對於望小特性：也是選擇 S/N 比最大的水準（因為 S/N 比的定義已經考慮了方向）
 */
export function findOptimalLevels(
  factors: Factor[],
  snRatios: Record<string, number[]>
): Record<string, number> {
  const optimalLevels: Record<string, number> = {};

  factors.forEach((factor) => {
    const ratios = snRatios[factor.id];
    if (!ratios || ratios.length === 0) {
      optimalLevels[factor.id] = 0;
      return;
    }

    // 找出最大 S/N 比的水準索引
    let maxIndex = 0;
    let maxValue = ratios[0];
    ratios.forEach((value, index) => {
      if (value > maxValue) {
        maxValue = value;
        maxIndex = index;
      }
    });

    optimalLevels[factor.id] = maxIndex;
  });

  return optimalLevels;
}

/**
 * 計算各因子的重要性（基於 S/N 比的範圍）
 */
export function calculateFactorImportance(
  factors: Factor[],
  snRatios: Record<string, number[]>
): string[] {
  const ranges: { id: string; range: number }[] = [];

  factors.forEach((factor) => {
    const ratios = snRatios[factor.id];
    if (!ratios || ratios.length === 0) return;

    const max = Math.max(...ratios);
    const min = Math.min(...ratios);
    ranges.push({ id: factor.id, range: max - min });
  });

  // 按範圍大小排序（範圍大的因子更重要）
  return ranges.sort((a, b) => b.range - a.range).map((r) => r.id);
}

/**
 * 預測最佳組合的期望值
 * 使用加法模型：η_pred = T + Σ(A_optimal - T)
 * 其中 T 為整體平均，A_optimal 為各因子最佳水準的效應
 */
export function predictOptimalValue(
  factors: Factor[],
  meanResponse: Record<string, number[]>,
  optimalLevels: Record<string, number>,
  grandMean: number
): number {
  let prediction = grandMean;

  factors.forEach((factor) => {
    const optimalLevel = optimalLevels[factor.id];
    const levelMeans = meanResponse[factor.id];
    if (levelMeans && levelMeans[optimalLevel] !== undefined) {
      prediction += levelMeans[optimalLevel] - grandMean;
    }
  });

  return prediction;
}

/**
 * 執行完整的田口分析
 */
export function performTaguchiAnalysis(
  factors: Factor[],
  runs: ExperimentRun[],
  snRatioType: SNRatioType,
  inputMode: InputMode = 'raw'
): AnalysisResult {
  // 檢查是否有有效數據
  let validRuns: ExperimentRun[];
  if (inputMode === 'snRatio') {
    // S/N 比模式：檢查是否有輸入 S/N 比
    validRuns = runs.filter((run) => run.snRatio !== undefined && !isNaN(run.snRatio));
  } else {
    // 原始數據模式：檢查是否有試驗數據
    validRuns = runs.filter((run) => run.trials.length > 0 && run.trials.some((t) => !isNaN(t)));
  }

  if (validRuns.length === 0) {
    return {
      meanResponse: {},
      snRatios: {},
      optimalLevels: {},
      factorImportance: [],
      predictedOptimal: 0,
      grandMean: 0,
    };
  }

  // 計算主效應
  const { meanResponse, snRatios } = calculateMainEffects(factors, validRuns, snRatioType, inputMode);

  // 計算整體平均
  const grandMean = calculateGrandMean(validRuns);

  // 找出最佳水準
  const optimalLevels = findOptimalLevels(factors, snRatios);

  // 計算因子重要性
  const factorImportance = calculateFactorImportance(factors, snRatios);

  // 預測最佳值
  const predictedOptimal = predictOptimalValue(factors, meanResponse, optimalLevels, grandMean);

  return {
    meanResponse,
    snRatios,
    optimalLevels,
    factorImportance,
    predictedOptimal,
    grandMean,
  };
}
