import { SERVER_ADDRESS } from '@/app/config';
import { localLogout, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { SearchableName, TeamStructure, TournamentStructure } from '@/ServerActions/types';

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

interface RenameTeamForTournamentParams {
  tournamentSearchableName: SearchableName;
  teamSearchableName: SearchableName;
  newName?: string;
  newColor?: string;
}

export function renameTeamForTournament({
  tournamentSearchableName,
  teamSearchableName,
  newName,
  newColor,
}: RenameTeamForTournamentParams): Promise<TeamStructure> {
  const url = new URL('/api/tournaments/updateForTournament', SERVER_ADDRESS);
  const value: any = {
    teamSearchableName,
    tournamentSearchableName,
  };
  if (newName) {
    value.newName = newName;
  }
  if (newColor) {
    value.newColor = newColor;
  }
  return tokenFetch(url, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(value),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localLogout();
      }
      return Promise.reject(response.text());
    }
    return response.json().then((j: { team: TeamStructure }) => j.team);
  });
}

interface AddTeamToTournamentArgs {
  tournamentSearchableName: SearchableName;
  teamName?: string;
  captainName?: string;
  nonCaptainName?: string;
  substituteName?: string;
}

export function addTeamToTournament({
  tournamentSearchableName,
  teamName,
  captainName,
  nonCaptainName,
  substituteName,
}: AddTeamToTournamentArgs): Promise<TeamStructure> {
  const url = new URL('/api/tournaments/addToTournament', SERVER_ADDRESS);
  const body: any = { tournamentSearchableName };
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
    return response.json().then((j: { team: TeamStructure }) => j.team);
  });
}

export function removeTeamFromTournament(
  tournamentSearchableName: SearchableName,
  teamSearchableName: string
): Promise<void> {
  const url = new URL('/api/tournaments/removeFromTournament', SERVER_ADDRESS);
  return tokenFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ tournamentSearchableName, teamSearchableName }),
  }).then((response) => {
    if (!response.ok) return Promise.reject(response.text());
    return Promise.resolve();
  });
}
