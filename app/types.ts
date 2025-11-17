export interface TournamentPageArgs {
  params: Promise<{ tournament?: string }>;
}

export const noTournament: TournamentPageArgs = {
  params: new Promise<{ tournament?: string }>((resolve) => {
    resolve({ tournament: undefined });
  }),
};

export interface TeamPageArgs extends TournamentPageArgs {
  params: Promise<{ tournament?: string; team: string }>;
}

export interface PlayerPageArgs extends TournamentPageArgs {
  params: Promise<{ tournament?: string; player: string }>;
}

export interface OfficialPageArgs extends TournamentPageArgs {
  params: Promise<{ tournament?: string; official: string }>;
}

export interface GamePageArgs {
  params: { game: string };
}

export interface Permissions {
  admin: boolean;
  scorer: boolean;
  umpire: boolean;
  tournamentDirector: boolean;
}
