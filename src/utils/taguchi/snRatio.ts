import type { SNRatioType } from '../../types';

/**
 * 小越好 (Smaller-the-better)
 * 適用於：缺陷數、誤差、成本、噪音等
 * 公式：SN = -10 × log₁₀(Σyᵢ²/n)
 */
export function calculateSTB(values: number[]): number {
  if (values.length === 0) return 0;
  const n = values.length;
  const sumSquares = values.reduce((sum, y) => sum + y * y, 0);
  return -10 * Math.log10(sumSquares / n);
}

/**
 * 大越好 (Larger-the-better)
 * 適用於：強度、效率、壽命、產量等
 * 公式：SN = -10 × log₁₀(Σ(1/yᵢ²)/n)
 */
export function calculateLTB(values: number[]): number {
  if (values.length === 0) return 0;
  // 過濾掉零值以避免除以零
  const nonZeroValues = values.filter((v) => v !== 0);
  if (nonZeroValues.length === 0) return -Infinity;
  const n = nonZeroValues.length;
  const sumInverseSquares = nonZeroValues.reduce((sum, y) => sum + 1 / (y * y), 0);
  return -10 * Math.log10(sumInverseSquares / n);
}

/**
 * 望目特性 (Nominal-the-best)
 * 適用於：尺寸、溫度、濃度等需要達到特定目標值
 * 公式：SN = 10 × log₁₀(μ²/σ²)
 * 其中 μ = 平均值, σ² = 變異數
 */
export function calculateNTB(values: number[]): number {
  if (values.length < 2) return 0;
  const n = values.length;
  const mean = values.reduce((sum, v) => sum + v, 0) / n;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (n - 1);
  if (variance === 0) return Infinity; // 完美一致
  return 10 * Math.log10((mean * mean) / variance);
}

/**
 * 根據 S/N 比類型計算 S/N 比
 */
export function calculateSNRatio(values: number[], type: SNRatioType): number {
  switch (type) {
    case 'smaller':
      return calculateSTB(values);
    case 'larger':
      return calculateLTB(values);
    case 'nominal':
      return calculateNTB(values);
    default:
      return 0;
  }
}

/**
 * 計算平均值
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * 計算標準差
 */
export function calculateStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = calculateMean(values);
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}
