import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth(); 

  const handleSignup = async () => {
    try {
      await signup({email, password});
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full mt-2"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full mt-2"
            placeholder="Enter your password"
          />
        </div>
        <button className="btn btn-primary w-full" onClick={handleSignup}>Sign Up</button>
        <button className="btn w-full" onClick={() => window.location.href = '/login'}>Login</button>
      </div>
    </div>
  );
};
