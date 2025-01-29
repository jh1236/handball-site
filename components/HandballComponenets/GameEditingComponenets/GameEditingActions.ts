import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { getUrlForID } from '@/components/HandballComponenets/GameEditingComponenets/EditGame';
import {
  aceForGame,
  cardForGame, endTimeoutForGame,
  faultForGame,
  scoreForGame,
  timeoutForGame,
  undoForGame,
} from '@/ServerActions/GameActions';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

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
  timeoutExpirationTime: {
    get: number;
    set: (v: number) => void;
  };
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

function largerCardTime(
  playerOne: { get?: PlayerGameStatsStructure },
  playerTwo: { get?: PlayerGameStatsStructure }
) {
  if ((playerOne.get?.cardTime ?? 0) === -1) return playerOne;
  if ((playerTwo.get?.cardTime ?? 0) === -1) return playerTwo;
  return (playerOne.get?.cardTime ?? 0) > (playerTwo.get?.cardTime ?? 0) ? playerOne : playerTwo;
}

function smallerCardTime(
  playerOne: { get?: PlayerGameStatsStructure },
  playerTwo: { get?: PlayerGameStatsStructure }
) {
  if ((playerOne.get?.cardTime ?? 0) === -1) return playerTwo;
  if ((playerTwo.get?.cardTime ?? 0) === -1) return playerOne;
  return (playerOne.get?.cardTime ?? 0) > (playerTwo.get?.cardTime ?? 0) ? playerOne : playerTwo;
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
  const needsSwap = firstTeam === game.firstTeamServes.get;
  team.servedFromLeft.set(!team.servedFromLeft.get);
  game.firstTeamServes.set(firstTeam);
  nextPoint(game, needsSwap ? firstTeam : undefined);
  scoreForGame(game.id, firstTeam, leftPlayer).catch(() => useRouter().refresh());
}

export function ace(game: GameState): void {
  const team = game.firstTeamServes.get ? game.teamOne : game.teamTwo;
  team.score.set(team.score.get + 1);
  nextPoint(game, game.firstTeamServes.get);
  team.servedFromLeft.set(!team.servedFromLeft.get);
  aceForGame(game.id).catch(() => useRouter().refresh());
}

export function timeout(game: GameState, firstTeam): void {
  const team = game.firstTeamServes.get ? game.teamOne : game.teamTwo;
  team.timeouts.set(team.timeouts.get - 1);
  game.timeoutExpirationTime.set(Date.now() + 30_000);
  timeoutForGame(game.id, firstTeam).catch(() => useRouter().refresh()).then();
}

export function endTimeout(game: GameState): void {
  game.timeoutExpirationTime.set(-1);
  endTimeoutForGame(game.id).catch(() => useRouter().refresh()).then();
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
  faultForGame(game.id).catch(() => useRouter().refresh());
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
  const otherTeam = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  const teammate = !leftPlayer ? team.left : team.right;
  if (teammate.get?.cardTime !== 0) {
    const maxScore = Math.min(11, team.score.get + 2);
    if (teammate.get?.cardTime === -1 && player.get?.cardTime === -1) {
      otherTeam.score.set(maxScore);
    } else {
      const bigPlayer = largerCardTime(player, teammate);
      if (teammate.get?.cardTime === -1 || player.get?.cardTime === -1) {
        const delta = Math.max(teammate.get?.cardTime || -1, player.get?.cardTime || -1);
        otherTeam.score.set(Math.min(otherTeam.score.get + delta, maxScore));
      } else {
        const delta = Math.min(teammate.get?.cardTime || -1, player.get?.cardTime || -1);
        otherTeam.score.set(Math.min(otherTeam.score.get + delta, maxScore));
      }
    }
  }
  const temp = player.get!;
  if (temp.cardTimeRemaining >= 0) {
    temp.cardTime += duration;
    temp.cardTimeRemaining = temp.cardTime;
  }
  player.set(temp);
  cardForGame(game.id, firstTeam, leftPlayer, color, duration, reason);
}

export function undo(game: GameState): void {
  if (!game) return;
  undoForGame(game.id).then(() => {
    sync(game);
  });
}

export function sync(game: GameState): void {
  location.reload();
}
