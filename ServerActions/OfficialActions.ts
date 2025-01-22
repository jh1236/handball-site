import { SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import {
  OfficialStructure,
  TournamentStructure,
} from '@/components/HandballComponenets/StatsComponents/types';
import { SearchableName } from '@/ServerActions/types';

export function getOfficials(
  tournament?: SearchableName,
  returnTournament: boolean = false
): Promise<{
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

export function getOfficial(
  official: SearchableName,
  tournament?: SearchableName,
  returnTournament = false
): Promise<{
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
