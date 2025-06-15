import { tokenFetch } from '@/components/HandballComponenets/ServerActions';
import {
  PersonStructure,
  PlayerGameStatsStructure,
  SearchableName,
  TournamentStructure,
} from '@/ServerActions/types';
import { SERVER_ADDRESS } from '@/app/config';

interface GetPlayersArgs {
  tournament?: SearchableName;
  team?: SearchableName;
  includeStats?: boolean;
  formatData?: boolean;
  returnTournament?: boolean;
}

export function getPlayers({
  tournament,
  team,
  includeStats,
  formatData,
  returnTournament = false,
}: GetPlayersArgs): Promise<{
  players: PersonStructure[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/api/players', SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (team) {
    url.searchParams.set('team', team);
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

interface GetAveragePlayerStatsArgs {
  tournament?: SearchableName;
  game?: number;
  formatData?: boolean;
  returnTournament?: boolean;
}

export function getAveragePlayerStats({
  tournament,
  game,
  formatData,
  returnTournament = false,
}: GetAveragePlayerStatsArgs): Promise<{
  stats: { [key: string]: any };
  tournament?: TournamentStructure;
}> {
  const url = new URL('/api/players/stats', SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (game) {
    url.searchParams.set('game', String(game));
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

interface GetPlayerArgs {
  player: SearchableName;
  tournament?: SearchableName;
  game?: number;
  formatData?: boolean;
  returnTournament?: boolean;
}

export function getPlayer({
  player,
  tournament,
  game,
  formatData,
  returnTournament = false,
}: GetPlayerArgs): Promise<{
  player: PersonStructure | PlayerGameStatsStructure;
  tournament?: TournamentStructure;
}> {
  const url = new URL(`/api/players/${player}`, SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (game) {
    url.searchParams.set('game', `${game}`);
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
