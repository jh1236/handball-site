import { SERVER_ADDRESS } from '@/app/config';
import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { SearchableName, TournamentStructure } from '@/ServerActions/types';

interface GetTournaments {
  page?: number;
  limit?: number;
  player?: SearchableName[];
  team?: SearchableName[];
  official?: SearchableName[];
}

export function getTournaments({
  page,
  limit,
  player = [],
  team = [],
  official = [],
}: GetTournaments): Promise<TournamentStructure[]> {
  const url = new URL('/api/tournaments/', SERVER_ADDRESS);
  for (const i of team) {
    url.searchParams.append('team', i);
  }
  for (const i of player) {
    url.searchParams.append('player', i);
  }
  for (const i of official) {
    url.searchParams.append('official', i);
  }
  if (limit) {
    url.searchParams.set('limit', `${limit}`);
  }
  if (page) {
    url.searchParams.set('page', `${page}`);
  }

  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json().then((json: { tournaments: TournamentStructure[] }) => json.tournaments);
  });
}

export function getTournament(searchableName: SearchableName): Promise<TournamentStructure> {
  const url = new URL(`/api/tournaments/${searchableName}`, SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json().then((json: { tournament: TournamentStructure }) => json.tournament);
  });
}

export function getFixtureTypes(): Promise<{ fixturesTypes: string[]; finalsTypes: string[] }> {
  const url = new URL('/api/tournaments/fixtureTypes', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json();
  });
}

export function noteForTournament(tournament: SearchableName, note: string): Promise<void> {
  const body: any = {
    tournament,
    note,
  };

  return tokenFetch('/api/tournaments/notes', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(body),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function startTournament(searchableName: SearchableName): Promise<void> {
  const url = new URL(`/api/tournaments/${searchableName}/start`, SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function forceNextRoundFinalsTournament(searchableName: SearchableName): Promise<void> {
  const url = new URL(`/api/tournaments/${searchableName}/finalsNextRound`, SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export interface CreateTournament {
  name: string;
  color: string;
  fixturesType: string;
  finalsType: string;
  twoCourts: boolean;
  hasScorer: boolean;
  badmintonServes: boolean;
}

export function createTournament(create: CreateTournament): Promise<void> {
  const url = new URL('/api/tournaments/create', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(create),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export interface UpdateTournament {
  tournament: string;
  name?: string;
  fixturesType?: string;
  finalsType?: string;
  color?: string;
  twoCourts?: boolean;
  hasScorer?: boolean;
  badmintonServes?: boolean;
}

export function updateTournament(update: UpdateTournament): Promise<void> {
  const url = new URL('/api/tournaments/update', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(update),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}
