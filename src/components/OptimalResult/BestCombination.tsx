import { Trophy, TrendingUp, Target } from 'lucide-react';
import { useExperiment } from '../../contexts/ExperimentContext';
import { Card } from '../ui/Card';

export function BestCombination() {
  const { state } = useExperiment();
  const { factors, analysisResult, snRatioType, runs } = state;

  if (!analysisResult) {
    return null;
  }

  const { optimalLevels, predictedOptimal, grandMean } = analysisResult;

  // 計算改善幅度
  const currentBest = Math.max(...runs.map((r) => r.average));
  const currentWorst = Math.min(...runs.map((r) => r.average));
  const improvementFromWorst =
    currentWorst !== 0
      ? ((predictedOptimal - currentWorst) / Math.abs(currentWorst)) * 100
      : 0;
  const improvementFromAvg =
    grandMean !== 0
      ? ((predictedOptimal - grandMean) / Math.abs(grandMean)) * 100
      : 0;

  return (
    <Card
      title="步驟 5：最佳參數組合"
      description="根據 S/N 比分析得出的最佳因子水準設定"
    >
      <div className="space-y-6">
        {/* 最佳組合卡片 */}
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-4">
                推薦的最佳參數設定
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {factors.map((factor) => {
                  const optimalLevel = optimalLevels[factor.id];
                  const optimalValue = factor.levels[optimalLevel];

                  return (
                    <div
                      key={factor.id}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-green-500 text-white font-bold rounded-lg">
                        {factor.id}
                      </span>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {factor.name}
                        </p>
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {optimalValue}{' '}
                          <span className="text-xs font-normal text-gray-500">
                            (水準 {optimalLevel + 1})
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 預測值與改善幅度 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                預測最佳值
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {predictedOptimal.toFixed(4)}
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
              基於加法模型預測
            </p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                相對平均改善
              </span>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {improvementFromAvg >= 0 ? '+' : ''}
              {improvementFromAvg.toFixed(2)}%
            </p>
            <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">
              整體平均: {grandMean.toFixed(4)}
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                相對最差改善
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {improvementFromWorst >= 0 ? '+' : ''}
              {improvementFromWorst.toFixed(2)}%
            </p>
            <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">
              最差結果: {currentWorst.toFixed(4)}
            </p>
          </div>
        </div>

        {/* 說明文字 */}
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">結果說明</h4>
          <ul className="space-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
            <li>
              最佳參數組合是根據各因子 S/N 比最大的水準選出
            </li>
            <li>
              預測值使用加法模型計算：η = 整體平均 + Σ(各因子最佳水準效應 - 整體平均)
            </li>
            <li>
              {snRatioType === 'smaller'
                ? '望小特性：實際值越小越好'
                : snRatioType === 'larger'
                ? '望大特性：實際值越大越好'
                : '望目特性：實際值越接近目標值越好'}
            </li>
            <li>
              建議進行確認實驗以驗證預測結果
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
