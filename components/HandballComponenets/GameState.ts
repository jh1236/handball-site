import React, { useCallback, useEffect, useMemo } from 'react';
import { playersFromGame } from '@/components/HandballComponenets/GameEditingComponenets/EditGame';
import {
  cardLocal,
  endTimeoutLocal,
  faultLocal,
  forfeitLocal,
  scoreLocal,
  subLocal,
  timeoutLocal,
} from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { GameEventStructure, GameStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

export function getWinningScore(game: GameState): number {
  return game.blitzGame ? 7 : 11;
}

export function getForceWinningScore(game: GameState): number {
  return 2 * getWinningScore(game);
}

export interface GameState {
  practice: {
    get: boolean;
    set: (v: boolean) => void;
  };
  badminton: {
    get: boolean;
    set: (v: boolean) => void;
  };
  abandoned: {
    get: boolean;
    set: (v: boolean) => void;
  };
  timeoutExpirationTime: {
    get: number;
    set: (v: number) => void;
  };
  votes: {
    get: PlayerGameStatsStructure[];
    set: (v: PlayerGameStatsStructure[]) => void;
  };
  notes: {
    get: string;
    set: (v: string) => void;
  };
  blitzGame: {
    get: boolean;
    set: (v: boolean) => void;
  };
  id: number;
  teamOne: TeamState;
  teamTwo: TeamState;
  firstTeamServes: {
    get: boolean;
    set: (v: boolean) => void;
  };
  firstTeamScoredLast: {
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
  servingFromLeft: boolean;
}

export type TeamState = {
  name: {
    get: string;
    set: (v: string) => void;
  };
  score: {
    get: number;
    set: (v: number) => void;
  };
  rating: {
    get: number;
    set: (v: number) => void;
  };
  notes: {
    get: string;
    set: (v: string) => void;
  };
  protest: {
    get: string;
    set: (v: string) => void;
  };
  timeouts: {
    get: number;
    set: (v: number) => void;
  };
  servingFromLeft: {
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

export function useGameState(game?: GameStructure) {
  const [faulted, setFaulted] = React.useState<boolean>(false);
  const [started, setStarted] = React.useState<boolean>(true);
  const [ended, setEnded] = React.useState<boolean>(false);
  const [firstTeamScoredLast, setFirstTeamScoredLast] = React.useState<boolean>(false);
  const [firstTeamServes, setFirstTeamServes] = React.useState<boolean>(false);
  const [abandoned, setAbandoned] = React.useState<boolean>(false);
  const [timeoutExpirationTime, setTimeoutExpirationTime] = React.useState<number>(-1);
  const [teamOneIGA, setTeamOneIGA] = React.useState<boolean>(true);
  const [notes, setNotes] = React.useState<string>('');
  const [practice, setPractice] = React.useState<boolean>(game?.tournament.editable ?? false);
  const [votes, setVotes] = React.useState<PlayerGameStatsStructure[]>([]);
  const [blitzGame, setBlitzGame] = React.useState<boolean>(false);
  const [badminton, setBadminton] = React.useState<boolean>(false);

  //team one state
  const [teamOneTimeouts, setTeamOneTimeouts] = React.useState<number>(0);
  const [teamOneNotes, setTeamOneNotes] = React.useState<string>('');
  const [teamOneProtest, setTeamOneProtest] = React.useState<string>('');
  const [teamOneServingLeft, setTeamOneServingLeft] = React.useState<boolean>(true);
  const [teamOneName, setTeamOneName] = React.useState<string>('Loading...');
  const [teamOneScore, setTeamOneScore] = React.useState<number>(0);
  const [teamOneRating, setTeamOneRating] = React.useState<number>(0);
  const [teamOneLeft, setTeamOneLeft] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamOneRight, setTeamOneRight] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamOneSub, setTeamOneSub] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  //team two state
  const [teamTwoTimeouts, setTeamTwoTimeouts] = React.useState<number>(0);
  const [teamTwoNotes, setTeamTwoNotes] = React.useState<string>('');
  const [teamTwoProtest, setTeamTwoProtest] = React.useState<string>('');

  const [teamTwoServingLeft, setTeamTwoServingLeft] = React.useState<boolean>(true);
  const [teamTwoName, setTeamTwoName] = React.useState<string>('Loading...');
  const [teamTwoScore, setTeamTwoScore] = React.useState<number>(0);
  const [teamTwoRating, setTeamTwoRating] = React.useState<number>(0);
  const [teamTwoLeft, setTeamTwoLeft] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamTwoRight, setTeamTwoRight] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamTwoSub, setTeamTwoSub] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const servingFromLeft = useMemo(
    () => (firstTeamServes ? teamOneServingLeft : teamTwoServingLeft),
    [firstTeamServes, teamOneServingLeft, teamTwoServingLeft]
  );

  useEffect(() => {
    if (abandoned) {
      setEnded(true);
      return;
    }
    if (teamOneScore || teamTwoScore) {
      const bigScore = Math.max(teamOneScore, teamTwoScore);
      const lilScore = Math.min(teamOneScore, teamTwoScore);
      if (bigScore < (blitzGame ? 11 : 7)) return;
      if (bigScore < (blitzGame ? 22 : 14) && bigScore - lilScore <= 1) return;
      setEnded(true);
    }
  }, [teamOneScore, teamTwoScore, abandoned, blitzGame]);

  const gameState: GameState = useMemo(
    () => ({
      practice: {
        get: practice,
        set: setPractice,
      },
      blitzGame: {
        get: blitzGame,
        set: setBlitzGame,
      },
      abandoned: {
        get: abandoned,
        set: setAbandoned,
      },
      votes: {
        get: votes,
        set: setVotes,
      },
      badminton: {
        get: badminton,
        set: setBadminton,
      },
      timeoutExpirationTime: {
        get: timeoutExpirationTime,
        set: setTimeoutExpirationTime,
      },
      teamOneIGA: {
        get: teamOneIGA,
        set: setTeamOneIGA,
      },
      started: {
        get: started,
        set: setStarted,
      },
      ended: {
        get: ended,
        set: setEnded,
      },
      firstTeamServes: {
        get: firstTeamServes,
        set: setFirstTeamServes,
      },
      faulted: {
        get: faulted,
        set: setFaulted,
      },
      id: game?.id ?? -1,
      servingFromLeft,
      notes: {
        get: notes,
        set: setNotes,
      },
      teamOne: {
        name: {
          get: teamOneName,
          set: setTeamOneName,
        },
        score: {
          get: teamOneScore,
          set: setTeamOneScore,
        },
        rating: {
          get: teamOneRating,
          set: setTeamOneRating,
        },
        notes: {
          get: teamOneNotes,
          set: setTeamOneNotes,
        },
        protest: {
          get: teamOneProtest,
          set: setTeamOneProtest,
        },
        timeouts: {
          get: teamOneTimeouts,
          set: setTeamOneTimeouts,
        },
        servingFromLeft: {
          get: teamOneServingLeft,
          set: setTeamOneServingLeft,
        },
        left: {
          get: teamOneLeft,
          set: setTeamOneLeft,
        },
        right: {
          get: teamOneRight,
          set: setTeamOneRight,
        },
        sub: {
          get: teamOneSub,
          set: setTeamOneSub,
        },
      },
      teamTwo: {
        name: {
          get: teamTwoName,
          set: setTeamTwoName,
        },
        score: {
          get: teamTwoScore,
          set: setTeamTwoScore,
        },
        rating: {
          get: teamTwoRating,
          set: setTeamTwoRating,
        },
        notes: {
          get: teamTwoNotes,
          set: setTeamTwoNotes,
        },
        protest: {
          get: teamTwoProtest,
          set: setTeamTwoProtest,
        },
        timeouts: {
          get: teamTwoTimeouts,
          set: setTeamTwoTimeouts,
        },
        servingFromLeft: {
          get: teamTwoServingLeft,
          set: setTeamTwoServingLeft,
        },
        left: {
          get: teamTwoLeft,
          set: setTeamTwoLeft,
        },
        right: {
          get: teamTwoRight,
          set: setTeamTwoRight,
        },
        sub: {
          get: teamTwoSub,
          set: setTeamTwoSub,
        },
      },
      firstTeamScoredLast: {
        get: firstTeamScoredLast,
        set: setFirstTeamScoredLast,
      },
    }),
    [
      abandoned,
      badminton,
      ended,
      faulted,
      firstTeamScoredLast,
      firstTeamServes,
      game?.id,
      notes,
      practice,
      servingFromLeft,
      started,
      teamOneIGA,
      teamOneLeft,
      teamOneName,
      teamOneNotes,
      teamOneProtest,
      teamOneRating,
      teamOneRight,
      teamOneScore,
      teamOneServingLeft,
      teamOneSub,
      teamOneTimeouts,
      teamTwoLeft,
      teamTwoName,
      teamTwoNotes,
      teamTwoProtest,
      teamTwoRating,
      teamTwoRight,
      teamTwoScore,
      teamTwoServingLeft,
      teamTwoSub,
      teamTwoTimeouts,
      timeoutExpirationTime,
      votes,
    ]
  );

  return {
    addGameEventToState: useCallback(
      (gameEvent: GameEventStructure) => addGameEventToGame(gameState, gameEvent),
      [gameState]
    ),
    gameState,
    setGameForState: useCallback(
      (gameIn: GameStructure) => setGameState(gameIn, gameState),
      [gameState]
    ),
  };
}

function setGameState(gameObj: GameStructure, state: GameState) {
  state.firstTeamServes.set(gameObj.firstTeamToServe);
  state.faulted.set(gameObj.faulted);
  state.teamOneIGA.set(gameObj.firstTeamIga ?? true);
  state.timeoutExpirationTime.set(gameObj.timeoutExpirationTime);
  state.started.set(gameObj.started);
  state.ended.set(gameObj.someoneHasWon);
  state.votes.set(playersFromGame(gameObj));
  state.badminton.set(gameObj.tournament.usingBadmintonServes);
  state.practice.set(gameObj.tournament.editable);
  state.abandoned.set(gameObj.abandoned);
  state.firstTeamScoredLast.set(gameObj.firstTeamScoredLast);
  state.blitzGame.set(gameObj.blitzGame);
  //Team Specific
  state.teamOne.name.set(gameObj.teamOne.name);
  state.teamOne.timeouts.set(gameObj.teamOneTimeouts);
  state.teamOne.score.set(gameObj.teamOneScore);

  state.teamOne.servingFromLeft.set(gameObj.teamOne.servingFromLeft!);
  const { teamOne, teamTwo } = gameObj;
  if (gameObj.started) {
    const sorted = [teamOne.captain, teamOne.nonCaptain, teamOne.substitute].toSorted((a, b) =>
      (a?.sideOfCourt ?? 'z').localeCompare(b?.sideOfCourt ?? 'z')
    );
    state.teamOne.left.set(sorted[0] || undefined);
    state.teamOne.right.set(sorted[1] || undefined);
    state.teamOne.sub.set(sorted[2] || undefined);
  } else {
    //trick i stole from python, if nonCaptain is null it will be replaced with undefined
    state.teamOne.left.set(teamOne.captain);
    state.teamOne.right.set(teamOne.nonCaptain || undefined);
    state.teamOne.sub.set(teamOne.substitute || undefined);
  }
  state.teamTwo.name.set(gameObj.teamTwo.name);
  state.teamTwo.timeouts.set(gameObj.teamTwoTimeouts);
  state.teamTwo.score.set(gameObj.teamTwoScore);

  state.teamTwo.servingFromLeft.set(gameObj.teamTwo.servingFromLeft!);
  if (gameObj.started) {
    const sorted = [teamTwo.captain, teamTwo.nonCaptain, teamTwo.substitute].toSorted((a, b) =>
      (a?.sideOfCourt ?? 'z').localeCompare(b?.sideOfCourt ?? 'z')
    );
    state.teamTwo.left.set(sorted[0] || undefined);
    state.teamTwo.right.set(sorted[1] || undefined);
    state.teamTwo.sub.set(sorted[2] || undefined);
  } else {
    //trick i stole from python, if nonCaptain is null it will be replaced with undefined
    state.teamTwo.left.set(teamTwo.captain);
    state.teamTwo.right.set(teamTwo.nonCaptain || undefined);
    state.teamTwo.sub.set(teamTwo.substitute || undefined);
  }
}

function addGameEventToGame(game: GameState, gameEvent: GameEventStructure) {
  const team = gameEvent.firstTeam ? game.teamOne : game.teamTwo;
  const leftPlayer = team.left.get?.searchableName === gameEvent.player?.searchableName;
  switch (gameEvent.eventType) {
    case 'Score':
      scoreLocal(game, gameEvent.firstTeam);
      break;
    case 'Timeout':
      timeoutLocal(game, gameEvent.firstTeam);
      break;
    case 'Forfeit':
      forfeitLocal(game, gameEvent.firstTeam);
      break;
    case 'End Timeout':
      endTimeoutLocal(game);
      break;
    case 'Fault':
      faultLocal(game);
      break;
    case 'Substitute':
      subLocal(game, gameEvent.firstTeam, leftPlayer);
      break;
    case 'End Game':
      game.ended.set(true);
      break;

    case 'Warning':
    case 'Green Card':
    case 'Yellow Card':
    case 'Red Card':
      cardLocal(
        game,
        gameEvent.eventType.replaceAll(' Card', '') as 'Green' | 'Yellow' | 'Red' | 'Warning',
        gameEvent.firstTeam,
        leftPlayer,
        gameEvent.notes,
        gameEvent.details
      );
  }
}
