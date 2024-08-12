import React from 'react';
import { Event } from '@/types/Event';

interface EventListProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  userBalance: number;
}

export const EventList: React.FC<EventListProps> = ({ events, onSelectEvent, userBalance }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Events</h2>
      
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left bg-gray-800 text-white rounded-lg shadow-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">Sport</th>
              <th className="px-4 py-2">Odds</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.event_id}
                className="hover:bg-gray-700"
                style={{ backgroundColor: `${event.sport.color}30` }} // Transparent background color
              >
                <td className="border-t border-gray-700 px-4 py-2 relative">
                  <div className="relative z-10">{event.event_name}</div>
                </td>
                <td className="border-t border-gray-700 px-4 py-2 flex items-center relative">
                  <div className="relative z-10 flex items-center">
                    <span className="text-2xl mr-2">{event.sport.emoji}</span>
                    {event.sport.name}
                  </div>
                </td>
                <td className="border-t border-gray-700 px-4 py-2 relative z-10">{event.odds / 100}</td>
                <td className="border-t border-gray-700 px-4 py-2 relative z-10">
                  {userBalance > 0 ? (
                    <button className="btn btn-primary w-full" onClick={() => onSelectEvent(event)}>
                      Place Bet
                    </button>
                  ) : (
                    <div className="tooltip tooltip-left" data-tip="Add funds to make a bet">
                      <button className="btn btn-primary w-full" disabled>
                        Place Bet
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
