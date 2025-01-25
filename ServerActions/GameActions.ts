import { SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { GameStructure, TournamentStructure, RealName, SearchableName } from '@/ServerActions/types';

export function getChangeCode(gameID: number): Promise<number> {
  return tokenFetch(`/games/change_code?gameID=${gameID}`, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json().then((json: { id: number }) => json.id);
  });
}

interface GetGameArgs {
  gameID: number;
  includeGameEvents?: boolean;
  includePlayerStats?: boolean;
}

export function getGame({
  gameID,
  includeGameEvents = false,
  includePlayerStats = false,
}: GetGameArgs): Promise<GameStructure> {
  const url = new URL(`/games/${gameID}`, SERVER_ADDRESS);
  if (includeGameEvents) {
    url.searchParams.set('includeGameEvents', 'true');
  }
  if (includePlayerStats) {
    url.searchParams.set('includePlayerStats', 'true');
  }
  return tokenFetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json().then((json: { game: GameStructure }) => json.game);
  });
}

interface GetGamesArgs {
  tournament?: SearchableName;
  team?: SearchableName;
  player?: SearchableName;
  official?: SearchableName;
  court?: number;
  includeGameEvents?: boolean;
  includePlayerStats?: boolean;
  returnTournament?: boolean;
}

export function getGames({
  tournament,
  team,
  player,
  official,
  court,
  includeGameEvents = false,
  includePlayerStats = false,
  returnTournament = false,
}: GetGamesArgs): Promise<{ games: GameStructure[]; tournaments?: TournamentStructure }> {
  const url = new URL('/games', SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (team) {
    url.searchParams.set('team', team);
  }
  if (player) {
    url.searchParams.set('player', player);
  }
  if (player) {
    url.searchParams.set('player', player);
  }
  if (official) {
    url.searchParams.set('official', official);
  }
  if (court) {
    url.searchParams.set('court', `${court}`);
  }
  if (includeGameEvents) {
    url.searchParams.set('includeGameEvents', 'true');
  }
  if (includePlayerStats) {
    url.searchParams.set('includePlayerStats', 'true');
  }
  if (returnTournament) {
    url.searchParams.set('returnTournament', 'true');
  }
  return tokenFetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json();
  });
}

interface GetFixturesArgs {
  tournament?: SearchableName;
  team?: SearchableName;
  player?: SearchableName;
  official?: SearchableName;
  court?: number;
  includeGameEvents?: boolean;
  includePlayerStats?: boolean;
  returnTournament?: boolean;
  separateFinals?: boolean;
}

export function getFixtures({
  tournament,
  team,
  player,
  official,
  court,
  includeGameEvents = false,
  includePlayerStats = false,
  returnTournament = false,
  separateFinals = false,
}: GetFixturesArgs): Promise<{
  fixtures: { games: GameStructure[]; final: boolean }[];
  finals?: { games: GameStructure[]; final: true }[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/games/fixtures', SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  if (team) {
    url.searchParams.set('team', team);
  }
  if (player) {
    url.searchParams.set('player', player);
  }
  if (player) {
    url.searchParams.set('player', player);
  }
  if (official) {
    url.searchParams.set('official', official);
  }
  if (court) {
    url.searchParams.set('court', `${court}`);
  }
  if (includeGameEvents) {
    url.searchParams.set('includeGameEvents', 'true');
  }
  if (includePlayerStats) {
    url.searchParams.set('includePlayerStats', 'true');
  }
  if (returnTournament) {
    url.searchParams.set('returnTournament', 'true');
  }
  if (separateFinals) {
    url.searchParams.set('separateFinals', 'true');
  }
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json();
  });
}

export function startGame(
  gameId: number,
  swapService: boolean,
  teamOneIga: boolean,
  teamOne: SearchableName[],
  teamTwo: SearchableName[],
  official?: SearchableName,
  scorer?: SearchableName
): Promise<void> {
  const body: any = {
    id: gameId,
    swapService,
    teamOneIga,
    teamOne,
    teamTwo,
  };
  if (official) {
    body.official = official;
  }
  if (scorer) {
    body.scorer = scorer;
  }

  return tokenFetch('/games/update/start', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function scoreForGame(gameId: number, firstTeam: boolean, leftSide: boolean): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
    leftSide,
  };

  return tokenFetch('/games/update/score', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function aceForGame(gameId: number): Promise<void> {
  const body: any = {
    id: gameId,
  };

  return tokenFetch('/games/update/ace', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function faultForGame(gameId: number): Promise<void> {
  const body: any = {
    id: gameId,
  };

  return tokenFetch('/games/update/fault', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function timeoutForGame(gameId: number, firstTeam: boolean): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
  };

  return tokenFetch('/games/update/timeout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function officalTimeoutForGame(gameId: number): Promise<void> {
  const body: any = {
    id: gameId,
  };

  return tokenFetch('/games/update/officialTimeout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function endTimeoutForGame(gameId: number): Promise<void> {
  const body: any = {
    id: gameId,
  };

  return tokenFetch('/games/update/end/timeout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function startServeClockForGame(gameId: number): Promise<void> {
  const body: any = {
    id: gameId,
    start: true,
  };

  return tokenFetch('/games/update/end/timeout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function stopServeClockForGame(gameId: number): Promise<void> {
  const body: any = {
    id: gameId,
    start: false,
  };

  return tokenFetch('/games/update/end/timeout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function undoForGame(gameId: number): Promise<void> {
  const body: any = {
    id: gameId,
  };

  return tokenFetch('/games/update/undo', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function cardForGame(
  gameId: number,
  firstTeam: boolean,
  leftSide: boolean,
  color: 'Warning' | 'Green' | 'Yellow' | 'Red',
  duration: number,
  reason: string
): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
    leftSide,
    color,
    duration,
    reason,
  };

  return tokenFetch('/games/update/card', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function substituteForGame(
  gameId: number,
  firstTeam: boolean,
  leftSide: boolean
): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
    leftSide,
  };

  return tokenFetch('/games/update/substitute', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function pardonForGame(
  gameId: number,
  firstTeam: boolean,
  leftSide: boolean
): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
    leftSide,
  };

  return tokenFetch('/games/update/pardon', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function forfeitGame(gameId: number, firstTeam: boolean): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
  };

  return tokenFetch('/games/update/forfeit', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function resolveGame(gameId: number): Promise<void> {
  const body: any = {
    id: gameId,
  };

  return tokenFetch('/games/update/resolve', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function deleteGame(gameId: number): Promise<void> {
  const body: any = {
    id: gameId,
  };

  return tokenFetch('/games/update/delete', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function endGame(
  gameId: number,
  bestPlayer: SearchableName,
  notes: string,
  protestTeamOne?: string,
  protestTeamTwo?: string
): Promise<void> {
  const body: any = {
    id: gameId,
    bestPlayer,
    notes,
  };

  if (protestTeamOne) {
    body.protestTeamOne = protestTeamOne;
  }
  if (protestTeamTwo) {
    body.protestTeamOne = protestTeamTwo;
  }
  return tokenFetch('/games/update/end', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function createGameWithTeams(
  tournament: SearchableName,
  teamOne: SearchableName,
  teamTwo: SearchableName,
  official: SearchableName,
  scorer?: SearchableName
): Promise<void> {
  const body: any = {
    tournament,
    teamOne: teamOne ?? '',
    teamTwo: teamTwo ?? '',
    official,
  };

  if (scorer) {
    body.scorer = scorer;
  }
  return tokenFetch('/games/update/end', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}

export function createGameWithPlayers(
  tournament: SearchableName,
  playersOne: RealName[],
  playersTwo: RealName[],
  official: SearchableName,
  scorer?: SearchableName,
  teamOneName?: string,
  teamTwoName?: string
): Promise<void> {
  const body: any = {
    tournament,
    official,
    playersOne,
    playersTwo,
  };

  if (scorer) {
    body.scorer = scorer;
  }
  if (teamOneName) {
    body.teamOne = teamOneName;
  }
  if (teamTwoName) {
    body.teamTwo = teamTwoName;
  }
  return tokenFetch('/games/update/end', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return Promise.resolve();
  });
}
