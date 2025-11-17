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
import { GameState, setGameState } from '@/components/HandballComponenets/GameState';
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
  getGame,
  meritForGame,
  replayForGame,
  scoreForGame,
  startGame,
  substituteForGame,
  timeoutForGame,
  undoForGame,
} from '@/ServerActions/GameActions';
import { OfficialStructure } from '@/ServerActions/types';

export function useEditGameActions(game: GameState) {
  function begin(official?: OfficialStructure, scorer?: OfficialStructure) {
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

  function end(reviewRequired: boolean): Promise<void> {
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

  function del(): Promise<void> {
    return deleteGame(game.id).then(() => {
      // eslint-disable-next-line no-restricted-globals
      location.href = '/';
    });
  }

  function score(
    firstTeam: boolean,
    leftPlayer: boolean,
    method?: string,
    location?: string[]
  ): Promise<void> {
    scoreLocal(game, firstTeam);
    const team = firstTeam ? game.teamOne : game.teamTwo;
    const player = leftPlayer ? team.left : team.right;
    return scoreForGame(
      game.id,
      firstTeam,
      player.get?.searchableName!,
      leftPlayer,
      method,
      location
    ).catch(() => sync());
  }

  function ace(location?: string[]): Promise<void> {
    aceLocal(game);
    return aceForGame(game.id, location).catch(() => sync());
  }

  function timeout(firstTeam: boolean): Promise<void> {
    timeoutLocal(game, firstTeam);
    return timeoutForGame(game.id, firstTeam).catch(() => sync());
  }

  function forfeit(firstTeam: boolean): Promise<void> {
    forfeitLocal(game, firstTeam);
    return forfeitGame(game.id, firstTeam).catch(() => sync());
  }

  function abandon(): Promise<void> {
    abandonLocal(game);
    return abandonGame(game.id).catch(() => sync());
  }

  function replay(): Promise<void> {
    replayLocal(game);
    return replayForGame(game.id).catch(() => sync());
  }

  function endTimeout(): Promise<void> {
    endTimeoutLocal(game);
    return endTimeoutForGame(game.id).catch(() => sync());
  }

  function fault(method?: string): Promise<void> {
    faultLocal(game);
    return faultForGame(game.id, method).catch(() => sync());
  }

  function sub(firstTeam: boolean, leftPlayer: boolean): Promise<void> {
    subLocal(game, firstTeam, leftPlayer);
    const team = firstTeam ? game.teamOne : game.teamTwo;
    const player = leftPlayer ? team.left : team.right;
    return substituteForGame(game.id, firstTeam, player.get?.searchableName!, leftPlayer).catch(
      () => sync()
    );
  }

  function merit(firstTeam: boolean, leftPlayer: boolean, reason: string): Promise<void> {
    const team = firstTeam ? game.teamOne : game.teamTwo;
    const player = leftPlayer ? team.left : team.right;
    return meritForGame(game.id, firstTeam, player.get?.searchableName!, reason).catch(() =>
      sync()
    );
  }

  function demerit(firstTeam: boolean, leftPlayer: boolean, reason: string): Promise<void> {
    const team = firstTeam ? game.teamOne : game.teamTwo;
    const player = leftPlayer ? team.left : team.right;
    return demeritForGame(game.id, firstTeam, player.get?.searchableName!, reason).catch(() =>
      sync()
    );
  }

  function card(
    color: 'Warning' | 'Green' | 'Yellow' | 'Red',
    firstTeam: boolean,
    leftPlayer: boolean,
    reason: string,
    duration: number = 2
  ): Promise<void> {
    cardLocal(game, color, firstTeam, leftPlayer, reason, duration);
    const team = firstTeam ? game.teamOne : game.teamTwo;
    const player = leftPlayer ? team.left : team.right;
    return cardForGame(
      game.id,
      firstTeam,
      player.get?.searchableName!,
      color,
      duration,
      reason,
      leftPlayer
    ).catch(() => sync());
  }
  function warning(firstTeam: boolean, leftPlayer: boolean, reason: string): Promise<void> {
    return card('Warning', firstTeam, leftPlayer, reason, 0);
  }

  function greenCard(firstTeam: boolean, leftPlayer: boolean, reason: string): Promise<void> {
    let cardTime = 2;
    if (game.blitzGame.get) {
      cardTime -= 1;
    }
    const team = firstTeam ? game.teamOne : game.teamTwo;
    if (team.isSolo) {
      cardTime -= 1;
    }

    return card('Green', firstTeam, leftPlayer, reason, cardTime);
  }

  function yellowCard(
    firstTeam: boolean,
    leftPlayer: boolean,
    reason: string,
    duration: number = 6
  ): Promise<void> {
    return card('Yellow', firstTeam, leftPlayer, reason, duration);
  }

  function redCard(firstTeam: boolean, leftPlayer: boolean, reason: string): Promise<void> {
    return card('Red', firstTeam, leftPlayer, reason, -1);
  }

  function undo(): Promise<void> {
    if (!game) return Promise.resolve();
    return undoForGame(game.id).then(() => {
      sync();
    });
  }

  function sync(): Promise<void> {
    if (!game) return Promise.resolve();
    return getGame({ gameID: game.id }).then((g) => setGameState(g, game));
  }
  return {
    begin,
    end,
    del,
    score,
    ace,
    timeout,
    forfeit,
    abandon,
    replay,
    endTimeout,
    fault,
    sub,
    merit,
    demerit,
    warning,
    greenCard,
    yellowCard,
    redCard,
    card,
    undo,
    sync,
  };
}
