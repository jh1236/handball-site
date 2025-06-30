import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { SearchableName, TournamentStructure } from '@/ServerActions/types';
import { SERVER_ADDRESS } from '@/app/config';

export function getTournaments(): Promise<TournamentStructure[]> {
  const url = new URL('/api/tournaments/', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
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
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
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

  return tokenFetch('/api/tournaments/notes', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
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
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function addTeamToTournament(
  searchableName: SearchableName,
  request: {
    teamName: string;
    captainName?: string;
    nonCaptainName?: string;
    substituteName?: string;
  }
): Promise<void> {
  const url = new URL(`/api/tournaments/${searchableName}/addTeam`, SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function removeTeamFromTournament(
  searchableName: SearchableName,
  teamSearchableName: string
): Promise<void> {
  const url = new URL(`/api/tournaments/${searchableName}/removeTeam`, SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'DELETE',
    body: JSON.stringify({ teamSearchableName }),
  }).then((response) => {
    if (!response.ok) return Promise.reject(response.text());
    return Promise.resolve();
  });
}

export function addOfficialToTournament(
  searchableName: SearchableName,
  officialSearchableName: string
): Promise<void> {
  const url = new URL(`/api/tournaments/${searchableName}/addOfficial`, SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    body: JSON.stringify({ officialSearchableName }),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function removeOfficialFromTournament(
  searchableName: SearchableName,
  officialSearchableName: string
): Promise<void> {
  const url = new URL(`/api/tournaments/${searchableName}/removeOfficial`, SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'DELETE',
    body: JSON.stringify({ officialSearchableName }),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}
