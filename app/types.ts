import { SearchableName } from '@/ServerActions/types';

export interface TournamentPageArgs {
  params: Promise<{ tournament?: string }>;
}

export const noTournament: TournamentPageArgs = {
  params: new Promise<{ tournament?: string }>((resolve) => {
    resolve({ tournament: undefined });
  }),
};

export function tournamentPageOf(tournament?: SearchableName): TournamentPageArgs {
  return {
    params: new Promise<{ tournament?: string }>((resolve) => {
      resolve({ tournament });
    }),
  };
}

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
  params: Promise<{ game: string }>;
}
