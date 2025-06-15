import {
  reloadGame,
  startLoading,
} from '@/components/HandballComponenets/GameEditingComponenets/EditGame';
import { QUICK_GAME_END } from '@/components/HandballComponenets/GameEditingComponenets/GameScore';
import {
  aceLocal,
  cardLocal,
  endTimeoutLocal,
  faultLocal,
  forfeitLocal,
  scoreLocal,
  subLocal,
  timeoutLocal,
} from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { GameState } from '@/components/HandballComponenets/GameState';
import {
  aceForGame,
  cardForGame,
  deleteGame,
  endGame,
  endTimeoutForGame,
  faultForGame,
  forfeitGame,
  scoreForGame,
  startGame,
  substituteForGame,
  timeoutForGame,
  undoForGame,
} from '@/ServerActions/GameActions';

export function begin(game: GameState) {
  startLoading();
  startGame(
    game.id,
    !game.firstTeamServes.get,
    game.teamOneIGA.get,
    [
      game.teamOne.left.get?.searchableName,
      game.teamOne.right.get?.searchableName,
      game.teamOne.sub.get?.searchableName,
    ].filter((a) => typeof a === 'string'),
    [
      game.teamTwo.left.get?.searchableName,
      game.teamTwo.right.get?.searchableName,
      game.teamTwo.sub.get?.searchableName,
    ].filter((a) => typeof a === 'string')
  ).then(() => sync(game));
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
  method?: string
): void {
  scoreLocal(game, firstTeam);
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  scoreForGame(game.id, firstTeam, player.get?.searchableName!, leftPlayer, method).catch(() =>
    sync(game)
  );
}

export function ace(game: GameState): void {
  aceLocal(game);
  aceForGame(game.id).catch(() => sync(game));
}

export function timeout(game: GameState, firstTeam: boolean): void {
  timeoutLocal(game, firstTeam);
  timeoutForGame(game.id, firstTeam).catch(() => sync(game));
}

export function forfeit(game: GameState, firstTeam: boolean) {
  forfeitLocal(game, firstTeam);
  forfeitGame(game.id, firstTeam).catch(() => sync(game));
}

export function endTimeout(game: GameState): void {
  endTimeoutLocal(game);
  endTimeoutForGame(game.id).catch(() => sync(game));
}

export function fault(game: GameState): void {
  faultLocal(game);
  faultForGame(game.id).catch(() => sync(game));
}

export function sub(game: GameState, firstTeam: boolean, leftPlayer: boolean): void {
  subLocal(game, firstTeam, leftPlayer);
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const player = leftPlayer ? team.left : team.right;
  substituteForGame(game.id, firstTeam, player.get?.searchableName!, leftPlayer).catch(() =>
    sync(game)
  );
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
