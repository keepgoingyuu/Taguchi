import Plot from 'react-plotly.js';
import { useExperiment } from '../../contexts/ExperimentContext';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { SNRatioTypeLabels } from '../../types';

export function SNRatioPlot() {
  const { state } = useExperiment();
  const { theme } = useTheme();
  const { factors, analysisResult, snRatioType } = state;

  if (!analysisResult) {
    return null;
  }

  const { snRatios } = analysisResult;
  const isDark = theme === 'dark';

  // 為每個因子建立一條線
  const traces = factors.map((factor, index) => {
    const values = snRatios[factor.id] || [];
    const x = factor.levels.map((_, i) => `水準 ${i + 1}`);

    const colors = [
      '#3B82F6', // blue
      '#EF4444', // red
      '#10B981', // green
      '#F59E0B', // amber
      '#8B5CF6', // violet
      '#EC4899', // pink
      '#06B6D4', // cyan
    ];

    return {
      x,
      y: values,
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: `${factor.id} (${factor.name})`,
      line: { color: colors[index % colors.length], width: 2 },
      marker: { size: 8 },
    };
  });

  const layout = {
    title: {
      text: 'S/N 比圖（信號雜訊比）',
      font: { size: 16, color: isDark ? '#F3F4F6' : '#1F2937' },
    },
    xaxis: {
      title: '水準',
      color: isDark ? '#9CA3AF' : '#6B7280',
      gridcolor: isDark ? '#374151' : '#E5E7EB',
    },
    yaxis: {
      title: 'S/N 比 (dB)',
      color: isDark ? '#9CA3AF' : '#6B7280',
      gridcolor: isDark ? '#374151' : '#E5E7EB',
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: isDark ? '#F3F4F6' : '#1F2937' },
    legend: {
      orientation: 'h' as const,
      y: -0.2,
      x: 0.5,
      xanchor: 'center' as const,
    },
    margin: { t: 50, b: 80, l: 60, r: 20 },
  };

  return (
    <Card title="S/N 比圖">
      <Plot
        data={traces}
        layout={layout}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        }}
        style={{ width: '100%', height: '400px' }}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        使用 {SNRatioTypeLabels[snRatioType].label} 計算。S/N 比越大表示該水準的穩健性越好。
        選擇各因子 S/N 比最大的水準組合即為最佳參數設定。
      </p>
    </Card>
  );
}
