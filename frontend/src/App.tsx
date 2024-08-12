// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/SignUp';
import { ProtectedRoute } from '@/pages/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import { BetProvider } from '@/context/BetContext';
import { QueryClientProvider } from '@/context/QueryClientProvider';

 const App = () => (
  <Router>
    <QueryClientProvider>
    <AuthProvider>
      <BetProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BetProvider>
    </AuthProvider>
    </QueryClientProvider>
  </Router>
);

export default App;