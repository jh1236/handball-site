import { SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import {
  OfficialStructure,
  TournamentStructure,
 SearchableName } from '@/ServerActions/types';

interface GetOfficialsArgs {
  tournament?: SearchableName;
  returnTournament?: boolean;
}

export function getOfficials({ tournament, returnTournament = false }: GetOfficialsArgs): Promise<{
  officials: OfficialStructure[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/officials', SERVER_ADDRESS);
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
  const url = new URL(`/officials/${official}`, SERVER_ADDRESS);
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
      return Promise.reject(response.text());
    }
    return response.json();
  });
}
