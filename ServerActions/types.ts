export type SearchableName = string;
export type RealName = string;

export interface TeamStructure {
  name: string;
  searchableName: string;
  imageUrl: string;
  captain: PersonStructure | PlayerGameStatsStructure;
  nonCaptain: PersonStructure | PlayerGameStatsStructure | null;
  substitute: PersonStructure | PlayerGameStatsStructure | null;
  teamColor: string | null;
  teamColorAsRGBABecauseDigbyIsLazy: number[];
  servedFromLeft?: boolean;
  stats?: { [key: string]: any };

  [k: string]: any;
}

export interface PersonStructure {
  name: string;
  searchableName: string;
  imageUrl: string;
  isAdmin?: boolean;
  team?: TeamStructure;
  stats?: { [key: string]: number };

  [k: string]: any;
}

export interface TournamentStructure {
  name: string;
  searchableName: string;
  fixturesType: string;
  finalsType: string;
  ranked: boolean;
  twoCourts: boolean;
  hasScorer: boolean;
  finished: boolean;
  inFinals: boolean;
  isPooled: boolean;
  notes: string;
  imageUrl: string;
  usingBadmintonServes: boolean;
  editable: boolean;

  [k: string]: any;
}

export interface OfficialStructure extends PersonStructure {
  stats?: { [key: string]: number };

  [k: string]: any;
}

export interface PlayerGameStatsStructure extends PersonStructure {
  team?: TeamStructure;
  game?: GameStructure;
  isBestPlayer: boolean;
  isCaptain: boolean;
  cardTime: number;
  cardTimeRemaining: number;
  startSide: 'Left' | 'Right' | 'Substitute';
  sideOfCourt: 'Left' | 'Right' | 'Substitute';
  stats: { [key: string]: any };

  [k: string]: any;
}

export interface GameEventStructure {
  eventType: string;
  firstTeam: boolean;
  player: PersonStructure;
  details: number;
  notes: string;
  firstTeamJustServed: boolean;
  sideServed: string;
  firstTeamToServe: boolean;
  sideToServe: string;
  teamOneLeft: PersonStructure;
  teamOneRight: PersonStructure;
  teamTwoLeft: PersonStructure;
  teamTwoRight: PersonStructure;

  [k: string]: any;
}

export type GameTeamStructure = TeamStructure & {
  captain: PlayerGameStatsStructure;
  nonCaptain: PlayerGameStatsStructure | null;
  substitute: PlayerGameStatsStructure | null;
};

export interface GameStructure {
  id: number;
  tournament: TournamentStructure;
  teamOne: GameTeamStructure;
  teamTwo: GameTeamStructure;
  teamOneScore: number;
  teamTwoScore: number;
  teamOneTimeouts: number;
  teamTwoTimeouts: number;
  firstTeamWinning: boolean;
  faulted: boolean;
  started: boolean;
  someoneHasWon: boolean;
  ended: boolean;
  protested: boolean;
  resolved: boolean;
  ranked: boolean;
  bestPlayer: PersonStructure;
  official: OfficialStructure;
  scorer: OfficialStructure | null;
  firstTeamIga: boolean;
  firstTeamToServe: boolean;
  sideToServe: string;
  startTime: number;
  serveTimer: number;
  length: number;
  court: number;
  isFinal: boolean;
  round: number;
  isBye: boolean;
  status: string;
  events?: GameEventStructure[];
  players?: PlayerGameStatsStructure[];
  timeoutExpirationTime: number;
  cardsTeamOne?: GameEventStructure[];
  cardsTeamTwo?: GameEventStructure[];
  admin?: {
    notes?: string;
    cards: GameEventStructure[];
    noteableStatus: string;
    teamOneRating: number;
    teamTwoRating: number;
    teamOneNotes: string | null;
    teamTwoNotes: string | null;
    teamOneProtest: string | null;
    teamTwoProtest: string | null;
  };

  [k: string]: any;
}
