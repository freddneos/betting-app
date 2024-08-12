import React, { createContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

interface BetContextType {
  sports: any[];
  events: any[];
  myBets: any[];
  fetchEventsBySport: (sportId: number) => void;
  placeBet: (eventId: number, amount: number) => void;
}

export const BetContext = createContext<BetContextType | undefined>(undefined);

export const BetProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: sports = [] } = useQuery({
    queryKey: ['sports'],
    queryFn: async () => {
      const { data } = await apiClient.get('/sports');
      return data;
    }
  });

  const { data: events = [], refetch: fetchEventsBySport } = useQuery({
    queryKey: ['events'],
    enabled: false, // This query will not run automatically
    queryFn: async ({ queryKey }) => {
      const [, sportId] = queryKey as [string, number];
      const { data } = await apiClient.get(`/sports/${sportId}/events`);
      return data;
    }
  });

  const { data: myBets = [] } = useQuery({
    queryKey: ['my-bets'],
    queryFn: async () => {
      const { data } = await apiClient.get('/my-bets');
      return data;
    }
  });

  const placeBetMutation = useMutation({
    mutationFn: async ({ eventId, amount }: { eventId: number; amount: number }) => {
      const { data } = await apiClient.post('/place-bet', { event_id: eventId, amount });
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch the 'my-bets' query to get the updated bets
      queryClient.invalidateQueries(['my-bets']);
    },
    onError: (error) => {
      console.error('Error placing bet:', error);
    }
  });

  const placeBet = (eventId: number, amount: number) => {
    placeBetMutation.mutate({ eventId, amount });
  };

  const contextValue = {
    sports,
    events,
    myBets,
    fetchEventsBySport,
    placeBet,
  };

  return (
    <BetContext.Provider value={contextValue}>
      {children}
    </BetContext.Provider>
  );
};
