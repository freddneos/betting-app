import { Sport } from "./Sport";


export interface Bet {
    bet_id: number;
    amount: number;
    event: {
        event_id: number;
        event_name: string;
        odds: number;
        sport: Sport;
    };
    possibleAmountToWin: number;
  }