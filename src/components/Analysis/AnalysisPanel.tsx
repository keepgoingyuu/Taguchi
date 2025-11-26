import { BarChart3 } from 'lucide-react';
import { useExperiment } from '../../contexts/ExperimentContext';
import { Card } from '../ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../ui/Table';

export function AnalysisPanel() {
  const { state } = useExperiment();
  const { factors, analysisResult } = state;

  if (!analysisResult) {
    return null;
  }

  const { meanResponse, snRatios, factorImportance, grandMean } = analysisResult;

  // 取得最大水準數
  const maxLevels = Math.max(...factors.map((f) => f.levels.length));

  return (
    <Card
      title="步驟 4：分析結果"
      description="各因子各水準的平均反應值與 S/N 比"
    >
      <div className="space-y-6">
        {/* 整體平均 */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">整體平均值：</span>
            <span className="ml-2 text-lg font-bold text-blue-600 dark:text-blue-400">
              {grandMean.toFixed(4)}
            </span>
          </div>
        </div>

        {/* 平均反應值表 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            平均反應值表
          </h4>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header className="w-32">因子</TableCell>
                  {Array.from({ length: maxLevels }).map((_, i) => (
                    <TableCell header key={i} className="text-center">
                      水準 {i + 1}
                    </TableCell>
                  ))}
                  <TableCell header className="text-center">差值</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {factors.map((factor) => {
                  const values = meanResponse[factor.id] || [];
                  const max = Math.max(...values);
                  const min = Math.min(...values);
                  const range = max - min;

                  return (
                    <TableRow key={factor.id}>
                      <TableCell className="font-medium">
                        {factor.id} ({factor.name})
                      </TableCell>
                      {Array.from({ length: maxLevels }).map((_, i) => {
                        const value = values[i];
                        const isMax = value === max;
                        const isMin = value === min;

                        return (
                          <TableCell
                            key={i}
                            className={`text-center ${
                              isMax
                                ? 'text-green-600 dark:text-green-400 font-semibold'
                                : isMin
                                ? 'text-red-500 dark:text-red-400'
                                : ''
                            }`}
                          >
                            {value !== undefined ? value.toFixed(4) : '-'}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center font-medium">
                        {range.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* S/N 比表 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            S/N 比表（信號雜訊比）
          </h4>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header className="w-32">因子</TableCell>
                  {Array.from({ length: maxLevels }).map((_, i) => (
                    <TableCell header key={i} className="text-center">
                      水準 {i + 1}
                    </TableCell>
                  ))}
                  <TableCell header className="text-center">差值</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {factors.map((factor) => {
                  const values = snRatios[factor.id] || [];
                  const max = Math.max(...values);
                  const min = Math.min(...values);
                  const range = max - min;

                  return (
                    <TableRow key={factor.id}>
                      <TableCell className="font-medium">
                        {factor.id} ({factor.name})
                      </TableCell>
                      {Array.from({ length: maxLevels }).map((_, i) => {
                        const value = values[i];
                        const isMax = value === max;

                        return (
                          <TableCell
                            key={i}
                            className={`text-center ${
                              isMax ? 'text-green-600 dark:text-green-400 font-semibold' : ''
                            }`}
                          >
                            {value !== undefined ? value.toFixed(4) : '-'}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center font-medium">
                        {range.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* 因子重要性排序 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            因子影響力排序（依 S/N 比差值大小）
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            {factorImportance.map((factorId, index) => {
              const factor = factors.find((f) => f.id === factorId);
              return (
                <div
                  key={factorId}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600"
                >
                  <span className="w-5 h-5 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium">
                    {factorId} ({factor?.name})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
