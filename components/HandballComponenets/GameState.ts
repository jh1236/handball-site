import React, { useEffect, useMemo } from 'react';
import { playersFromGame } from '@/components/HandballComponenets/GameEditingComponenets/EditGame';
import { GameStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

export interface GameState {
  badminton: boolean;
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
  servingFromLeft: boolean;
}

type Team = {
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
  const [firstTeamServes, setFirstTeamServes] = React.useState<boolean>(false);
  const [timeoutExpirationTime, setTimeoutExpirationTime] = React.useState<number>(-1);
  const [teamOneIGA, setTeamOneIGA] = React.useState<boolean>(true);
  const [notes, setNotes] = React.useState<string>('');
  const [votes, setVotes] = React.useState<PlayerGameStatsStructure[]>([]);

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
    if (teamOneScore || teamTwoScore) {
      const bigScore = Math.max(teamOneScore, teamTwoScore);
      const lilScore = Math.min(teamOneScore, teamTwoScore);
      if (bigScore < 11) return;
      if (bigScore - lilScore <= 1) return;
      setEnded(true);
    }
  }, [teamOneScore, teamTwoScore]);

  const gameState: GameState = {
    votes: {
      get: votes,
      set: setVotes,
    },
    badminton: game?.tournament.usingBadmintonServes ?? false,
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
  };

  return gameState;
}

export function setGameState(gameObj: GameStructure, state: GameState) {
  state.firstTeamServes.set(gameObj.firstTeamToServe);
  state.faulted.set(gameObj.faulted);
  state.teamOneIGA.set(gameObj.firstTeamIga ?? true);
  state.timeoutExpirationTime.set(gameObj.timeoutExpirationTime);
  state.started.set(gameObj.started);
  state.ended.set(gameObj.someoneHasWon);
  state.votes.set(playersFromGame(gameObj));
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
