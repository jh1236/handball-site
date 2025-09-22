import { SERVER_ADDRESS } from '@/app/config';
import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { OfficialStructure, SearchableName, TournamentStructure } from '@/ServerActions/types';

interface GetOfficialsArgs {
  tournament?: SearchableName;
  returnTournament?: boolean;
}

export function getOfficials({ tournament, returnTournament = false }: GetOfficialsArgs): Promise<{
  officials: OfficialStructure[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/api/officials', SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (returnTournament) {
    url.searchParams.set('returnTournament', 'true');
  }
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json();
  });
}

interface GetOfficialArgs {
  official: SearchableName;
  tournament?: SearchableName;
  returnTournament?: boolean;
}

export function getOfficial({
  official,
  tournament,
  returnTournament = false,
}: GetOfficialArgs): Promise<{
  official: OfficialStructure;
  tournament?: TournamentStructure;
}> {
  const url = new URL(`/api/officials/${official}`, SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (returnTournament) {
    url.searchParams.set('returnTournament', 'true');
  }
  return tokenFetch(url, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json();
  });
}

export function addOfficialToTournament(
  tournamentSearchableName: SearchableName,
  officialSearchableName: string
): Promise<void> {
  const url = new URL('/api/officials/addToTournament', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      tournamentSearchableName,
      officialSearchableName,
    }),
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
  tournamentSearchableName: SearchableName,
  officialSearchableName: string
): Promise<void> {
  const url = new URL('/api/tournaments/removeFromTournament', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ officialSearchableName, tournamentSearchableName }),
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
