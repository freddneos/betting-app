import React, { useState } from 'react';

interface Event {
  event_id: number;
  event_name: string;
  odds: number;
}

interface BetModalProps {
  event: Event;
  onClose: () => void;
  onPlaceBet: (amount: number) => void;
}

export const BetModal: React.FC<BetModalProps> = ({ event, onClose, onPlaceBet }) => {
  const [amount, setAmount] = useState<number | ''>('');

  const handleBet = () => {
    if (amount) {
      onPlaceBet(amount);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Place Bet on {event.event_name}</h3>
        <div className="py-4">
          <label className="block text-sm font-medium">Bet Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.valueAsNumber)}
            className="input input-bordered w-full mt-2"
            placeholder="Enter amount"
          />
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleBet}>Place Bet</button>
        </div>
      </div>
    </div>
  );
};
