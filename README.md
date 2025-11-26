# 田口實驗設計工具 | Taguchi Method Designer

互動式田口方法實驗設計與分析工具，支援因子水準設定、直交表生成、S/N比分析及最佳參數識別。

## 功能特色

### 🔬 實驗設計
- **因子與水準設定**：支援 2-4 個水準的多因子實驗設計
- **直交表自動選擇**：根據因子數量自動推薦最適合的直交表
- **支援多種直交表**：L4、L8、L9、L16、L18、L27

### 📊 數據分析
- **三種 S/N 比計算**：
  - 望小特性 (Smaller-the-better)：適用於缺陷率、誤差等
  - 望大特性 (Larger-the-better)：適用於強度、效率等
  - 望目特性 (Nominal-the-best)：適用於尺寸精度等
- **主效應分析**：計算各因子在不同水準下的平均 S/N 比
- **最佳參數組合識別**：自動找出最佳因子水準組合

### 📈 視覺化圖表
- **主效應圖**：使用 Plotly.js 繪製互動式因子效應圖
- **響應表**：清晰呈現各因子水準的 S/N 比數據
- **深色/淺色模式**：支援主題切換，保護視力

### 🎯 最佳化結果
- **最佳參數組合**：明確顯示每個因子的最佳水準
- **預測 S/N 比**：估算最佳組合的預期表現
- **因子重要性排序**：依 Delta 值排列因子影響程度

### 💡 使用體驗
- **範例數據載入**：一鍵載入範例實驗，快速了解工具功能
- **響應式設計**：支援桌面與行動裝置
- **即時計算**：數據輸入後立即顯示分析結果

## 技術架構

- **前端框架**：React 18 + TypeScript
- **建構工具**：Vite 7
- **樣式方案**：Tailwind CSS v4
- **圖表庫**：Plotly.js + react-plotly.js
- **圖示庫**：Lucide React
- **狀態管理**：React Context API

## 快速開始

### 環境需求
- Node.js 18+
- pnpm (推薦) 或 npm

### 安裝步驟

```bash
# 複製專案
git clone https://github.com/keepgoingyuu/Taguchi.git
cd Taguchi

# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev
```

開發伺服器將在 http://localhost:5001 啟動

### 建構生產版本

```bash
pnpm build
pnpm preview
```

## 專案結構

```
taguchi-experiment/
├── src/
│   ├── components/          # React 元件
│   │   ├── ui/             # 基礎 UI 元件
│   │   ├── layout/         # 頁面布局元件
│   │   ├── FactorInput/    # 因子輸入元件
│   │   ├── OrthogonalArray/# 直交表元件
│   │   ├── ExperimentInput/# 實驗數據輸入
│   │   ├── Analysis/       # 分析結果元件
│   │   ├── Visualization/  # 圖表視覺化
│   │   └── OptimalResult/  # 最佳結果顯示
│   ├── contexts/           # React Context
│   │   ├── ThemeContext    # 主題管理
│   │   └── ExperimentContext # 實驗狀態管理
│   ├── utils/              # 工具函數
│   │   └── taguchi/        # 田口方法核心演算法
│   │       ├── orthogonalArrays.ts  # 直交表定義
│   │       ├── snRatio.ts           # S/N比計算
│   │       └── mainEffects.ts       # 主效應分析
│   └── types/              # TypeScript 型別定義
├── .env                    # 環境變數配置
└── package.json
```

## 田口方法簡介

田口方法（Taguchi Method）是由日本工程師田口玄一博士開發的品質工程方法，主要用於：

1. **參數設計**：找出產品或製程的最佳參數組合
2. **穩健設計**：使產品對雜訊因子不敏感
3. **品質改善**：以最小成本達到最佳品質

### 直交表說明

| 直交表 | 最大因子數 | 水準數 | 實驗次數 |
|--------|-----------|--------|----------|
| L4     | 3         | 2      | 4        |
| L8     | 7         | 2      | 8        |
| L9     | 4         | 3      | 9        |
| L16    | 15        | 2      | 16       |
| L18    | 8         | 2-3混合| 18       |
| L27    | 13        | 3      | 27       |

### S/N 比公式

- **望小特性**：S/N = -10 × log₁₀(Σy²/n)
- **望大特性**：S/N = -10 × log₁₀(Σ(1/y²)/n)
- **望目特性**：S/N = 10 × log₁₀(μ²/σ²)

## 授權條款

MIT License

## 作者

Yu - [@keepgoingyuu](https://github.com/keepgoingyuu)
