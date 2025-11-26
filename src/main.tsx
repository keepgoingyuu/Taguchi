import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { ExperimentProvider } from './contexts/ExperimentContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ExperimentProvider>
        <App />
      </ExperimentProvider>
    </ThemeProvider>
  </StrictMode>,
);
