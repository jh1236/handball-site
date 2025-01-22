import { SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import {
  PersonStructure,
  PlayerGameStatsStructure,
  TournamentStructure,
} from '@/components/HandballComponenets/StatsComponents/types';
import { SearchableName } from '@/ServerActions/types';

export function getPlayers(
  tournament?: SearchableName,
  team?: SearchableName,
  includeStats?: boolean,
  formatData?: boolean,
  returnTournament: boolean = false
): Promise<{
  players: PersonStructure[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/players', SERVER_ADDRESS);
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

export function getPlayer(
  player: SearchableName,
  tournament?: SearchableName,
  game?: number,
  formatData?: boolean,
  returnTournament = false
): Promise<{
  player: PersonStructure | PlayerGameStatsStructure;
  tournament?: TournamentStructure;
}> {
  const url = new URL(`/players/${player}`, SERVER_ADDRESS);
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
