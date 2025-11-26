import { Table2, Info } from 'lucide-react';
import { useExperiment } from '../../contexts/ExperimentContext';
import { Card } from '../ui/Card';

export function ArraySelector() {
  const { state } = useExperiment();
  const { orthogonalArray, factors } = state;

  if (factors.length === 0) {
    return null;
  }

  return (
    <Card title="步驟 2：直交表選擇">
      <div className="space-y-4">
        {orthogonalArray ? (
          <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <Table2 className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200">
                {orthogonalArray.name} 直交表
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {orthogonalArray.runs} 次實驗 × {factors.length} 個因子 × {orthogonalArray.levels} 水準
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                系統已根據因子數量和水準自動選擇最適合的直交表
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <Info className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                無法選擇直交表
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                目前的因子設定無法匹配現有的直交表。請確認：
              </p>
              <ul className="text-xs text-amber-600 dark:text-amber-400 mt-2 list-disc list-inside">
                <li>所有因子的水準數相同</li>
                <li>水準數為 2 或 3</li>
                <li>因子數量不超過直交表支援的上限</li>
              </ul>
            </div>
          </div>
        )}

        {/* 直交表說明 */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p><strong>支援的直交表：</strong></p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            <li>L4：2水準，最多3因子</li>
            <li>L8：2水準，最多7因子</li>
            <li>L9：3水準，最多4因子</li>
            <li>L16：2水準，最多15因子</li>
            <li>L18：3水準，最多8因子</li>
            <li>L27：3水準，最多13因子</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
