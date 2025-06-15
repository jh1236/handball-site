import { GameState } from '@/components/HandballComponenets/GameState';

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
  if (swap !== undefined && game.badminton) {
    const team = swap ? game.teamOne : game.teamTwo;
    if (team.right.get && team.left.get) {
      const temp = team.left?.get;
      team.left.set(team.right?.get);
      team.right.set(temp);
    }
  }
  game.faulted.set(false);
}

export function scoreLocal(game: GameState, firstTeam: boolean): void {
  const servingTeam = firstTeam ? game.teamOne : game.teamTwo;
  if (game.badminton || game.firstTeamServes.get !== firstTeam) {
    servingTeam.servingFromLeft.set(!servingTeam.servingFromLeft.get);
  }

  const team = firstTeam ? game.teamOne : game.teamTwo;
  team.score.set(team.score.get + 1);
  const needsSwap = firstTeam === game.firstTeamServes.get;
  game.firstTeamServes.set(firstTeam);
  nextPoint(game, needsSwap ? firstTeam : undefined);
}

export function aceLocal(game: GameState): void {
  const team = game.firstTeamServes.get ? game.teamOne : game.teamTwo;
  team.score.set(team.score.get + 1);
  nextPoint(game, game.firstTeamServes.get);
  if (game.badminton) {
    team.servingFromLeft.set(!team.servingFromLeft.get);
  }
}

export function timeoutLocal(game: GameState, firstTeam: boolean): void {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  team.timeouts.set(team.timeouts.get + 1);
  game.timeoutExpirationTime.set(Date.now() + 30_000);
}

export function forfeitLocal(game: GameState, firstTeam: boolean) {
  const myTeam = firstTeam ? game.teamOne : game.teamTwo;
  const otherTeam = firstTeam ? game.teamTwo : game.teamOne;
  otherTeam.score.set(Math.max(11, myTeam.score.get + 2));
}

export function endTimeoutLocal(game: GameState): void {
  game.timeoutExpirationTime.set(-1);
}

export function faultLocal(game: GameState): void {
  const team = !game.firstTeamServes.get ? game.teamOne : game.teamTwo;
  if (game.faulted.get) {
    team.score.set(team.score.get + 1);
    team.servingFromLeft.set(!team.servingFromLeft.get);
    game.firstTeamServes.set(!game.firstTeamServes.get);
    nextPoint(game); //faulted is unset here
  } else {
    game.faulted.set(true);
  }
}

export function subLocal(game: GameState, firstTeam: boolean, leftPlayer: boolean): void {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  const substitute = team.sub;
  const temp = player.get;
  player.set(substitute.get);
  substitute.set(temp);
}

export function warningLocal(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string
): void {
  cardLocal(game, 'Warning', firstTeam, leftPlayer, reason, 0);
}

export function greenCardLocal(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string
): void {
  cardLocal(game, 'Green', firstTeam, leftPlayer, reason, 2);
}

export function yellowCardLocal(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string,
  duration: number = 6
): void {
  cardLocal(game, 'Yellow', firstTeam, leftPlayer, reason, duration);
}

export function redCardLocal(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string
): void {
  cardLocal(game, 'Red', firstTeam, leftPlayer, reason, -1);
}

export function cardLocal(
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
  const outPlayer = player.get!;
  const otherPlayer = leftPlayer ? team.right : team.left;
  const outOtherPlayer = otherPlayer.get!;
  const otherTeamWins = Math.max(11, team.score.get + 2);
  if (!player.get || !otherPlayer.get) {
    // Single Player Case
    if (duration === -1) {
      otherTeam.score.set(otherTeamWins);
    } else {
      otherTeam.score.set(Math.min(otherTeamWins, otherTeam.score.get + duration));
    }
    game.firstTeamServes.set(!firstTeam);
  } else if (player.get && otherPlayer.get?.cardTimeRemaining) {
    // both players are carded
    if (otherPlayer.get.cardTimeRemaining === -1) {
      // team mate has a red card
      if (duration === -1) {
        // both players are red carded; the game is over
        otherTeam.score.set(otherTeamWins);
      } else {
        // instead of being sent off, the other team needs the score to be set
        otherTeam.score.set(Math.min(otherTeamWins, otherTeam.score.get + duration));
      }
    } else if (duration === -1) {
      //only i have a red card
      otherTeam.score.set(
        Math.min(otherTeamWins, otherTeam.score.get + otherPlayer.get.cardTimeRemaining)
      );
      const temp = otherPlayer.get;
      temp.cardTimeRemaining = 0;
      otherPlayer.set(temp);
    } else {
      // no one has a red card
      player.get.cardTimeRemaining += duration;
      player.get.cardTime = player.get.cardTimeRemaining;
      const stillCardedPlayer =
        otherPlayer.get.cardTimeRemaining > player.get.cardTimeRemaining
          ? outOtherPlayer
          : outPlayer;
      const notCardedPlayer =
        otherPlayer.get.cardTimeRemaining <= player.get.cardTimeRemaining
          ? outOtherPlayer
          : outPlayer;
      otherTeam.score.set(
        Math.min(otherTeamWins, otherTeam.score.get + notCardedPlayer.cardTimeRemaining)
      );
      stillCardedPlayer.cardTimeRemaining -= notCardedPlayer.cardTimeRemaining;
      notCardedPlayer.cardTimeRemaining = 0;
    }
    // set the other team to serve
    game.firstTeamServes.set(!firstTeam);
    if (game.firstTeamServes.get === firstTeam) {
      const temp = otherTeam.left?.get;
      otherTeam.left?.set(otherTeam.right?.get);
      otherTeam.right?.set(temp);
    }
  } else if (outPlayer.cardTimeRemaining !== -1) {
    //I dont already have a red card
    outPlayer.cardTime += duration;
    outPlayer.cardTimeRemaining = outPlayer.cardTime;
  }
  outPlayer.prevCards?.push({
    details: duration,
    eventType: `${color}${color !== 'Warning' ? ' Card' : ''}`,
    firstTeam,
    notes: reason,
  });
  player.set(outPlayer);
  if (outOtherPlayer !== otherPlayer.get!) {
    otherPlayer.set(outOtherPlayer);
  }
}
