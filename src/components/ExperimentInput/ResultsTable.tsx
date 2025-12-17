import { Calculator, AlertCircle } from 'lucide-react';
import { useExperiment } from '../../contexts/ExperimentContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../ui/Table';
import { SNRatioTypeLabels, InputModeLabels } from '../../types';
import { getArraySubset, convertToActualLevels } from '../../utils/taguchi/orthogonalArrays';
import { canPerformAnalysis } from '../../utils/validation';

export function ResultsTable() {
  const { state, actions } = useExperiment();
  const {
    factors,
    orthogonalArray,
    runs,
    snRatioType,
    targetValue,
    trialsPerRun,
    inputMode,
  } = state;

  if (!orthogonalArray || factors.length === 0) {
    return null;
  }

  const subset = getArraySubset(orthogonalArray, factors.length);
  const actualLevels = convertToActualLevels(subset, factors);

  const handleTrialChange = (runId: number, trialIndex: number, value: string) => {
    const run = runs.find((r) => r.runId === runId);
    if (!run) return;

    const newTrials = [...run.trials];
    newTrials[trialIndex] = parseFloat(value) || 0;
    actions.updateRun(runId, newTrials);
  };

  const handleSNRatioChange = (runId: number, value: string) => {
    const snRatio = parseFloat(value) || 0;
    actions.updateRunSNRatio(runId, snRatio);
  };

  const validation = canPerformAnalysis(factors, runs, targetValue, snRatioType);

  const inputModeOptions = Object.entries(InputModeLabels).map(([value, { label }]) => ({
    value,
    label,
  }));

  const snOptions = Object.entries(SNRatioTypeLabels).map(([value, { label, description }]) => ({
    value,
    label: `${label} - ${description}`,
  }));

  const trialsOptions = [
    { value: '1', label: '1 次試驗' },
    { value: '2', label: '2 次試驗' },
    { value: '3', label: '3 次試驗' },
    { value: '4', label: '4 次試驗' },
    { value: '5', label: '5 次試驗' },
  ];

  return (
    <Card
      title="步驟 3：輸入實驗結果"
      description="依照實驗計畫進行實驗，並填入各次試驗的量測結果"
    >
      <div className="space-y-6">
        {/* 設定區 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="資料輸入模式"
            options={inputModeOptions}
            value={inputMode}
            onChange={(e) => actions.setInputMode(e.target.value as typeof inputMode)}
          />

          {inputMode === 'raw' && (
            <Select
              label="每次實驗試驗數"
              options={trialsOptions}
              value={trialsPerRun.toString()}
              onChange={(e) => actions.setTrialsPerRun(parseInt(e.target.value))}
            />
          )}

          {inputMode === 'raw' && (
            <Select
              label="S/N 比類型"
              options={snOptions}
              value={snRatioType}
              onChange={(e) => actions.setSNRatioType(e.target.value as typeof snRatioType)}
            />
          )}

          {inputMode === 'raw' && snRatioType === 'nominal' && (
            <Input
              label="目標值"
              type="number"
              value={targetValue ?? ''}
              onChange={(e) => actions.setTargetValue(parseFloat(e.target.value) || null)}
              placeholder="輸入目標值"
              step="any"
            />
          )}
        </div>

        {/* 模式說明 */}
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <strong>{InputModeLabels[inputMode || 'raw'].label}：</strong>
          {InputModeLabels[inputMode || 'raw'].description}
          {inputMode === 'raw' && (
            <>
              <br />
              <strong className="mt-2 inline-block">{SNRatioTypeLabels[snRatioType].label}：</strong>
              {SNRatioTypeLabels[snRatioType].description}
              <span className="text-gray-500 dark:text-gray-500">
                {' '}（例如：{SNRatioTypeLabels[snRatioType].example}）
              </span>
            </>
          )}
        </div>

        {/* 結果輸入表格 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header className="w-16 text-center sticky left-0 bg-gray-100 dark:bg-gray-700 z-10">
                    實驗
                  </TableCell>
                  {factors.map((factor) => (
                    <TableCell header key={factor.id} className="text-center min-w-20">
                      {factor.id}
                    </TableCell>
                  ))}
                  {inputMode === 'raw' ? (
                    <>
                      {Array.from({ length: trialsPerRun }).map((_, i) => (
                        <TableCell header key={`trial-${i}`} className="text-center min-w-24">
                          試驗 {i + 1}
                        </TableCell>
                      ))}
                      <TableCell header className="text-center min-w-20">
                        平均
                      </TableCell>
                    </>
                  ) : (
                    <TableCell header className="text-center min-w-32">
                      S/N 比 (dB)
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {runs.map((run, runIndex) => (
                  <TableRow key={run.runId}>
                    <TableCell className="text-center font-medium sticky left-0 bg-white dark:bg-gray-800 z-10">
                      {run.runId}
                    </TableCell>
                    {actualLevels[runIndex].map((level, factorIndex) => (
                      <TableCell key={factorIndex} className="text-center text-gray-500 dark:text-gray-400">
                        {level}
                      </TableCell>
                    ))}
                    {inputMode === 'raw' ? (
                      <>
                        {Array.from({ length: trialsPerRun }).map((_, trialIndex) => (
                          <TableCell key={`trial-${trialIndex}`} className="p-1">
                            <input
                              type="number"
                              value={run.trials[trialIndex] || ''}
                              onChange={(e) => handleTrialChange(run.runId, trialIndex, e.target.value)}
                              className="w-full px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                              step="any"
                              placeholder="0"
                            />
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-medium">
                          {run.average.toFixed(2)}
                        </TableCell>
                      </>
                    ) : (
                      <TableCell className="p-1">
                        <input
                          type="number"
                          value={run.snRatio ?? ''}
                          onChange={(e) => handleSNRatioChange(run.runId, e.target.value)}
                          className="w-full px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* 驗證訊息 */}
        {!validation.canAnalyze && validation.errors.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-medium">請完成以下項目後才能進行分析：</p>
              <ul className="mt-1 list-disc list-inside text-amber-600 dark:text-amber-400">
                {validation.errors.slice(0, 3).map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 分析按鈕 */}
        <div className="flex justify-end">
          <Button
            onClick={actions.calculateAnalysis}
            disabled={!validation.canAnalyze}
            size="lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            執行田口分析
          </Button>
        </div>
      </div>
    </Card>
  );
}
