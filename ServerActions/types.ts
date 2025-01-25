export type SearchableName = string;
export type RealName = string;

export interface TeamStructure {
  name: string;
  searchableName: string;
  imageUrl: string;
  captain: PersonStructure | PlayerGameStatsStructure;
  nonCaptain?: PersonStructure | PlayerGameStatsStructure;
  substitute?: PersonStructure | PlayerGameStatsStructure;
  servedFromLeft?: boolean;
  stats?: { [key: string]: any };

  [k: string]: any;
}

export interface PersonStructure {
  name: string;
  searchableName: string;
  imageUrl: string;
  isAdmin?: boolean;
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

  [k: string]: any;
}

export interface OfficialStructure extends PersonStructure {
  stats?: { [key: string]: number };

  [k: string]: any;
}

export interface PlayerGameStatsStructure extends PersonStructure {
  team: TeamStructure;
  roundsOnCourt: number;
  roundsCarded: number;
  pointsScored: number;
  acesScored: number;
  isBestPlayer: boolean;
  faults: number;
  doubleFaults: number;
  servedPoints: number;
  servedPointsWon: number;
  servesReceived: number;
  servesReturned: number;
  aceStreak: number;
  serveStreak: number;
  warnings: number;
  greenCards: number;
  yellowCards: number;
  redCards: number;
  cardTime: number;
  cardTimeRemaining: number;
  startSide: 'Left' | 'Right' | 'Substitute';
  elo: number;
  eloDelta: number;
  sideOfCourt: 'Left' | 'Right' | 'Substitute';

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
  nonCaptain?: PlayerGameStatsStructure;
  substitute?: PlayerGameStatsStructure;
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
  adminStatus?: string;
  noteableStatus?: string;
  notes?: string;
  timeoutStartTime?: number;

  [k: string]: any;
}
