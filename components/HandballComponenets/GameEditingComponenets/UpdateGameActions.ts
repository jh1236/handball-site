import { GameState } from '@/components/HandballComponenets/GameState';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

function nextPoint(game: GameState, firstTeamScored: boolean) {
  const team = firstTeamScored ? game.teamOne : game.teamTwo;
  const opponent = firstTeamScored ? game.teamTwo : game.teamOne;
  let opponentLeft = opponent.left.get ? { ...opponent.left.get } : undefined;
  let opponentRight = opponent.right.get ? { ...opponent.right.get } : undefined;
  let left = team.left.get ? { ...team.left.get } : undefined;
  let right = team.right.get ? { ...team.right.get } : undefined;

  game.replaysSinceScore.set(0);
  for (const i of [left, right, opponentLeft, opponentRight]) {
    if (!i) continue;
    if (i.cardTimeRemaining > 0) {
      i.cardTimeRemaining -= 1;
    }
  }
  if (game.badminton.get) {
    if (firstTeamScored === game.firstTeamServes.get) {
      // the team who served has scored
      const temp = left;
      left = right ? { ...right, sideOfCourt: 'Left', actingSideOfCourt: 'Left' } : undefined;
      right = temp ? { ...temp, sideOfCourt: 'Right', actingSideOfCourt: 'Right' } : undefined;
    } else {
      //the team who did not serve scored
      // eslint-disable-next-line no-lonely-if
      if (!left || !right) {
        //we are playing a solo game
        if (!team.servingFromLeft.get) {
          //I think this is inverted because it isn't properly updated yet
          left = left || right;
          left!.sideOfCourt = 'Left';
          left!.actingSideOfCourt = 'Left';
        } else {
          right = left || right;
          right!.sideOfCourt = 'Right';
          right!.actingSideOfCourt = 'Right';
        }
      }
    }
  }
  if (!opponentLeft || !opponentRight) {
    if (!team.servingFromLeft.get) {
      opponentLeft = opponentLeft || opponentRight;
      opponentLeft!.sideOfCourt = 'Left';
    } else {
      opponentRight = opponentLeft || opponentRight;
      opponentRight!.sideOfCourt = 'Right';
    }
  }
  fixCourtPositions(
    firstTeamScored,
    !team.servingFromLeft.get,
    firstTeamScored ? [left, right] : [opponentLeft, opponentRight],
    firstTeamScored ? [opponentLeft, opponentRight] : [left, right]
  );
  team.left.set(left);
  team.right.set(right);
  opponent.left.set(opponentLeft);
  opponent.right.set(opponentRight);
  game.faulted.set(false);
}

function fixCourtPositions(
  firstTeamServing: boolean,
  servingFromLeft: boolean,
  teamOnePlayers: (PlayerGameStatsStructure | undefined)[],
  teamTwoPlayers: (PlayerGameStatsStructure | undefined)[]
) {
  const servingTeamPlayers = firstTeamServing ? teamOnePlayers : teamTwoPlayers;
  const receivingTeamPlayers = firstTeamServing ? teamTwoPlayers : teamOnePlayers;
  const left = servingTeamPlayers.find((a) => a?.sideOfCourt === 'Left');
  const right = servingTeamPlayers.find((a) => a?.sideOfCourt === 'Right');
  const opponentLeft = receivingTeamPlayers.find((a) => a?.sideOfCourt === 'Left');
  const opponentRight = receivingTeamPlayers.find((a) => a?.sideOfCourt === 'Right');

  if (left) left.actingSideOfCourt = 'Left';
  if (right) right.actingSideOfCourt = 'Right';
  if (opponentLeft) opponentLeft.actingSideOfCourt = 'Left';
  if (opponentRight) opponentRight.actingSideOfCourt = 'Right';

  const receiver = servingFromLeft
    ? receivingTeamPlayers.find((p) => p?.isLibero && p.cardTimeRemaining === 0) || opponentLeft
    : receivingTeamPlayers.find((p) => p?.isLibero && p.cardTimeRemaining === 0) || opponentRight;

  const nonReceiver = receiver === opponentLeft ? opponentRight : opponentLeft;

  if (receiver) receiver.actingSideOfCourt = servingFromLeft ? 'Left' : 'Right';
  if (nonReceiver) nonReceiver.actingSideOfCourt = servingFromLeft ? 'Right' : 'Left';
  if (
    receiver?.cardTimeRemaining !== 0 ||
    (nonReceiver?.cardTimeRemaining === 0 && nonReceiver?.isLibero)
  ) {
    if (opponentLeft) opponentLeft.actingSideOfCourt = 'Right';
    if (opponentRight) opponentRight.actingSideOfCourt = 'Left';
  }

  // as above
  const server = servingFromLeft ? left : right;

  if (server?.cardTimeRemaining !== 0) {
    if (left) left.actingSideOfCourt = 'Right';
    if (right) right.actingSideOfCourt = 'Left';
  }
}

function fixCourtPositionsAndApply(
  game: GameState,
  firstTeamServing: boolean,
  servingFromLeft: boolean
) {
  const teamOneLeft = game.teamOne.left.get;
  const teamOneRight = game.teamOne.right.get;
  const teamTwoLeft = game.teamTwo.left.get;
  const teamTwoRight = game.teamTwo.right.get;
  fixCourtPositions(
    firstTeamServing,
    servingFromLeft,
    [teamOneLeft, teamOneRight],
    [teamTwoLeft, teamTwoRight]
  );
  game.teamOne.left.set(teamOneLeft);
  game.teamOne.right.set(teamOneRight);
  game.teamTwo.left.set(teamTwoLeft);
  game.teamTwo.right.set(teamTwoRight);
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

const sides: { [key: string]: 'Left' | 'Right' | 'Substitute' } = {
  left: 'Left',
  right: 'Right',
  sub: 'Substitute',
};

export function startLocal(game: GameState) {
  if (game.started.get) throw new Error('Game already started');
  for (const i of [game.teamOne, game.teamTwo]) {
    for (const j of Object.keys(i)) {
      if (!['left', 'right', 'sub'].includes(j)) continue;
      const temp: PlayerGameStatsStructure = i[j].get;
      if (!temp) continue;
      temp.sideOfCourt = sides[j]!;
      temp.actingSideOfCourt = sides[j]!;
      temp.startSide = sides[j]!;
      i[j].set(temp);
    }
  }
  game.started.set(true);
  fixCourtPositionsAndApply(game, game.firstTeamServes.get, game.servingFromLeft);
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
  const side = leftPlayer ? 'Left' : 'Right';
  const temp = {
    ...player.get!,
    sideOfCourt: 'Substitute' as const,
    actingSideOfCourt: 'Substitute' as const,
  };
  player.set({ ...team.sub.get!, sideOfCourt: side, actingSideOfCourt: side });
  team.sub.set(temp);
}

export function replayLocal(game: GameState): void {
  game.replaysSinceScore.set(game.replaysSinceScore.get + 1);
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
  const outPlayer = { ...player.get! };
  const otherPlayer = leftPlayer ? team.right : team.left;
  const outOtherPlayer = { ...otherPlayer.get! };
  const otherTeamWins = Math.max(11, team.score.get + 2);
  let swapOtherTeamPlayers = false;
  let firstTeamToServe = game.firstTeamServes.get;
  let toServeFromLeft = game.servingFromLeft;
  const firstTeamServed = game.firstTeamServes.get;
  const prevSideServed = game.servingFromLeft;
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
    swapOtherTeamPlayers = true;
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
      outOtherPlayer.cardTimeRemaining = 0;
    } else {
      // no one has a red card
      outPlayer.cardTimeRemaining += duration;
      outPlayer.cardTime = player.get.cardTimeRemaining;
      const stillCardedPlayer =
        outOtherPlayer.cardTimeRemaining > outPlayer.cardTimeRemaining ? outOtherPlayer : outPlayer;
      const notCardedPlayer =
        outOtherPlayer.cardTimeRemaining <= outPlayer.cardTimeRemaining
          ? outOtherPlayer
          : outPlayer;

      pointsToAdd = notCardedPlayer.cardTimeRemaining;

      stillCardedPlayer.cardTimeRemaining -= notCardedPlayer.cardTimeRemaining;
      notCardedPlayer.cardTimeRemaining = 0;
    }
    otherTeam.score.set(Math.min(otherTeamWins, otherTeam.score.get + pointsToAdd));
    // set the other team to serve
    firstTeamToServe = !firstTeamToServe;
    const even = pointsToAdd % 2 === 0;
    const cardedTeamServed = firstTeam === game.firstTeamServes.get;
    if (even === cardedTeamServed) {
      // what I thought should happen is this is true when:
      //   both are false (an odd number of points when the team serving gets the points)
      //   both are true  (an even number of points but the team not serving gets the points)
      //   if you were already serving, an odd number of points swaps you
      //   but if you get the service, you don't swap on the first one, so an even number does
      swapOtherTeamPlayers = true;
    }
    if (!even) {
      toServeFromLeft = !toServeFromLeft;
    }
  } else if (outPlayer.cardTimeRemaining !== -1) {
    //I dont already have a red card
    outPlayer.cardTime += duration;
    outPlayer.cardTimeRemaining = outPlayer.cardTime;
  }
  outPlayer.prevCards?.push({
    //I don't think any of these are ever used but ooh well
    firstTeamJustServed: firstTeamServed,
    firstTeamToServe: game.firstTeamServes.get,
    gameId: game.id,
    id: -1,
    sideServed: prevSideServed ? 'Left' : 'Right',
    sideToServe: game.servingFromLeft ? 'Left' : 'Right',
    teamOneLeft: game.teamOne.left.get,
    teamOneRight: game.teamOne.right.get,
    teamTwoLeft: game.teamTwo.left.get,
    teamTwoRight: game.teamTwo.right.get,
    details: duration,
    eventType: `${color}${color !== 'Warning' ? ' Card' : ''}`,
    firstTeam,
    notes: reason,
  });
  let otherTeamLeft = otherTeam.left.get;
  let otherTeamRight = otherTeam.right.get;
  if (swapOtherTeamPlayers) {
    [otherTeamLeft, otherTeamRight] = [otherTeamRight, otherTeamLeft];
    if (otherTeamRight) otherTeamRight.sideOfCourt = 'Right';
    if (otherTeamLeft) otherTeamLeft.sideOfCourt = 'Left';
  }
  game.firstTeamServes.set(firstTeamToServe);
  const servingTeam = firstTeamToServe ? game.teamOne : game.teamTwo;
  servingTeam.servingFromLeft.set(toServeFromLeft);
  fixCourtPositions(
    firstTeamToServe,
    toServeFromLeft,
    firstTeam ? [outPlayer, outOtherPlayer] : [otherTeamRight, otherTeamLeft],
    firstTeam ? [otherTeamRight, otherTeamLeft] : [outPlayer, outOtherPlayer]
  );
  player.set(outPlayer);
  otherPlayer.set(outOtherPlayer);
  otherTeam.left.set(otherTeamLeft);
  otherTeam.right.set(otherTeamRight);
}
