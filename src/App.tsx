import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FactorInput } from './components/FactorInput/FactorInput';
import { ArraySelector } from './components/OrthogonalArray/ArraySelector';
import { ArrayTable } from './components/OrthogonalArray/ArrayTable';
import { ResultsTable } from './components/ExperimentInput/ResultsTable';
import { AnalysisPanel } from './components/Analysis/AnalysisPanel';
import { CalculationDetails } from './components/Analysis/CalculationDetails';
import { MainEffectsPlot } from './components/Visualization/MainEffectsPlot';
import { SNRatioPlot } from './components/Visualization/SNRatioPlot';
import { BestCombination } from './components/OptimalResult/BestCombination';
import { useExperiment } from './contexts/ExperimentContext';

function AppContent() {
  const { state } = useExperiment();
  const { analysisResult } = state;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* 步驟 1: 因子設定 */}
            <FactorInput />

            {/* 步驟 2: 直交表選擇 */}
            <ArraySelector />

            {/* 實驗計畫表 */}
            <ArrayTable />

            {/* 步驟 3: 實驗結果輸入 */}
            <ResultsTable />

            {/* 分析結果區塊 */}
            {analysisResult && (
              <>
                {/* 步驟 4: 分析結果 */}
                <AnalysisPanel />

                {/* 步驟 4.5: 計算過程詳解 */}
                <CalculationDetails />

                {/* 圖表視覺化 */}
                <div className="grid gap-8 lg:grid-cols-2">
                  <MainEffectsPlot />
                  <SNRatioPlot />
                </div>

                {/* 步驟 5: 最佳參數組合 */}
                <BestCombination />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
