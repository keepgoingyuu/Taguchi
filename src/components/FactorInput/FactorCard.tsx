import { Trash2, Plus, Minus } from 'lucide-react';
import type { Factor } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface FactorCardProps {
  factor: Factor;
  onUpdate: (updates: Partial<Factor>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function FactorCard({ factor, onUpdate, onRemove, canRemove }: FactorCardProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value });
  };

  const handleLevelChange = (index: number, value: string) => {
    const newLevels = [...factor.levels];
    // 只有當整個字串都是有效數字時，才轉換成數字
    const trimmedValue = value.trim();
    const numValue = parseFloat(trimmedValue);

    // 檢查是否為純數字：轉換後再轉回字串要完全相同
    if (!isNaN(numValue) && String(numValue) === trimmedValue) {
      newLevels[index] = numValue;
    } else {
      // 保留原始字串（支援 "1:1", "低", "高" 等）
      newLevels[index] = value;
    }
    onUpdate({ levels: newLevels });
  };

  const addLevel = () => {
    if (factor.levels.length < 5) {
      const lastLevel = factor.levels[factor.levels.length - 1];
      // 如果最後一個水準是數字，自動 +1；如果是文字，就用空字串
      const newLevel = typeof lastLevel === 'number' ? lastLevel + 1 : '';
      onUpdate({ levels: [...factor.levels, newLevel] });
    }
  };

  const removeLevel = () => {
    if (factor.levels.length > 2) {
      onUpdate({ levels: factor.levels.slice(0, -1) });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-lg">
            {factor.id}
          </span>
          <Input
            value={factor.name}
            onChange={handleNameChange}
            placeholder="因子名稱"
            className="max-w-xs"
          />
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            水準值 ({factor.levels.length} 個)
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={removeLevel}
              disabled={factor.levels.length <= 2}
              title="減少水準"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={addLevel}
              disabled={factor.levels.length >= 5}
              title="增加水準"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {factor.levels.map((level, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-6">
                L{index + 1}
              </span>
              <input
                type="text"
                value={level}
                onChange={(e) => handleLevelChange(index, e.target.value)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="值"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
