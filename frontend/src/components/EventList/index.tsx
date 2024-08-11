import React from 'react';

interface Event {
  event_id: number;
  event_name: string;
  odds: number;
}

interface EventListProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onSelectEvent }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.event_id} className="mb-4 flex justify-between items-center">
            <span>{event.event_name} (Odds: {event.odds})</span>
            <button className="btn btn-primary" onClick={() => onSelectEvent(event)}>Place Bet</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
