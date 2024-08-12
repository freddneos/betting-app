// src/components/Dashboard.tsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { BetContext } from '@/context/BetContext';
import { EventList } from '@/components/EventList';
import { BetModal } from '@/components/BetModal';

export const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const { sports, events, myBets, fetchEventsBySport, placeBet } = useContext(BetContext)!;
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSelectSport = (sportId: number) => {
    fetchEventsBySport(sportId);
  };

  const handlePlaceBet = async (amount: number) => {
    if (selectedEvent) {
      await placeBet({ eventId: selectedEvent.event_id, amount });
      setSelectedEvent(null);
    }
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold">{user.email}</div>
        <div className="text-lg font-bold">Balance: {user.balance} ETH</div>
      </header>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {sports.map((sport) => (
          <div
            key={sport.sport_id}
            className="card card-bordered p-4 text-center cursor-pointer"
            onClick={() => handleSelectSport(sport.sport_id)}
          >
            <div className="text-4xl">{sport.emoji}</div>
            <div className="mt-2">{sport.name}</div>
          </div>
        ))}
      </div>

      <EventList events={events} onSelectEvent={setSelectedEvent} />

      <h2 className="text-xl font-bold mt-8">My Bets</h2>
      <ul>
        {myBets.map((bet) => (
          <li key={bet.bet_id} className="mb-4">
            Bet on {bet.event.event_name} (Odds: {bet.event.odds}): Bet Amount: {bet.amount} - Possible Win: {bet.possible_win}
          </li>
        ))}
      </ul>

      {selectedEvent && (
        <BetModal
          event={selectedEvent}
          onPlaceBet={handlePlaceBet}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};
