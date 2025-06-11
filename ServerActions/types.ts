export type SearchableName = string;
export type RealName = string;

export interface TeamStructure {
  name: string;
  extendedName: string;
  searchableName: string;
  imageUrl: string;
  bigImageUrl: string;
  captain: PersonStructure | PlayerGameStatsStructure;
  nonCaptain: PersonStructure | PlayerGameStatsStructure | null;
  substitute: PersonStructure | PlayerGameStatsStructure | null;
  teamColor: string | null;
  teamColorAsRGBABecauseDigbyIsLazy: number[];
  servedFromLeft?: boolean;
  stats?: { [key: string]: any };

  [k: string]: any;
}

export interface CardStructure {
  eventType: string;
  firstTeam: boolean;
  player?: PersonStructure;
  details: number;
  notes: string;
}

export interface PersonStructure {
  name: string;
  searchableName: string;
  imageUrl: string;
  bigImageUrl: string;
  isAdmin?: boolean;
  team?: TeamStructure;
  prevCards?: CardStructure[];
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
  rating: number;
  prevCards?: CardStructure[];
  stats: { [key: string]: any };

  [k: string]: any;
}

export interface GameEventStructure {
  id: number;
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

export interface GameTeamStructure {
  name: string;
  extendedName: string;
  searchableName: string;
  imageUrl: string;
  captain: PlayerGameStatsStructure;
  nonCaptain: PlayerGameStatsStructure | null;
  substitute: PlayerGameStatsStructure | null;
  teamColor: string | null;
  teamColorAsRGBABecauseDigbyIsLazy: number[];
  servingFromLeft?: boolean;
  stats?: { [key: string]: any };

  [k: string]: any;
}

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
  ranked: boolean;
  bestPlayer: PersonStructure;
  official: OfficialStructure;
  scorer: OfficialStructure | null;
  firstTeamIga: boolean;
  firstTeamToServe: boolean;
  sideToServe: 'Left' | 'Right';
  startTime: number;
  serveTimer: number;
  length: number;
  court: number;
  isFinal: boolean;
  round: number;
  isBye: boolean;
  status: string;
  events?: GameEventStructure[];
  timeoutExpirationTime: number;
  changeCode: number;
  admin?: {
    notes?: string;
    cards: CardStructure[];
    markedForReview: boolean;
    requiresAction: boolean;
    noteableStatus: string;
    teamOneRating: number;
    teamTwoRating: number;
    teamOneNotes: string | null;
    teamTwoNotes: string | null;
    teamOneProtest: string | null;
    teamTwoProtest: string | null;
    resolved: boolean;
  };

  [k: string]: any;
}
