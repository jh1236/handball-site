import { SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import {
  PersonStructure,
  PlayerGameStatsStructure,
  TeamStructure,
  TournamentStructure,
} from '@/components/HandballComponenets/StatsComponents/types';
import { SearchableName } from '@/ServerActions/types';

export function getTeams(
  tournament?: SearchableName,
  player?: SearchableName,
  includeStats?: SearchableName,
  formatData?: SearchableName,
  returnTournament: boolean = false
): Promise<{
  teams: TeamStructure[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/teams', SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (player) {
    url.searchParams.set('player', player);
  }
  if (includeStats) {
    url.searchParams.set('includeStats', 'true');
  }
  if (formatData) {
    url.searchParams.set('formatData', 'true');
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

export function getTeam(
  team: SearchableName,
  tournament?: SearchableName,
  formatData?: boolean,
  returnTournament = false
): Promise<{
  team: TeamStructure;
  tournament?: TournamentStructure;
}> {
  const url = new URL(`/teams/${team}`, SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (formatData) {
    url.searchParams.set('formatData', 'true');
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

export function getLadder(
  tournament?: SearchableName,
  includeStats: boolean = false,
  formatData: boolean = false,
  returnTournament = false
): Promise<{
  pooled: boolean;
  ladder?: TeamStructure[];
  poolOne?: TeamStructure[];
  poolTwo?: TeamStructure[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/teams/ladder/', SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (formatData) {
    url.searchParams.set('formatData', 'true');
  }
  if (includeStats) {
    url.searchParams.set('includeStats', 'true');
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
