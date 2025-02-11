import { SERVER_ADDRESS, tokenFetch } from '@/components/HandballComponenets/ServerActions';
import {
  GameStructure,
  RealName,
  SearchableName,
  TournamentStructure,
} from '@/ServerActions/types';

export function getChangeCode(gameID: number): Promise<number> {
  return tokenFetch(`/games/change_code?id=${gameID}`, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json().then((json: { code: number }) => json.code);
  });
}

export function getNextGameId(gameID: number): Promise<number> {
  return tokenFetch(`/games/next?id=${gameID}`, {
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
  includeStats?: boolean;
  formatData?: boolean;
  includePreviousCards?: boolean;
}

export function getGame({
  gameID,
  includeGameEvents = false,
  includeStats = false,
  includePreviousCards = false,
  formatData = true,
}: GetGameArgs): Promise<GameStructure> {
  const url = new URL(`/games/${gameID}`, SERVER_ADDRESS);
  if (includeGameEvents) {
    url.searchParams.set('includeGameEvents', 'true');
  }
  if (includePreviousCards) {
    url.searchParams.set('includePreviousCards', 'true');
  }
  if (includeStats) {
    url.searchParams.set('includeStats', 'true');
  }
  if (formatData) {
    url.searchParams.set('formatData', 'true');
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
  team?: SearchableName[];
  player?: SearchableName[];
  official?: SearchableName[];
  court?: number;
  includeGameEvents?: boolean;
  includePlayerStats?: boolean;
  returnTournament?: boolean;
  limit?: number;
}

export function getGames({
  tournament,
  team = [],
  player = [],
  official = [],
  court,
  includeGameEvents = false,
  includePlayerStats = false,
  returnTournament = false,
  limit = 20,
}: GetGamesArgs): Promise<{ games: GameStructure[]; tournaments?: TournamentStructure }> {
  const url = new URL('/games', SERVER_ADDRESS);
  if (tournament) {
    url.searchParams.set('tournament', tournament);
  }
  for (const i of team) {
    url.searchParams.append('team', i);
  }
  for (const i of player) {
    url.searchParams.append('player', i);
  }
  for (const i of official) {
    url.searchParams.append('official', i);
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
  if (limit) {
    url.searchParams.set('limit', `${limit}`);
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
  maxRounds?: number;
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
  maxRounds,
}: GetFixturesArgs): Promise<{
  fixtures: { games: GameStructure[]; final: boolean }[];
  finals?: { games: GameStructure[]; final: true }[];
  tournament?: TournamentStructure;
}> {
  const url = new URL('/games/fixtures', SERVER_ADDRESS);
  if (maxRounds) {
    url.searchParams.set('maxRounds', `${maxRounds}`);
  }
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

export function startGame(
  gameId: number,
  swapService: boolean,
  teamOneIGA: boolean,
  teamOne: SearchableName[],
  teamTwo: SearchableName[],
  official?: SearchableName,
  scorer?: SearchableName
): Promise<void> {
  const body: any = {
    id: gameId,
    swapService,
    teamOneIGA,
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

export function scoreForGame(
  gameId: number,
  firstTeam: boolean,
  leftPlayer: boolean,
  method?:
    | 'Double Bounce'
    | 'Straight'
    | 'Out of Court'
    | 'Double Touch'
    | 'Grabs'
    | 'Illegal Body Part'
    | 'Obstruction'
): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
    leftPlayer,
  };
  if (method) {
    body.method = method;
  }

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

  return tokenFetch('/games/update/endTimeout', {
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
  leftPlayer: boolean,
  color: 'Warning' | 'Green' | 'Yellow' | 'Red',
  duration: number,
  reason: string
): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
    leftPlayer,
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
  leftPlayer: boolean
): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
    leftPlayer,
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
  leftPlayer: boolean
): Promise<void> {
  const body: any = {
    id: gameId,
    firstTeam,
    leftPlayer,
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
  teamOneRating: number,
  teamTwoRating: number,
  notes?: string,
  protestTeamOne?: string,
  protestTeamTwo?: string,
  notesTeamOne?: string,
  notesTeamTwo?: string,
  markedForReview?: boolean
): Promise<void> {
  const body: any = {
    id: gameId,
    bestPlayer,
    teamOneRating,
    teamTwoRating,
  };

  if (notes) {
    body.notes = notes;
  }
  if (protestTeamOne) {
    body.protestTeamOne = protestTeamOne;
  }
  if (protestTeamTwo) {
    body.protestTeamTwo = protestTeamTwo;
  }
  if (notesTeamOne) {
    body.teamOneNotes = notesTeamOne;
  }
  if (notesTeamTwo) {
    body.teamTwoNotes = notesTeamTwo;
  }
  if (markedForReview) {
    body.markedForReview = 'true';
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
): Promise<{ id: number }> {
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
  console.log(JSON.stringify(body));
  return tokenFetch('/games/update/create', {
    method: 'POST',
    body: JSON.stringify(body),
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
