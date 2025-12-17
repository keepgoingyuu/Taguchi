// 因子定義
export interface Factor {
  id: string;
  name: string;           // 因子名稱 (例: 模具溫度、射出壓力)
  levels: number[];       // 水準值 [60, 70, 80]
}

// 單次實驗結果
export interface ExperimentRun {
  runId: number;          // 實驗編號 (1-9 for L9)
  settings: number[];     // 各因子水準索引 [0, 1, 2]
  trials: number[];       // 多次試驗結果
  average: number;        // 平均值
  snRatio?: number;       // S/N比
}

// S/N比類型
export type SNRatioType = 'smaller' | 'larger' | 'nominal';

// S/N比類型描述
export const SNRatioTypeLabels: Record<SNRatioType, { label: string; description: string; example: string }> = {
  smaller: {
    label: '望小特性',
    description: '數值越小越好',
    example: '缺陷數、誤差、成本',
  },
  larger: {
    label: '望大特性',
    description: '數值越大越好',
    example: '強度、效率、壽命',
  },
  nominal: {
    label: '望目特性',
    description: '越接近目標值越好',
    example: '尺寸、溫度、濃度',
  },
};

// 分析結果
export interface AnalysisResult {
  meanResponse: Record<string, number[]>;  // 各因子各水準平均反應值 { A: [19.5, 20.1, 19.8], B: [...] }
  snRatios: Record<string, number[]>;      // 各因子各水準S/N比
  optimalLevels: Record<string, number>;   // 最佳水準索引 { A: 1, B: 2, C: 0 }
  factorImportance: string[];              // 因子重要性排序 ['B', 'A', 'C']
  predictedOptimal: number;                // 預測最佳值
  grandMean: number;                       // 整體平均值
}

// 直交表定義
export interface OrthogonalArray {
  name: string;           // L4, L8, L9, L16, L18, L27
  runs: number;           // 實驗次數
  maxFactors: number;     // 最大因子數
  levels: number;         // 水準數 (2 或 3)
  array: number[][];      // 直交表矩陣 (0-indexed)
}

// 實驗狀態
export interface ExperimentState {
  factors: Factor[];
  orthogonalArray: OrthogonalArray | null;
  runs: ExperimentRun[];
  snRatioType: SNRatioType;
  targetValue: number | null;
  analysisResult: AnalysisResult | null;
  trialsPerRun: number;   // 每次實驗的試驗次數
}

// 實驗操作
export interface ExperimentActions {
  addFactor: () => void;
  removeFactor: (id: string) => void;
  updateFactor: (id: string, updates: Partial<Factor>) => void;
  updateRun: (runId: number, trials: number[]) => void;
  setSNRatioType: (type: SNRatioType) => void;
  setTargetValue: (value: number | null) => void;
  setTrialsPerRun: (count: number) => void;
  calculateAnalysis: () => void;
  loadSampleData: (sampleKey: 'injection' | 'hardness' | 'defect') => void;
  resetExperiment: () => void;
}
