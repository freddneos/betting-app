import { Sport } from "./Sport";


export interface Event {
    event_id: number;
    event_name: string;
    odds: number;
    sport: Sport;
    sport_id: number;
  }