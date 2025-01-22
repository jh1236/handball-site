import { SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { TournamentStructure } from '@/components/HandballComponenets/StatsComponents/types';
import { SearchableName } from '@/ServerActions/types';

export function getTournaments(): Promise<TournamentStructure[]> {
  const url = new URL('/tournaments/', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json().then((json: { tournaments: TournamentStructure[] }) => json.tournaments);
  });
}

export function getTournament(searchableName: SearchableName): Promise<TournamentStructure> {
  const url = new URL(`/tournaments/${searchableName}`, SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json().then((json: { tournament: TournamentStructure }) => json.tournament);
  });
}

export function noteForTournament(tournament: SearchableName, note: string): Promise<void> {
  const body: any = {
    tournament,
    note,
  };

  return tokenFetch('/tournaments/notes', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function serveStyleForTournament(
  tournament: SearchableName,
  badmintonServes?: boolean
): Promise<void> {
  const body: any = {
    tournament,
  };

  if (badmintonServes !== null) {
    body.badmintonServes = badmintonServes;
  }

  return tokenFetch('/tournaments/serveStyle', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}
