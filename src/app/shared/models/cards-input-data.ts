export interface SaveCardsDataEvent {
    community: string[];
    player: PlayerData[];
  }
  
  export interface PlayerData {
    name: string;
    cards: string[];
  }