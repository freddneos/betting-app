import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventList } from '@/components/EventList';
import { BetModal } from '@/components/BetModal';
import apiClient from '@/api/client';

interface Event {
  event_id: number;
  event_name: string;
  odds: number;
}

export const Dashboard: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events, error, isLoading } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const { data:response } = await apiClient.get('/events');
      return response.data;
    }
  });

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handlePlaceBet = (amount: number) => {
    console.log(`Bet placed on ${selectedEvent?.event_name} with amount: $${amount}`);
    setSelectedEvent(null);
  };

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events</div>;

  if (!events) return <div>No events found</div>;

  return (
    <div>
      <EventList events={events} onSelectEvent={handleSelectEvent} />
      {selectedEvent && (
        <BetModal event={selectedEvent} onPlaceBet={handlePlaceBet} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};