import React, { createContext, ReactNode, useState } from 'react';
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
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  const { data: sports = [] } = useQuery({
    queryKey: ['sports'],
    queryFn: async () => {
      const { data } = await apiClient.get('/sports');
      return data;
    }
  });

  const { data: allEvents = [] } = useQuery({
    queryKey: ['all-events'],
    queryFn: async () => {
      const { data: response } = await apiClient.get('/events');
      return response.data;
    }
  });

  const fetchEventsBySport = (sportId: number) => {
    const eventsBySport = allEvents.filter((event: any) => event.sport?.sport_id === sportId);
    setFilteredEvents(eventsBySport);
  };

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
      queryClient.invalidateQueries(['my-bets']);
      queryClient.invalidateQueries(['me']); // Invalidate 'me' to refetch user data (balance)
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
    events: filteredEvents.length ? filteredEvents : allEvents,
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
