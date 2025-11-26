import type { Factor, ExperimentRun } from '../types';

/**
 * 驗證因子設定
 */
export function validateFactor(factor: Factor): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!factor.name.trim()) {
    errors.push('因子名稱不可為空');
  }

  if (factor.levels.length < 2) {
    errors.push('水準數量至少需要 2 個');
  }

  if (factor.levels.length > 5) {
    errors.push('水準數量最多 5 個');
  }

  if (factor.levels.some((level) => isNaN(level))) {
    errors.push('所有水準值必須是有效數字');
  }

  // 檢查重複的水準值
  const uniqueLevels = new Set(factor.levels);
  if (uniqueLevels.size !== factor.levels.length) {
    errors.push('水準值不可重複');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 驗證所有因子
 */
export function validateFactors(factors: Factor[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (factors.length === 0) {
    errors.push('請至少新增一個因子');
    return { valid: false, errors };
  }

  if (factors.length > 7) {
    errors.push('因子數量最多 7 個');
  }

  // 檢查所有因子的水準數是否一致（田口方法的基本要求）
  const levelCounts = factors.map((f) => f.levels.length);
  const uniqueLevelCounts = new Set(levelCounts);
  if (uniqueLevelCounts.size > 1) {
    errors.push('所有因子的水準數必須相同');
  }

  // 驗證每個因子
  factors.forEach((factor, index) => {
    const { errors: factorErrors } = validateFactor(factor);
    factorErrors.forEach((err) => {
      errors.push(`因子 ${index + 1} (${factor.name || factor.id}): ${err}`);
    });
  });

  return { valid: errors.length === 0, errors };
}

/**
 * 驗證實驗結果
 */
export function validateRun(run: ExperimentRun): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (run.trials.length === 0) {
    errors.push(`實驗 ${run.runId}: 請輸入至少一個試驗結果`);
  }

  if (run.trials.some((trial) => isNaN(trial))) {
    errors.push(`實驗 ${run.runId}: 所有試驗結果必須是有效數字`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 驗證所有實驗結果
 */
export function validateRuns(runs: ExperimentRun[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (runs.length === 0) {
    errors.push('沒有實驗資料');
    return { valid: false, errors };
  }

  // 檢查是否所有實驗都有結果
  const incompleteRuns = runs.filter(
    (run) => run.trials.length === 0 || run.trials.every((t) => isNaN(t) || t === 0)
  );

  if (incompleteRuns.length > 0) {
    errors.push(`以下實驗尚未填寫結果: ${incompleteRuns.map((r) => r.runId).join(', ')}`);
  }

  // 驗證每個實驗
  runs.forEach((run) => {
    const { errors: runErrors } = validateRun(run);
    errors.push(...runErrors);
  });

  return { valid: errors.length === 0, errors };
}

/**
 * 驗證目標值（僅望目特性需要）
 */
export function validateTargetValue(
  targetValue: number | null,
  snRatioType: string
): { valid: boolean; error: string | null } {
  if (snRatioType === 'nominal') {
    if (targetValue === null || isNaN(targetValue)) {
      return { valid: false, error: '望目特性需要設定目標值' };
    }
  }
  return { valid: true, error: null };
}

/**
 * 檢查是否可以進行分析
 */
export function canPerformAnalysis(
  factors: Factor[],
  runs: ExperimentRun[],
  targetValue: number | null,
  snRatioType: string
): { canAnalyze: boolean; errors: string[] } {
  const errors: string[] = [];

  const factorValidation = validateFactors(factors);
  if (!factorValidation.valid) {
    errors.push(...factorValidation.errors);
  }

  const runsValidation = validateRuns(runs);
  if (!runsValidation.valid) {
    errors.push(...runsValidation.errors);
  }

  const targetValidation = validateTargetValue(targetValue, snRatioType);
  if (!targetValidation.valid && targetValidation.error) {
    errors.push(targetValidation.error);
  }

  return { canAnalyze: errors.length === 0, errors };
}
