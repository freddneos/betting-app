import { useContext } from 'react';
import { BetContext } from '@/context/BetContext';

export const useBet = () => {
  const context = useContext(BetContext);
  if (context === undefined) {
    throw new Error('useBet must be used within an BetProvider');
  }
  return context;
};