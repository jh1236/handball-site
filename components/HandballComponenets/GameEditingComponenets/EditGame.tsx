'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Box, Button, LoadingOverlay, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  del,
  endTimeout,
  GameState,
  sync,
  undo,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { GameScore } from '@/components/HandballComponenets/GameEditingComponenets/GameScore';
import { PlayerButton } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton';
import { TeamButton } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { getGame } from '@/ServerActions/GameActions';
import { GameStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

let setGameFn: (game: GameStructure) => void;
//necessary to reveal the state from the React component
// eslint-disable-next-line import/no-mutable-exports
export let startLoading: () => void;

export function reloadGame(gameID: number) {
  getGame({ gameID }).then((gameIn) => {
    setGameFn(gameIn);
  });
}

export function EditGame({ game }: { game: number }) {
  const { isUmpireManager, isOfficial, isLoggedIn } = useUserData();

  const [gameObj, setGameObj] = React.useState<GameStructure | null>(null);
  setGameFn = setGameObj;
  const [visibleLoading, { open: openLoading, close: closeLoading }] = useDisclosure(false);
  const [editOfficialGame, { close: iKnowWhatImDoing }] = useDisclosure(true);
  startLoading = openLoading;
  const [visibleTimeout, { open: openTimeout, close: closeTimeout }] = useDisclosure(false);
  const [faulted, setFaulted] = React.useState<boolean>(false);
  const [started, setStarted] = React.useState<boolean>(true);
  const [ended, setEnded] = React.useState<boolean>(false);
  const [firstTeamServes, setFirstTeamServes] = React.useState<boolean>(false);
  const [timeoutExpirationTime, setTimeoutExpirationTime] = React.useState<number>(-1);
  const [currentTime, setCurrentTime] = React.useState<number>(300);
  const [teamOneIGA, setTeamOneIGA] = React.useState<boolean>(true);
  const [notes, setNotes] = React.useState<string>('');

  //team one state
  const [teamOneTimeouts, setTeamOneTimeouts] = React.useState<number>(0);
  const [teamOneNotes, setTeamOneNotes] = React.useState<string>('');
  const [teamOneProtest, setTeamOneProtest] = React.useState<string>('');
  const [teamOneSigned, setTeamOneSigned] = React.useState<string>('');
  const [teamOneServedLeft, setTeamOneServedLeft] = React.useState<boolean>(true);
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

  const [teamTwoSigned, setTeamTwoSigned] = React.useState<string>('');
  const [teamTwoServedLeft, setTeamTwoServedLeft] = React.useState<boolean>(true);
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
  const servedFromLeft = useMemo(
    () => (firstTeamServes ? teamOneServedLeft : teamTwoServedLeft),
    [firstTeamServes, teamOneServedLeft, teamTwoServedLeft]
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (teamOneScore || teamTwoScore) {
      const bigScore = Math.max(teamOneScore, teamTwoScore);
      const lilScore = Math.min(teamOneScore, teamTwoScore);
      if (bigScore < 11) return;
      if (bigScore - lilScore <= 1) return;
      setEnded(true);
    }
  }, [teamOneScore, teamTwoScore]);

  useEffect(() => {
    reloadGame(game);
  }, [game]);

  useEffect(() => {
    if (!gameObj) return;
    setFirstTeamServes(gameObj.firstTeamToServe);
    setFaulted(gameObj.faulted);
    setTeamOneIGA(gameObj.firstTeamIga ?? true);
    setTimeoutExpirationTime(gameObj.timeoutExpirationTime);
    setStarted(gameObj.started);
    setEnded(gameObj.someoneHasWon);
    //Team Specific
    setTeamOneTimeouts(gameObj.teamOneTimeouts);
    setTeamOneScore(gameObj.teamOneScore);
    setTeamOneServedLeft(gameObj.teamOne.servedFromLeft!);
    console.log(`${gameObj.teamOne.name} Left Serve is ${gameObj.teamOne.servedFromLeft}`);
    const { teamOne, teamTwo } = gameObj;
    if (gameObj.started) {
      for (const i of [teamOne.captain, teamOne.nonCaptain, teamOne.substitute]) {
        if (!i) {
          // The code cleaner fuckin hates me and wants no continue here
        } else if (i.sideOfCourt === 'Left') {
          setTeamOneLeft(i);
        } else if (i.sideOfCourt === 'Right') {
          setTeamOneRight(i);
        } else if (i.sideOfCourt === 'Substitute') {
          setTeamOneSub(i);
        }
      }
    } else {
      //trick i stole from python, if nonCaptain is null it will be replaced with undefined
      setTeamOneLeft(teamOne.captain);
      setTeamOneRight(teamOne.nonCaptain || undefined);
      setTeamOneSub(teamOne.substitute || undefined);
    }
    setTeamOneName(gameObj.teamOne.name);
    setTeamTwoName(gameObj.teamTwo.name);
    setTeamTwoTimeouts(gameObj.teamTwoTimeouts);
    setTeamTwoScore(gameObj.teamTwoScore);
    setTeamTwoServedLeft(gameObj.teamTwo.servedFromLeft!);
    console.log(`${gameObj.teamTwo.name} Left Serve is ${gameObj.teamTwo.servedFromLeft}`);
    if (gameObj.started) {
      for (const i of [teamTwo.captain, teamTwo.nonCaptain, teamTwo.substitute]) {
        if (i?.sideOfCourt === 'Left') {
          setTeamTwoLeft(i);
        }
        if (i?.sideOfCourt === 'Right') {
          setTeamTwoRight(i);
        }
        if (i?.sideOfCourt === 'Substitute') {
          setTeamTwoSub(i);
        }
      }
    } else {
      setTeamTwoLeft(teamTwo.captain);
      //trick i stole from python, if nonCaptain is null it will be replaced with undefined
      setTeamTwoRight(teamTwo.nonCaptain || undefined);
      setTeamTwoSub(teamTwo.substitute || undefined);
    }
    closeLoading();
  }, [closeLoading, gameObj]);

  useEffect(() => {
    if (timeoutExpirationTime > 0) {
      openTimeout();
    } else {
      closeTimeout();
    }
  }, [closeTimeout, openTimeout, timeoutExpirationTime]);

  const gameState: GameState = {
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
    id: gameObj?.id ?? -1,
    servedFromLeft,
    notes: {
      get: notes,
      set: setNotes,
    },
    teamOne: {
      name: teamOneName,
      signed: {
        get: teamOneSigned,
        set: setTeamOneSigned,
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
      servedFromLeft: {
        get: teamOneServedLeft,
        set: setTeamOneServedLeft,
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
      name: teamTwoName,
      signed: {
        get: teamTwoSigned,
        set: setTeamTwoSigned,
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
      servedFromLeft: {
        get: teamTwoServedLeft,
        set: setTeamTwoServedLeft,
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

  const timeoutKids = (
    <>
      <Title style={{ color: timeoutExpirationTime > currentTime ? '' : 'red' }} order={2}>
        {(Math.floor((timeoutExpirationTime - currentTime) / 100) / 10).toFixed(1)} Seconds
      </Title>
      <br />
      <br />
      <Button size="lg" onClick={() => endTimeout(gameState)}>
        End Timeout
      </Button>
    </>
  );
  const loginProps = (
    <>
      To use this page you must be logged in
      <br />
      <br />
      <Link href="/login">
        <Button size="lg">To Login page</Button>
      </Link>
    </>
  );
  const warnAdminAboutEditing = (
    <>
      This game has been set to official, are you sure you want to edit it?
      <br />
      <br />
      <Button size="lg" onClick={iKnowWhatImDoing} color="orange">
        I know what I&apos;m doing!
      </Button>
    </>
  );
  const OfficialCantEdit = (
    <>
      This game has been set to official, only an admin can edit it!
      <br />
      <br />
      <Link href={`/games/${game}`}>
        <Button size="lg">To Game page</Button>
      </Link>
    </>
  );
  return (
    <Box style={{ width: '100%', height: '100vh' }}>
      <LoadingOverlay
        visible={visibleLoading && isLoggedIn}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'pink', type: 'bars' }}
      />
      <LoadingOverlay visible={visibleTimeout} loaderProps={{ children: timeoutKids }} />
      <LoadingOverlay
        overlayProps={{
          color: '#222',
          blur: 15,
        }}
        visible={!isOfficial || (gameObj?.status === 'Official' && editOfficialGame)}
        loaderProps={{
          children:
            gameObj?.status === 'Official'
              ? isUmpireManager
                ? warnAdminAboutEditing
                : OfficialCantEdit
              : loginProps,
        }}
      />
      <Box style={{ width: '100%', height: '40%' }}>
        {(gameState.teamOneIGA.get ? teamOneLeft && teamOneRight : teamTwoLeft && teamTwoRight) ? (
          <>
            <Box style={{ width: '50%', height: '90%', float: 'left' }}>
              <PlayerButton game={gameState} firstTeam={true} leftSide={false}></PlayerButton>
            </Box>
            <Box style={{ width: '50%', height: '90%', float: 'right' }}>
              <PlayerButton game={gameState} leftSide={true} firstTeam={true}></PlayerButton>
            </Box>
          </>
        ) : (
          <Box style={{ width: '100%', height: '90%', float: 'left' }}>
            <PlayerButton game={gameState} firstTeam={true} leftSide={true}></PlayerButton>
          </Box>
        )}

        <Box style={{ width: '100%', height: '10%', float: 'right' }}>
          <TeamButton firstTeam={true} game={gameState}></TeamButton>
        </Box>
      </Box>
      <Box
        style={{
          width: '100%',
          height: '20%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          style={{
            display: 'flex',
            flex: 'auto',
            alignContent: 'center',
            justifyContent: 'center',
            width: 'fit-content',
          }}
        >
          <Button size="lg" onClick={() => sync(gameState)}>
            Sync
          </Button>
        </Box>
        <Box
          style={{
            margin: '0px auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flex: '5',
          }}
        >
          <GameScore game={gameState}></GameScore>
        </Box>

        <Box
          style={{
            display: 'flex',
            flex: 'auto',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            size="lg"
            color={started ? 'blue' : 'red'}
            onClick={() => {
              if (started) {
                undo(gameState);
              } else {
                del(gameState);
              }
            }}
          >
            {started ? 'Undo' : 'Delete'}
          </Button>
        </Box>
      </Box>
      <Box style={{ width: '100%', height: '40%' }}>
        <Box style={{ width: '100%', height: '10%', float: 'right' }}>
          <TeamButton firstTeam={false} game={gameState}></TeamButton>
        </Box>
        {(gameState.teamOneIGA.get ? teamTwoLeft && teamTwoRight : teamOneLeft && teamOneRight) ? (
          <>
            <Box style={{ width: '50%', height: '90%', float: 'left' }}>
              <PlayerButton game={gameState} leftSide={true} firstTeam={false}></PlayerButton>
            </Box>
            <Box style={{ width: '50%', height: '90%', float: 'right' }}>
              <PlayerButton game={gameState} firstTeam={false} leftSide={false}></PlayerButton>
            </Box>
          </>
        ) : (
          <Box style={{ width: '100%', height: '90%', float: 'left' }}>
            <PlayerButton game={gameState} leftSide={true} firstTeam={false}></PlayerButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
