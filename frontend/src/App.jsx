





import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DocumentViewer from './pages/DocumentViewer';
import ChatPage from './pages/ChatPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents/:id" element={<DocumentViewer />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



