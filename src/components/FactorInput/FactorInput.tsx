import { Plus, Upload, RotateCcw } from 'lucide-react';
import { useExperiment } from '../../contexts/ExperimentContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FactorCard } from './FactorCard';

export function FactorInput() {
  const { state, actions } = useExperiment();
  const { factors } = state;

  return (
    <Card
      title="步驟 1：設定實驗因子"
      description="新增要分析的因子並設定各水準的數值。所有因子的水準數必須相同。"
    >
      <div className="space-y-4">
        {/* 操作按鈕 */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={actions.addFactor}
            disabled={factors.length >= 7}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            新增因子
          </Button>
          <Button
            variant="secondary"
            onClick={actions.loadSampleData}
            size="sm"
          >
            <Upload className="w-4 h-4 mr-1" />
            載入範例
          </Button>
          {factors.length > 0 && (
            <Button
              variant="ghost"
              onClick={actions.resetExperiment}
              size="sm"
              className="text-red-500 hover:text-red-600"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
          )}
        </div>

        {/* 因子列表 */}
        {factors.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>尚未設定任何因子</p>
            <p className="text-sm mt-1">點擊「新增因子」開始，或「載入範例」查看示範</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {factors.map((factor) => (
              <FactorCard
                key={factor.id}
                factor={factor}
                onUpdate={(updates) => actions.updateFactor(factor.id, updates)}
                onRemove={() => actions.removeFactor(factor.id)}
                canRemove={factors.length > 1}
              />
            ))}
          </div>
        )}

        {/* 提示訊息 */}
        {factors.length > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <strong>提示：</strong>
            {factors.length === 1
              ? '再新增更多因子以進行完整分析'
              : `已設定 ${factors.length} 個因子，每個因子 ${factors[0]?.levels.length || 0} 個水準`}
          </div>
        )}
      </div>
    </Card>
  );
}
