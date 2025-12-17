import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useExperiment } from '../../contexts/ExperimentContext';
import { Card } from '../ui/Card';
import { calculateSNRatio } from '../../utils/taguchi/snRatio';

export function CalculationDetails() {
  const { state } = useExperiment();
  const { factors, runs, analysisResult, snRatioType, inputMode } = state;
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    snRatio: false,
    levelAverages: true,
    optimal: false,
  });

  if (!analysisResult) {
    return null;
  }

  const { snRatios, optimalLevels, predictedOptimal, grandMean } = analysisResult;

  // 切換展開/收合
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // 計算或取得每個實驗的 S/N 比
  const experimentSNRatios = runs.map((run) => {
    if (inputMode === 'snRatio') {
      // S/N 比直接輸入模式：直接使用輸入的值
      return run.snRatio ?? 0;
    } else {
      // 原始數據模式：計算 S/N 比
      const validTrials = run.trials.filter((t) => !isNaN(t) && t !== 0);
      if (validTrials.length === 0) return 0;
      return calculateSNRatio(validTrials, snRatioType);
    }
  });

  // 根據直交表找出每個因子每個水準對應的實驗
  const getLevelExperiments = (factorIndex: number, levelIndex: number) => {
    return runs
      .filter((run) => run.settings[factorIndex] === levelIndex)
      .map((run) => run.runId);
  };

  return (
    <Card
      title="步驟 4.5：計算過程詳解"
      description="詳細的田口方法計算步驟，幫助理解分析原理"
    >
      <div className="space-y-4">
        {/* S/N 比計算 - 僅在原始數據模式顯示 */}
        {inputMode === 'raw' && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('snRatio')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">1. S/N 比計算</span>
            </div>
            {expandedSections.snRatio ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.snRatio && (
            <div className="p-4 space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-semibold mb-2">公式（{snRatioType === 'larger' ? '望大特性' : snRatioType === 'smaller' ? '望小特性' : '望目特性'}）：</p>
                {snRatioType === 'larger' && (
                  <p className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    η = -10 × log₁₀(1/n × Σ(1/y²))
                  </p>
                )}
                {snRatioType === 'smaller' && (
                  <p className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    η = -10 × log₁₀(1/n × Σ(y²))
                  </p>
                )}
                {snRatioType === 'nominal' && (
                  <p className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    η = -10 × log₁₀(σ²)
                  </p>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left">實驗</th>
                      <th className="px-3 py-2 text-left">試驗數據</th>
                      <th className="px-3 py-2 text-left">平均值</th>
                      <th className="px-3 py-2 text-left">S/N 比 (dB)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {runs.map((run, idx) => (
                      <tr key={run.runId}>
                        <td className="px-3 py-2">{run.runId}</td>
                        <td className="px-3 py-2 font-mono text-xs">
                          {run.trials.filter((t) => !isNaN(t) && t !== 0).join(', ')}
                        </td>
                        <td className="px-3 py-2">{run.average.toFixed(2)}</td>
                        <td className="px-3 py-2 font-semibold text-blue-600 dark:text-blue-400">
                          {experimentSNRatios[idx].toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Level 平均值計算（重點！） */}
        <div className="border border-green-200 dark:border-green-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('levelAverages')}
            className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-green-500" />
              <span className="font-semibold">{inputMode === 'raw' ? '2' : '1'}. 各因子各水準平均 S/N 比計算</span>
            </div>
            {expandedSections.levelAverages ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.levelAverages && (
            <div className="p-4 space-y-6">
              {factors.map((factor, factorIdx) => (
                <div key={factor.id} className="space-y-3">
                  <h4 className="font-semibold text-lg text-green-700 dark:text-green-300">
                    因子 {factor.id}：{factor.name}
                  </h4>

                  {factor.levels.map((levelValue, levelIdx) => {
                    const experiments = getLevelExperiments(factorIdx, levelIdx);
                    const snValues = experiments.map((expId) => experimentSNRatios[expId - 1]);
                    const average = snRatios[factor.id][levelIdx];
                    const isOptimal = optimalLevels[factor.id] === levelIdx;

                    return (
                      <div
                        key={levelIdx}
                        className={`p-3 rounded-lg border-2 ${
                          isOptimal
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              水準 {levelIdx + 1} = {levelValue}
                            </span>
                            {isOptimal && (
                              <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">
                                最佳
                              </span>
                            )}
                          </div>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {average.toFixed(2)} dB
                          </span>
                        </div>

                        <div className="text-sm space-y-1">
                          <p className="font-mono text-gray-700 dark:text-gray-300">
                            η̄{factor.id}
                            {levelIdx + 1} = (η{experiments.join(' + η')}) / {experiments.length}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            實驗編號：{experiments.join(', ')}
                          </p>
                          <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            = ({snValues.map((v) => v.toFixed(2)).join(' + ')}) / {experiments.length}
                          </p>
                          <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            = {snValues.reduce((a, b) => a + b, 0).toFixed(2)} / {experiments.length}
                          </p>
                          <p className="font-mono text-xs font-semibold text-green-600 dark:text-green-400">
                            = {average.toFixed(2)} dB
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 最佳組合選擇 */}
        <div className="border border-purple-200 dark:border-purple-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('optimal')}
            className="w-full flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-500" />
              <span className="font-semibold">{inputMode === 'raw' ? '3' : '2'}. 最佳組合與預測值</span>
            </div>
            {expandedSections.optimal ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.optimal && (
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">選擇原則：</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  選擇各因子 S/N 比最大的水準（穩健性最好）
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <h4 className="font-semibold mb-2">最佳組合：</h4>
                <div className="flex flex-wrap gap-2">
                  {factors.map((factor) => (
                    <span
                      key={factor.id}
                      className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-semibold"
                    >
                      {factor.id}{optimalLevels[factor.id] + 1}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">預測值計算（加法模型）：</h4>
                <div className="text-sm space-y-1 font-mono">
                  <p className="text-gray-600 dark:text-gray-400">整體平均 μ = {grandMean.toFixed(2)}</p>
                  {factors.map((factor) => {
                    const optLevel = optimalLevels[factor.id];
                    const optValue = snRatios[factor.id][optLevel];
                    return (
                      <p key={factor.id} className="text-gray-600 dark:text-gray-400">
                        η{factor.id}
                        {optLevel + 1} = {optValue.toFixed(2)}
                      </p>
                    );
                  })}
                  <p className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                    η_predicted = μ +{' '}
                    {factors.map((factor, idx) => (
                      <span key={factor.id}>
                        (η{factor.id}
                        {optimalLevels[factor.id] + 1} - μ){idx < factors.length - 1 ? ' + ' : ''}
                      </span>
                    ))}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    = {grandMean.toFixed(2)} +{' '}
                    {factors
                      .map((factor) => {
                        const diff = snRatios[factor.id][optimalLevels[factor.id]] - grandMean;
                        return `(${diff.toFixed(2)})`;
                      })
                      .join(' + ')}
                  </p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    = {predictedOptimal.toFixed(2)} dB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
