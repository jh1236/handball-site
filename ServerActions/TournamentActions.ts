import { SERVER_ADDRESS } from '@/app/config';
import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { SearchableName, TournamentStructure } from '@/ServerActions/types';

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
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(body),
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

interface AddTeamToTournamentArgs {
  tournament: SearchableName;
  teamName?: string;
  captainName?: string;
  nonCaptainName?: string;
  substituteName?: string;
}

export function addTeamToTournament({
  tournament,
  teamName,
  captainName,
  nonCaptainName,
  substituteName,
}: AddTeamToTournamentArgs): Promise<void> {
  const url = new URL(`/api/tournaments/${tournament}/addTeam`, SERVER_ADDRESS);
  const body: any = {};
  if (teamName) {
    body.teamName = teamName;
  }
  if (captainName) {
    body.captainName = captainName;
  }
  if (nonCaptainName) {
    body.nonCaptainName = nonCaptainName;
  }
  if (substituteName) {
    body.substituteName = substituteName;
  }
  return tokenFetch(url, {
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

export function removeTeamFromTournament(
  searchableName: SearchableName,
  teamSearchableName: string
): Promise<void> {
  const url = new URL(`/api/tournaments/${searchableName}/removeTeam`, SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
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
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
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
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
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
