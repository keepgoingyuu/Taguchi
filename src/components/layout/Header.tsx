import { Sun, Moon, FlaskConical, Save, FolderOpen } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useExperiment } from '../../contexts/ExperimentContext';
import { Button } from '../ui/Button';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { actions } = useExperiment();

  const handleSave = () => {
    actions.saveExperiment();
    alert('✅ 實驗已儲存！');
  };

  const handleLoad = () => {
    const success = actions.loadExperiment();
    if (success) {
      alert('✅ 實驗已載入！');
    } else {
      alert('⚠️ 沒有找到儲存的實驗');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                田口實驗設計
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Taguchi Method Experiment Designer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              aria-label="快速儲存"
              title="快速儲存"
            >
              <Save className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoad}
              aria-label="快速載入"
              title="快速載入"
            >
              <FolderOpen className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? '切換深色模式' : '切換淺色模式'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
