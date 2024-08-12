import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Signup } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { QueryClientProvider } from './context/QueryClientProvider';

const App: React.FC = () => {
  return (
    <QueryClientProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
