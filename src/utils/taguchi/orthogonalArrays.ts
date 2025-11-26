import type { OrthogonalArray, Factor } from '../../types';

// L4(2³) - 4次實驗，最多3個2水準因子
const L4: OrthogonalArray = {
  name: 'L4',
  runs: 4,
  maxFactors: 3,
  levels: 2,
  array: [
    [0, 0, 0],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 0],
  ],
};

// L8(2⁷) - 8次實驗，最多7個2水準因子
const L8: OrthogonalArray = {
  name: 'L8',
  runs: 8,
  maxFactors: 7,
  levels: 2,
  array: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 0, 0],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 0],
    [1, 1, 0, 0, 1, 1, 0],
    [1, 1, 0, 1, 0, 0, 1],
  ],
};

// L9(3⁴) - 9次實驗，最多4個3水準因子
const L9: OrthogonalArray = {
  name: 'L9',
  runs: 9,
  maxFactors: 4,
  levels: 3,
  array: [
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [0, 2, 2, 2],
    [1, 0, 1, 2],
    [1, 1, 2, 0],
    [1, 2, 0, 1],
    [2, 0, 2, 1],
    [2, 1, 0, 2],
    [2, 2, 1, 0],
  ],
};

// L16(2¹⁵) - 16次實驗，最多15個2水準因子
const L16: OrthogonalArray = {
  name: 'L16',
  runs: 16,
  maxFactors: 15,
  levels: 2,
  array: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0],
  ],
};

// L18(2¹×3⁷) - 18次實驗，1個2水準因子+最多7個3水準因子
const L18: OrthogonalArray = {
  name: 'L18',
  runs: 18,
  maxFactors: 8,
  levels: 3, // 主要是3水準
  array: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 2, 2, 2, 2, 2, 2],
    [0, 1, 0, 0, 1, 1, 2, 2],
    [0, 1, 1, 1, 2, 2, 0, 0],
    [0, 1, 2, 2, 0, 0, 1, 1],
    [0, 2, 0, 1, 0, 2, 1, 2],
    [0, 2, 1, 2, 1, 0, 2, 0],
    [0, 2, 2, 0, 2, 1, 0, 1],
    [1, 0, 0, 2, 2, 1, 1, 0],
    [1, 0, 1, 0, 0, 2, 2, 1],
    [1, 0, 2, 1, 1, 0, 0, 2],
    [1, 1, 0, 1, 2, 0, 2, 1],
    [1, 1, 1, 2, 0, 1, 0, 2],
    [1, 1, 2, 0, 1, 2, 1, 0],
    [1, 2, 0, 2, 1, 2, 0, 1],
    [1, 2, 1, 0, 2, 0, 1, 2],
    [1, 2, 2, 1, 0, 1, 2, 0],
  ],
};

// L27(3¹³) - 27次實驗，最多13個3水準因子
const L27: OrthogonalArray = {
  name: 'L27',
  runs: 27,
  maxFactors: 13,
  levels: 3,
  array: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2],
    [0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0],
    [0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1],
    [0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1, 1, 1],
    [0, 2, 2, 2, 1, 1, 1, 0, 0, 0, 2, 2, 2],
    [0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0],
    [1, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2],
    [1, 0, 1, 2, 1, 2, 0, 1, 2, 0, 1, 2, 0],
    [1, 0, 1, 2, 2, 0, 1, 2, 0, 1, 2, 0, 1],
    [1, 1, 2, 0, 0, 1, 2, 1, 2, 0, 2, 0, 1],
    [1, 1, 2, 0, 1, 2, 0, 2, 0, 1, 0, 1, 2],
    [1, 1, 2, 0, 2, 0, 1, 0, 1, 2, 1, 2, 0],
    [1, 2, 0, 1, 0, 1, 2, 2, 0, 1, 1, 2, 0],
    [1, 2, 0, 1, 1, 2, 0, 0, 1, 2, 2, 0, 1],
    [1, 2, 0, 1, 2, 0, 1, 1, 2, 0, 0, 1, 2],
    [2, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1],
    [2, 0, 2, 1, 1, 0, 2, 1, 0, 2, 1, 0, 2],
    [2, 0, 2, 1, 2, 1, 0, 2, 1, 0, 2, 1, 0],
    [2, 1, 0, 2, 0, 2, 1, 1, 0, 2, 2, 1, 0],
    [2, 1, 0, 2, 1, 0, 2, 2, 1, 0, 0, 2, 1],
    [2, 1, 0, 2, 2, 1, 0, 0, 2, 1, 1, 0, 2],
    [2, 2, 1, 0, 0, 2, 1, 2, 1, 0, 1, 0, 2],
    [2, 2, 1, 0, 1, 0, 2, 0, 2, 1, 2, 1, 0],
    [2, 2, 1, 0, 2, 1, 0, 1, 0, 2, 0, 2, 1],
  ],
};

// 所有可用的直交表
export const orthogonalArrays: OrthogonalArray[] = [L4, L8, L9, L16, L18, L27];

/**
 * 根據因子數量和水準數自動選擇合適的直交表
 */
export function selectOrthogonalArray(factors: Factor[]): OrthogonalArray | null {
  if (factors.length === 0) return null;

  const factorCount = factors.length;
  const maxLevels = Math.max(...factors.map((f) => f.levels.length));

  // 選擇邏輯：
  // 1. 水準數必須相容
  // 2. 因子數量必須 <= maxFactors
  // 3. 優先選擇實驗次數最少的

  const compatibleArrays = orthogonalArrays.filter((arr) => {
    // 水準數相容檢查
    if (maxLevels === 2 && arr.levels >= 2) return factorCount <= arr.maxFactors;
    if (maxLevels === 3 && arr.levels === 3) return factorCount <= arr.maxFactors;
    return false;
  });

  if (compatibleArrays.length === 0) return null;

  // 優先選擇實驗次數最少的
  return compatibleArrays.sort((a, b) => a.runs - b.runs)[0];
}

/**
 * 取得直交表的子陣列（只取前N個因子的欄位）
 */
export function getArraySubset(array: OrthogonalArray, factorCount: number): number[][] {
  return array.array.map((row) => row.slice(0, factorCount));
}

/**
 * 將直交表轉換為顯示用的實際水準值
 */
export function convertToActualLevels(
  array: number[][],
  factors: Factor[]
): (number | string)[][] {
  return array.map((row) =>
    row.map((levelIndex, factorIndex) => {
      if (factorIndex >= factors.length) return '-';
      const factor = factors[factorIndex];
      return factor.levels[levelIndex] ?? '-';
    })
  );
}
