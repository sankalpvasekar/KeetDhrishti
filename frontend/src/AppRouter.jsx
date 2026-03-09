import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import ResultPage from './components/ResultPage';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/result" element={<ResultPage />} />
        </Routes>
    );
}

export default AppRouter;