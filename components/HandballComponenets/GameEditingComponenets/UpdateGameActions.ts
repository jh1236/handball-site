import { GameState, TeamState } from '@/components/HandballComponenets/GameState';
import { PersonStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

function swapSides(team: TeamState) {
  const newRight = team.left?.get;
  if (newRight) {
    newRight.sideOfCourt = 'Right';
  }
  const newLeft = team.right?.get;
  if (newLeft) {
    newLeft.sideOfCourt = 'Left';
  }
  team.left.set(newLeft);
  team.right.set(newRight);
}

function nextPoint(game: GameState, firstTeamScored: boolean) {
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
  const team = firstTeamScored ? game.teamOne : game.teamTwo;
  const opponent = firstTeamScored ? game.teamTwo : game.teamOne;
  if (game.badminton.get) {
    if (firstTeamScored === game.firstTeamServes.get) {
      // the team who served has scored
      swapSides(team);
    } else {
      //the team who did not serve scored
      // eslint-disable-next-line no-lonely-if
      if (!team.left.get || !team.right.get) {
        //we are playing a solo game
        let newRight: PlayerGameStatsStructure | undefined;
        let newLeft: PlayerGameStatsStructure | undefined;
        if (!team.servingFromLeft.get) {
          //I think this is inverted because it isn't properly updated yet
          newLeft = team.left.get || team.right.get;
          newLeft!.sideOfCourt = 'Left';
        } else {
          newRight = team.left.get || team.right.get;
          newRight!.sideOfCourt = 'Right';
        }
        team.left.set(newLeft);
        team.right.set(newRight);
      }
    }
  }

  if (!opponent.left.get || !opponent.right.get) {
    let newerRight: PlayerGameStatsStructure | undefined;
    let newerLeft: PlayerGameStatsStructure | undefined;
    if (!team.servingFromLeft.get) {
      //I think this is inverted because it isn't properly updated yet
      newerLeft = opponent.left.get || opponent.right.get;
      newerLeft!.sideOfCourt = 'Left';
    } else {
      newerRight = opponent.left.get || opponent.right.get;
      newerRight!.sideOfCourt = 'Right';
    }
    opponent.left.set(newerLeft);
    opponent.right.set(newerRight);
  }

  game.faulted.set(false);
}

export function didWinGame(game: GameState, firstTeam: boolean) {
  if (!game.ended.get) return false;
  if (Math.max(game.teamOne.score.get, game.teamTwo.score.get) < 5) {
    return false;
  }
  if (game.teamOne.score.get !== game.teamTwo.score.get) {
    return firstTeam === game.teamOne.score.get > game.teamTwo.score.get;
  }
  return firstTeam !== game.firstTeamScoredLast.get;
}

export function decidedOnCoinToss(game: GameState) {
  if (!game.ended.get) return false;
  return Math.max(game.teamOne.score.get, game.teamTwo.score.get) < 5;
}

export function startLocal(game: GameState) {
  if (game.started.get) throw new Error('Game already started');
  for (const i of [game.teamOne, game.teamTwo]) {
    for (const j of Object.keys(i)) {
      if (!['left', 'right', 'sub'].includes(j)) continue;
      const temp: PersonStructure = i[j].get;
      if (!temp) continue;
      temp.sideOfCourt = j.slice(0, 1).toUpperCase() + j.slice(1);
      temp.startSide = j.slice(0, 1).toUpperCase() + j.slice(1);
      i[j].set(temp);
    }
  }
  game.started.set(true);
}

export function scoreLocal(game: GameState, firstTeam: boolean): void {
  const servingTeam = firstTeam ? game.teamOne : game.teamTwo;
  if (game.badminton.get || game.firstTeamServes.get !== firstTeam) {
    servingTeam.servingFromLeft.set(!servingTeam.servingFromLeft.get);
  }

  const team = firstTeam ? game.teamOne : game.teamTwo;
  team.score.set(team.score.get + 1);
  nextPoint(game, firstTeam);
  game.firstTeamServes.set(firstTeam);
}

export function aceLocal(game: GameState): void {
  const team = game.firstTeamServes.get ? game.teamOne : game.teamTwo;
  team.score.set(team.score.get + 1);
  nextPoint(game, game.firstTeamServes.get);
  if (game.badminton.get) {
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

export function abandonLocal(game: GameState) {
  game.abandoned.set(true);
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
    nextPoint(game, !game.firstTeamServes.get); //faulted is unset here
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
  let needsSwap = false;
  if (!player.get || !otherPlayer.get) {
    // Single Player Case
    if (duration === -1) {
      otherTeam.score.set(otherTeamWins);
    } else {
      otherTeam.score.set(Math.min(otherTeamWins, otherTeam.score.get + duration));
    }
    if (duration % 2 !== 0) {
      otherTeam.servingFromLeft.set(!otherTeam.servingFromLeft.get);
    }
    needsSwap = true;
    game.firstTeamServes.set(!firstTeam);
  } else if (player.get && otherPlayer.get?.cardTimeRemaining) {
    // both players are carded
    let pointsToAdd: number;
    if (otherPlayer.get.cardTimeRemaining === -1) {
      // team mate has a red card
      if (duration === -1) {
        // both players are red carded; the game is over
        pointsToAdd = otherTeamWins - otherTeam.score.get;
      } else {
        // instead of being sent off, the other team needs the score to be set
        pointsToAdd = duration;
      }
    } else if (duration === -1) {
      //only i have a red card
      pointsToAdd = otherPlayer.get.cardTimeRemaining;
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

      pointsToAdd = notCardedPlayer.cardTimeRemaining;

      stillCardedPlayer.cardTimeRemaining -= notCardedPlayer.cardTimeRemaining;
      notCardedPlayer.cardTimeRemaining = 0;
    }
    otherTeam.score.set(Math.min(otherTeamWins, otherTeam.score.get + pointsToAdd));
    // set the other team to serve
    game.firstTeamServes.set(!firstTeam);
    const even = pointsToAdd % 2 === 0;
    const cardedTeamServed = firstTeam === game.firstTeamServes.get;
    if (even === cardedTeamServed) {
      // what I thought should happen is this is true when:
      //   both are false (an odd number of points when the team serving gets the points)
      //   both are true  (an even number of points but the team not serving gets the points)
      //   if you were already serving, an odd number of points swaps you
      //   but if you get the service, you don't swap on the first one, so an even number does
      needsSwap = true;
    }
    if (!even) {
      otherTeam.servingFromLeft.set(!otherTeam.servingFromLeft.get);
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
  if (needsSwap) {
    swapSides(otherTeam);
  }
}
