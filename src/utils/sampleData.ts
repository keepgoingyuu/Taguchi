import type { Factor, ExperimentRun, SNRatioType } from '../types';

/**
 * 預設範例：塑膠射出成型尺寸優化
 * 目標：達到 20.0mm 的精確尺寸（望目特性）
 */
export const defaultSampleData = {
  factors: [
    { id: 'A', name: '模具溫度 (°C)', levels: [60, 70, 80] },
    { id: 'B', name: '射出壓力 (MPa)', levels: [50, 60, 70] },
    { id: 'C', name: '保壓時間 (秒)', levels: [5, 10, 15] },
  ] as Factor[],

  snRatioType: 'nominal' as SNRatioType,
  targetValue: 20.0,
  trialsPerRun: 3,

  // L9 直交表對應的 9 組實驗結果
  runs: [
    { runId: 1, settings: [0, 0, 0], trials: [19.8, 20.1, 19.9], average: 19.93 },
    { runId: 2, settings: [0, 1, 1], trials: [20.2, 20.0, 20.1], average: 20.10 },
    { runId: 3, settings: [0, 2, 2], trials: [20.3, 20.5, 20.2], average: 20.33 },
    { runId: 4, settings: [1, 0, 1], trials: [19.9, 20.0, 19.8], average: 19.90 },
    { runId: 5, settings: [1, 1, 2], trials: [20.0, 20.1, 20.0], average: 20.03 },
    { runId: 6, settings: [1, 2, 0], trials: [20.4, 20.3, 20.5], average: 20.40 },
    { runId: 7, settings: [2, 0, 2], trials: [19.7, 19.9, 19.6], average: 19.73 },
    { runId: 8, settings: [2, 1, 0], trials: [20.1, 20.0, 20.2], average: 20.10 },
    { runId: 9, settings: [2, 2, 1], trials: [20.2, 20.1, 20.3], average: 20.20 },
  ] as ExperimentRun[],
};

/**
 * 範例二：鋼材熱處理硬度優化（望大特性）
 */
export const hardnessSampleData = {
  factors: [
    { id: 'A', name: '淬火溫度 (°C)', levels: [800, 850, 900] },
    { id: 'B', name: '保溫時間 (分鐘)', levels: [30, 45, 60] },
    { id: 'C', name: '冷卻速率', levels: [1, 2, 3] }, // 1=慢, 2=中, 3=快
  ] as Factor[],

  snRatioType: 'larger' as SNRatioType,
  targetValue: null,
  trialsPerRun: 3,

  runs: [
    { runId: 1, settings: [0, 0, 0], trials: [52, 54, 53], average: 53.0 },
    { runId: 2, settings: [0, 1, 1], trials: [56, 58, 57], average: 57.0 },
    { runId: 3, settings: [0, 2, 2], trials: [60, 62, 61], average: 61.0 },
    { runId: 4, settings: [1, 0, 1], trials: [58, 59, 58], average: 58.33 },
    { runId: 5, settings: [1, 1, 2], trials: [62, 64, 63], average: 63.0 },
    { runId: 6, settings: [1, 2, 0], trials: [55, 57, 56], average: 56.0 },
    { runId: 7, settings: [2, 0, 2], trials: [61, 63, 62], average: 62.0 },
    { runId: 8, settings: [2, 1, 0], trials: [58, 60, 59], average: 59.0 },
    { runId: 9, settings: [2, 2, 1], trials: [63, 65, 64], average: 64.0 },
  ] as ExperimentRun[],
};

/**
 * 範例三：印刷品缺陷優化（望小特性）
 */
export const defectSampleData = {
  factors: [
    { id: 'A', name: '油墨黏度', levels: [1, 2, 3] }, // 1=低, 2=中, 3=高
    { id: 'B', name: '印刷速度 (m/min)', levels: [50, 75, 100] },
    { id: 'C', name: '壓力 (kPa)', levels: [200, 250, 300] },
  ] as Factor[],

  snRatioType: 'smaller' as SNRatioType,
  targetValue: null,
  trialsPerRun: 3,

  runs: [
    { runId: 1, settings: [0, 0, 0], trials: [5, 6, 4], average: 5.0 },
    { runId: 2, settings: [0, 1, 1], trials: [8, 7, 9], average: 8.0 },
    { runId: 3, settings: [0, 2, 2], trials: [12, 11, 13], average: 12.0 },
    { runId: 4, settings: [1, 0, 1], trials: [3, 4, 3], average: 3.33 },
    { runId: 5, settings: [1, 1, 2], trials: [6, 5, 6], average: 5.67 },
    { runId: 6, settings: [1, 2, 0], trials: [7, 8, 7], average: 7.33 },
    { runId: 7, settings: [2, 0, 2], trials: [4, 5, 4], average: 4.33 },
    { runId: 8, settings: [2, 1, 0], trials: [6, 6, 7], average: 6.33 },
    { runId: 9, settings: [2, 2, 1], trials: [9, 10, 9], average: 9.33 },
  ] as ExperimentRun[],
};

export const sampleDatasets = {
  injection: { name: '塑膠射出成型（望目）', data: defaultSampleData },
  hardness: { name: '鋼材熱處理硬度（望大）', data: hardnessSampleData },
  defect: { name: '印刷缺陷數量（望小）', data: defectSampleData },
};
