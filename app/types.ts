export interface TournamentPageArgs {
  params: Promise<{ tournament?: string }>;
}

export interface TeamPageArgs extends TournamentPageArgs {
  params: Promise<{ tournament?: string; team: string }>;
}

export interface PlayerPageArgs extends TournamentPageArgs {
  params: Promise<{ tournament?: string; player: string }>;
}

export interface GamePageArgs {
  params: Promise<{ game: string }>;
}

export interface Permissions {
  admin: boolean;
  scorer: boolean;
  umpire: boolean;
  tournamentDirector: boolean;
}
