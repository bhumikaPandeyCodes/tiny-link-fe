import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import StatsPage from './pages/StatsPage.tsx';
import Layout from './components/Layout.tsx';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/code/:code" element={<StatsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;