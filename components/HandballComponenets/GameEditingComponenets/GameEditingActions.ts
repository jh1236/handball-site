import {
  reloadGame,
  startLoading,
} from '@/components/HandballComponenets/GameEditingComponenets/EditGame';
import { QUICK_GAME_END } from '@/components/HandballComponenets/GameEditingComponenets/GameScore/GameScore';
import {
  abandonLocal,
  aceLocal,
  cardLocal,
  endTimeoutLocal,
  faultLocal,
  forfeitLocal,
  replayLocal,
  scoreLocal,
  startLocal,
  subLocal,
  timeoutLocal,
} from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { GameState } from '@/components/HandballComponenets/GameState';
import {
  abandonGame,
  aceForGame,
  cardForGame,
  deleteGame,
  demeritForGame,
  endGame,
  endTimeoutForGame,
  faultForGame,
  forfeitGame,
  meritForGame,
  replayForGame,
  scoreForGame,
  startGame,
  substituteForGame,
  timeoutForGame,
  undoForGame,
} from '@/ServerActions/GameActions';
import { OfficialStructure } from '@/ServerActions/types';

export function begin(game: GameState, official?: OfficialStructure, scorer?: OfficialStructure) {
  startLocal(game);
  const teamOnePlayers = [game.teamOne.left.get, game.teamOne.right.get, game.teamOne.sub.get];
  const teamTwoPlayers = [game.teamTwo.left.get, game.teamTwo.right.get, game.teamTwo.sub.get];
  startGame(
    game.id,
    !game.firstTeamServes.get,
    game.teamOneIGA.get,
    teamOnePlayers.filter((a) => typeof a !== 'undefined').map((a) => a?.searchableName),
    teamTwoPlayers.filter((a) => typeof a !== 'undefined').map((a) => a?.searchableName),
    teamOnePlayers.find((a) => a && a.isLibero)?.searchableName,
    teamTwoPlayers.find((a) => a && a.isLibero)?.searchableName,
    official?.searchableName,
    scorer?.searchableName
  );
}

export function end(game: GameState, reviewRequired: boolean) {
  return endGame(
    game.id,
    game.votes.get.map((pgs) => pgs!.searchableName),
    game.teamOne.rating.get === 0 && QUICK_GAME_END ? 3 : game.teamOne.rating.get,
    game.teamTwo.rating.get === 0 && QUICK_GAME_END ? 3 : game.teamTwo.rating.get,
    game.notes.get,
    game.teamOne.protest.get,
    game.teamTwo.protest.get,
    game.teamOne.notes.get,
    game.teamTwo.notes.get,
    reviewRequired
  );
}

export function del(game: GameState) {
  deleteGame(game.id).then(() => {
    // eslint-disable-next-line no-restricted-globals
    location.href = '/';
  });
}

export function score(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  method?: string,
  location?: string[]
): void {
  scoreLocal(game, firstTeam);
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  scoreForGame(game.id, firstTeam, player.get?.searchableName!, leftPlayer, method, location).catch(
    () => sync(game)
  );
}

export function ace(game: GameState, location?: string[]): void {
  aceLocal(game);
  aceForGame(game.id, location).catch(() => sync(game));
}

export function timeout(game: GameState, firstTeam: boolean): void {
  timeoutLocal(game, firstTeam);
  timeoutForGame(game.id, firstTeam).catch(() => sync(game));
}

export function forfeit(game: GameState, firstTeam: boolean) {
  forfeitLocal(game, firstTeam);
  forfeitGame(game.id, firstTeam).catch(() => sync(game));
}

export function abandon(game: GameState) {
  abandonLocal(game);
  abandonGame(game.id).catch(() => sync(game));
}

export function replay(game: GameState) {
  replayLocal(game);
  replayForGame(game.id).catch(() => sync(game));
}

export function endTimeout(game: GameState): void {
  endTimeoutLocal(game);
  endTimeoutForGame(game.id).catch(() => sync(game));
}

export function fault(game: GameState, method?: string): void {
  faultLocal(game);
  faultForGame(game.id, method).catch(() => sync(game));
}

export function sub(game: GameState, firstTeam: boolean, leftPlayer: boolean): void {
  subLocal(game, firstTeam, leftPlayer);
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  substituteForGame(game.id, firstTeam, player.get?.searchableName!, leftPlayer).catch(() =>
    sync(game)
  );
}

export function merit(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string
): void {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  meritForGame(game.id, firstTeam, player.get?.searchableName!, reason).catch(() => sync(game));
}

export function demerit(
  game: GameState,
  firstTeam: boolean,
  leftPlayer: boolean,
  reason: string
): void {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  demeritForGame(game.id, firstTeam, player.get?.searchableName!, reason).catch(() => sync(game));
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
  let cardTime = 2;
  if (game.blitzGame.get) {
    cardTime -= 1;
  }
  const team = firstTeam ? game.teamOne : game.teamTwo;
  if (team.isSolo) {
    cardTime -= 1;
  }

  card(game, 'Green', firstTeam, leftPlayer, reason, cardTime);
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
  cardLocal(game, color, firstTeam, leftPlayer, reason, duration);
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  cardForGame(
    game.id,
    firstTeam,
    player.get?.searchableName!,
    color,
    duration,
    reason,
    leftPlayer
  ).catch(() => sync(game));
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
