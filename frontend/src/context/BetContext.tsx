import { createContext, ReactNode, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Sport } from '@/types/Sport';
import { Bet } from '@/types/Bet';
import { Event } from '@/types/Event';

interface BetContextType {
  sports: Sport[];
  events: Event[];
  myBets: Bet[];
  fetchEventsBySport: (sportId: number | null) => void;
  placeBet: (eventId: number, amount: number) => void;
}

export const BetContext = createContext<BetContextType | undefined>(undefined);

export const BetProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

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

  const fetchEventsBySport = (sportId: number | null) => {
    if (sportId === null) {
      setFilteredEvents(allEvents);
    } else {
      const eventsBySport = allEvents.filter((event: Event) => event.sport?.sport_id === sportId);
      setFilteredEvents(eventsBySport);
    }
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
      queryClient.invalidateQueries({ queryKey: ['my-bets'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
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
