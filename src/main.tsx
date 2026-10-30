import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against duplicate mount
if (!(window as any).__LABELTRUST_MOUNTED__) {
  (window as any).__LABELTRUST_MOUNTED__ = true;
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
}
