import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import TestPage from './pages/TestPage';

createRoot(document.getElementById("root")!).render(<App />);
