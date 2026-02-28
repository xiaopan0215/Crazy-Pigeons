import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import LevelSelectPage from '@/pages/LevelSelectPage';
import GamePage from '@/pages/GamePage';
import ResultPage from '@/pages/ResultPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="levels" element={<LevelSelectPage />} />
          <Route path="game/:levelId" element={<GamePage />} />
          <Route path="result/:status" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
