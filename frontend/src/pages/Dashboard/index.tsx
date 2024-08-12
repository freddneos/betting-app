import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBet } from '@/hooks/useBet';
import { EventList } from '@/components/EventList';
import { BetModal } from '@/components/BetModal';
import { Event } from '@/types/Event';

export const Dashboard: React.FC = () => {
  const { me, logout } = useAuth(); 
  const { sports, events, myBets, fetchEventsBySport, placeBet } = useBet();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [user, setUser] = useState({ email: '', balance: 0 });
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userMe = await me();
      setUser(userMe);
    };

    fetchUserData();
  }, [me]);

  const handleSelectSport = (sportId: number) => {
    if (sportId === selectedSportId) {
      setSelectedSportId(null);  // Deselect if the same sport is clicked
      fetchEventsBySport(null);  // Fetch all events if no sport is selected
    } else {
      setSelectedSportId(sportId);
      fetchEventsBySport(sportId);
    }
  };

  const handlePlaceBet = async (amount: number) => {
    if (selectedEvent) {
      await placeBet(selectedEvent.event_id, amount);
      setSelectedEvent(null);
      const updatedUser = await me();
      setUser(updatedUser);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleRemoveFilter = () => {
    setSelectedSportId(null);
    fetchEventsBySport(null);  // Fetch all events if filter is removed
  };

  return (
    <div className="p-5 px-20 border-3 border-color-white">
      <header className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold">{user.email}</div>
        <div className="text-lg font-bold">Balance: {user.balance} ETH</div>
        <button onClick={handleLogout} className="btn btn-primary">Logout</button>
      </header>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {sports.map((sport) => (
          <div
            key={sport.sport_id}
            className={`card card-bordered p-4 text-center cursor-pointer ${selectedSportId === sport.sport_id ? 'border-4 border-blue-500' : ''}`}
            onClick={() => handleSelectSport(sport.sport_id)}
            style={{ background: `linear-gradient(to bottom, ${sport.color}, black)` }} // Apply gradient background
          >
            <div className="text-4xl">{sport.emoji}</div>
            <div className="mt-2">{sport.name}</div>
          </div>
        ))}
      </div>

      {selectedSportId && (
        <div className="mb-4 text-right">
          <button onClick={handleRemoveFilter} className="btn btn-secondary">Remove Filter</button>
        </div>
      )}

      <EventList events={events} onSelectEvent={setSelectedEvent} userBalance={user.balance} />

      <h2 className="text-xl font-bold mt-8 mb-4">My Bets</h2>
      
      {/* Styled Table for My Bets */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left bg-gray-800 text-white rounded-lg shadow-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">Sport</th>
              <th className="px-4 py-2">Bet Amount</th>
              <th className="px-4 py-2">Odds</th>
              <th className="px-4 py-2">Possible Win</th>
            </tr>
          </thead>
          <tbody>
            {myBets.map((bet) => (
              <tr key={bet.bet_id} className="hover:bg-gray-700">
                <td className="border-t border-gray-700 px-4 py-2">{bet.event.event_name}</td>
                <td className="border-t border-gray-700 px-4 py-2 flex items-center">
                  <span className="text-2xl mr-2">{bet.event.sport.emoji}</span>
                  {bet.event.sport.name}
                </td>
                <td className="border-t border-gray-700 px-4 py-2">{bet.amount} ETH</td>
                <td className="border-t border-gray-700 px-4 py-2">{bet.event.odds / 100}</td>
                <td className="border-t border-gray-700 px-4 py-2">{bet.possibleAmountToWin / 100} ETH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
