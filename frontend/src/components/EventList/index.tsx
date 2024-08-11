import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { BetModal } from '../BetModal';

interface Event {
  event_id: number;
  event_name: string;
  odds: number;
}

const fetchEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get('/events');
  return data;
};

export const EventList: React.FC = () => {
  const { data: events, error, isLoading } = useQuery<Event[]>(['events'], fetchEvents);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Events</h2>
      <ul>
        {events?.map((event) => (
          <li key={event.event_id} className="mb-4 flex justify-between items-center">
            <span>{event.event_name} (Odds: {event.odds})</span>
            <button className="btn btn-primary" onClick={() => setSelectedEvent(event)}>Place Bet</button>
          </li>
        ))}
      </ul>
      {selectedEvent && (
        <BetModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};
