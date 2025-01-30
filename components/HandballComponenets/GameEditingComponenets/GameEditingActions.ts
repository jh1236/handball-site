import {
  reloadGame,
  startLoading,
} from '@/components/HandballComponenets/GameEditingComponenets/EditGame';
import {
  aceForGame,
  cardForGame,
  deleteGame,
  endTimeoutForGame,
  faultForGame,
  scoreForGame,
  startGame,
  substituteForGame,
  timeoutForGame,
  undoForGame,
} from '@/ServerActions/GameActions';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

type Team = {
  name: string;
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
  timeoutExpirationTime: {
    get: number;
    set: (v: number) => void;
  };
  id: number;
  teamOne: Team;
  teamTwo: Team;
  firstTeamServes: {
    get: boolean;
    set: (v: boolean) => void;
  };
  started: {
    get: boolean;
    set: (v: boolean) => void;
  };
  ended: {
    get: boolean;
    set: (v: boolean) => void;
  };
  teamOneIGA: {
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
}

export function begin(game: GameState) {
  startLoading();
  startGame({
    gameId: game.id,
    swapService: !game.firstTeamServes.get,
    teamOneIGA: game.teamOneIGA.get,
    teamOne: [
      game.teamOne.left.get?.searchableName,
      game.teamOne.right.get?.searchableName,
      game.teamOne.sub.get?.searchableName,
    ].filter((a) => typeof a === 'string'),
    teamTwo: [
      game.teamTwo.left.get?.searchableName,
      game.teamTwo.right.get?.searchableName,
      game.teamTwo.sub.get?.searchableName,
    ].filter((a) => typeof a === 'string'),
  }).then(() => sync(game));
}

export function del(game: GameState) {
  deleteGame(game.id).then(() => {
    // eslint-disable-next-line no-restricted-globals
    location.href = '/';
  });
}

export function score(game: GameState, firstTeam: boolean, leftPlayer: boolean): void {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  team.score.set(team.score.get + 1);
  const needsSwap = firstTeam === game.firstTeamServes.get;
  team.servedFromLeft.set(!team.servedFromLeft.get);
  game.firstTeamServes.set(firstTeam);
  nextPoint(game, needsSwap ? firstTeam : undefined);
  scoreForGame(game.id, firstTeam, leftPlayer).catch(() => sync(game));
}

export function ace(game: GameState): void {
  const team = game.firstTeamServes.get ? game.teamOne : game.teamTwo;
  team.score.set(team.score.get + 1);
  nextPoint(game, game.firstTeamServes.get);
  team.servedFromLeft.set(!team.servedFromLeft.get);
  aceForGame(game.id).catch(() => sync(game));
}

export function timeout(game: GameState, firstTeam: boolean): void {
  const team = game.firstTeamServes.get ? game.teamOne : game.teamTwo;
  team.timeouts.set(team.timeouts.get + 1);
  game.timeoutExpirationTime.set(Date.now() + 30_000);
  timeoutForGame(game.id, firstTeam)
    .catch(() => sync(game))
    .then();
}

export function endTimeout(game: GameState): void {
  game.timeoutExpirationTime.set(-1);
  endTimeoutForGame(game.id)
    .catch(() => sync(game))
    .then();
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
  faultForGame(game.id).catch(() => sync(game));
}

export function sub(game: GameState, firstTeam: boolean, leftPlayer: boolean): void {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  const substitute = team.sub;
  const temp = player.get;
  player.set(substitute.get);
  substitute.set(temp);
  substituteForGame(game.id, firstTeam, leftPlayer).catch(() => sync(game));
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
  const otherTeam = firstTeam ? game.teamTwo : game.teamOne;
  const player = leftPlayer ? team.left : team.right;
  const otherPlayer = leftPlayer ? team.right : team.left;
  if (otherPlayer.get?.cardTimeRemaining) {
    const otherTeamWins = Math.max(11, team.score.get + 2);
    if (otherPlayer.get.cardTimeRemaining === -1) {
      if (duration === -1) {
        otherTeam.score.set(otherTeamWins);
      } else {
        otherTeam.score.set(Math.min(otherTeamWins, otherTeam.score.get + duration));
      }
    } else if (duration === -1) {
      otherTeam.score.set(
        Math.min(otherTeamWins, otherTeam.score.get + otherPlayer.get.cardTimeRemaining)
      );
      const temp = otherPlayer.get;
      temp.cardTimeRemaining = 0;
      otherPlayer.set(temp);
    } else {
      const stillCardedPlayer =
        otherPlayer.get.cardTimeRemaining > player.get!.cardTimeRemaining ? otherPlayer : player;
      const notCardedPlayer =
        otherPlayer.get.cardTimeRemaining <= player.get!.cardTimeRemaining ? otherPlayer : player;
      let temp = stillCardedPlayer.get!;
      const diff =
        stillCardedPlayer.get!.cardTimeRemaining - notCardedPlayer.get!.cardTimeRemaining;
      temp.cardTimeRemaining -= diff;
      otherTeam.score.set(Math.min(otherTeamWins, otherTeam.score.get + diff));
      stillCardedPlayer.set(temp);
      temp = notCardedPlayer.get!;
      temp.cardTimeRemaining = 0;
      notCardedPlayer.set(temp);
    }
    if (game.firstTeamServes.get === firstTeam) {
      const temp = otherTeam.left?.get;
      otherTeam.left?.set(team.right?.get);
      otherTeam.right?.set(temp);
      game.firstTeamServes.set(!firstTeam);
    }
  } else {
    const temp = player.get!;
    if (temp.cardTimeRemaining !== -1) {
      temp.cardTime += duration;
      temp.cardTimeRemaining = temp.cardTime;
    }
    player.set(temp);
  }
  cardForGame(game.id, firstTeam, leftPlayer, color, duration, reason).catch(() => sync(game));
}

export function undo(game: GameState): void {
  if (!game) return;
  startLoading();
  undoForGame(game.id).then(() => {
    sync(game);
  });
}

export function sync(game: GameState): void {
  startLoading();
  reloadGame(game.id);
}
