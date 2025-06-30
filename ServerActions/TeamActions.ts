import { localLogout, SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { SearchableName, TeamStructure, TournamentStructure } from '@/ServerActions/types';
import { SERVER_ADDRESS } from '@/app/config';

interface GetTeamsArgs {
  tournament?: SearchableName;
  player?: SearchableName;
  includeStats?: boolean;
  formatData?: boolean;
  returnTournament?: boolean;
}

export function getTeams({
  tournament,
  player,
  includeStats,
  formatData,
  returnTournament = false,
}: GetTeamsArgs): Promise<{
  teams: TeamStructure[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/api/teams', SERVER_ADDRESS);
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
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json();
  });
}

interface GetTeamArgs {
  team: SearchableName;
  tournament?: SearchableName;
  formatData?: boolean;
  returnTournament?: boolean;
}

export function getTeam({
  team,
  tournament,
  formatData,
  returnTournament = false,
}: GetTeamArgs): Promise<{
  team: TeamStructure;
  tournament?: TournamentStructure;
}> {
  const url = new URL(`/api/teams/${team}`, SERVER_ADDRESS);
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
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json();
  });
}

interface GetLadderArgs {
  tournament?: SearchableName;
  includeStats?: boolean;
  formatData?: boolean;
  returnTournament?: boolean;
}

export function getLadder({
  tournament,
  includeStats = false,
  formatData = false,
  returnTournament = false,
}: GetLadderArgs): Promise<{
  pooled: boolean;
  ladder?: TeamStructure[];
  poolOne?: TeamStructure[];
  poolTwo?: TeamStructure[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/api/teams/ladder/', SERVER_ADDRESS);
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
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json();
  });
}
