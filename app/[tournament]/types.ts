export interface TournamentPageArgs {
  params: Promise<{ tournament: string }>;
}

export interface TeamPageArgs {
  params: Promise<{ tournament: string; team: string }>;
}
