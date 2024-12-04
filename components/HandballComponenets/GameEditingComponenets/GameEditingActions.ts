import { getURL } from 'next/dist/shared/lib/utils';
import { redirect, useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { getUrlForID } from '@/components/HandballComponenets/GameEditingComponenets/EditGame';
import { tokenFetch } from '@/components/HandballComponenets/ServerActions';
import { PlayerGameStatsStructure } from '@/components/HandballComponenets/StatsComponents/types';

type Team = {
  score: {
    get: number;
    set: (v: number) => void;
  };
  timeouts: {
    get: number;
    set: (v: number) => void;
  };
  servedFromLeft: {
    get: boolean;
    set: (v: boolean) => void;
  };
  left: {
    get?: PlayerGameStatsStructure;
    set: (v?: PlayerGameStatsStructure) => void;
  };
  right: {
    get?: PlayerGameStatsStructure;
    set: (v?: PlayerGameStatsStructure) => void;
  };
  sub: {
    get?: PlayerGameStatsStructure;
    set: (v?: PlayerGameStatsStructure) => void;
  };
  [key: string]: any;
};

export interface GameState {
  id: number;
  rounds: {
    get: number;
    set: (v: number) => void;
  };
  teamOne: Team;
  teamTwo: Team;
  firstTeamServes: {
    get: boolean;
    set: (v: boolean) => void;
  };
  faulted: {
    get: boolean;
    set: (v: boolean) => void;
  };
  servedFromLeft: boolean;
}

function nextPoint(game: GameState, swap?: boolean) {
  for (const i of [
    game.teamOne.left,
    game.teamOne.right,
    game.teamOne.sub,
    game.teamTwo.left,
    game.teamTwo.right,
    game.teamTwo.sub,
  ]) {
    const temp = i.get;
    if (!temp) continue;
    if (temp.cardTimeRemaining > 0) {
      temp.cardTimeRemaining -= 1;
      i.set(temp);
    }
  }
  if (swap !== undefined) {
    const team = swap ? game.teamOne : game.teamTwo;
    const temp = team.left?.get;
    team.left?.set(team.right?.get);
    team.right?.set(temp);
  }
  game.faulted.set(false);
  game.rounds.set(game.rounds.get + 1);
}

export function score(game: GameState, firstTeam: boolean, leftPlayer: boolean): void {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  team.score.set(team.score.get + 1);
  team.servedFromLeft.set(!team.servedFromLeft.get);
  game.firstTeamServes.set(firstTeam);
  nextPoint(game, firstTeam);
  tokenFetch('/api/games/update/score', {
    method: 'POST',
    body: JSON.stringify({
      id: game.id,
      firstTeam,
      leftPlayer,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      useRouter().refresh();
    }
  });
}

export function ace(game: GameState): void {
  const team = game.firstTeamServes.get ? game.teamOne : game.teamTwo;
  team.score.set(team.score.get + 1);
  nextPoint(game, game.firstTeamServes.get);
  team.servedFromLeft.set(!team.servedFromLeft.get);
  tokenFetch('/api/games/update/ace', {
    method: 'POST',
    body: JSON.stringify({
      id: game.id,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      alert('Something went wrong!');
    }
  });
}

export function fault(game: GameState): void {
  const team = !game.firstTeamServes.get ? game.teamOne : game.teamTwo;
  if (game.faulted.get) {
    team.score.set(team.score.get + 1);
    team.servedFromLeft.set(!team.servedFromLeft.get);
    game.firstTeamServes.set(!game.firstTeamServes.get);
    nextPoint(game); //faulted is unset here
  } else {
    game.faulted.set(true);
  }
  tokenFetch('/api/games/update/fault', {
    method: 'POST',
    body: JSON.stringify({
      id: game.id,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      alert('Something went wrong!');
    }
  });
}

export function warning(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string
): void {
  card(game, 'Warning', firstTeam, leftPlayer, reason, 0);
}

export function greenCard(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string
): void {
  card(game, 'Green', firstTeam, leftPlayer, reason, 2);
}

export function yellowCard(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string,
  duration: number = 6
): void {
  card(game, 'Yellow', firstTeam, leftPlayer, reason, duration);
}

export function redCard(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string
): void {
  card(game, 'Red', firstTeam, leftPlayer, reason, -1);
}

export function card(
  game: GameState,
  color: 'Warning' | 'Green' | 'Yellow' | 'Red',
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string,
  duration: number = 2
): void {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  const temp = player.get!;
  if (temp.cardTimeRemaining >= 0) {
    temp.cardTime += duration;
    temp.cardTimeRemaining = temp.cardTime;
  }
  player.set(temp);
  tokenFetch('/api/games/update/card', {
    method: 'POST',
    body: JSON.stringify({
      id: game.id,
      firstTeam,
      leftPlayer,
      color,
      duration,
      reason,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    if (!response.ok) {
      alert('Something went wrong!');
    }
  });
}

export function undo(game: GameState): void {
  if (!game) return;
  tokenFetch('/api/games/update/undo', {
    method: 'POST',
    body: JSON.stringify({
      id: game.id,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
    sync(game);
  });
}

export function sync(game: GameState): void {
  mutate(getUrlForID(game.id));
}
