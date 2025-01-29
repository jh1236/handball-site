'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Box, Button, LoadingOverlay, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  begin,
  del,
  endTimeout,
  GameState,
  sync,
  undo,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { PlayerButton } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton';
import { TeamButton } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import { loggedIn } from '@/components/HandballComponenets/ServerActions';
import { getGame } from '@/ServerActions/GameActions';
import { GameStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

let setGameFn: (game: GameStructure) => void;
export let startLoading: () => void;

export function reloadGame(gameID: number) {
  getGame({ gameID, includeStats: true }).then((gameIn) => {
    setGameFn(gameIn);
  });
}

export function EditGame({ game }: { game: number }) {
  const [gameObj, setGameObj] = React.useState<GameStructure | null>(null);
  setGameFn = setGameObj;
  const [visibleLoading, { open: openLoading, close: closeLoading }] = useDisclosure(false);
  startLoading = openLoading;
  const [visibleTimeout, { open: openTimeout, close: closeTimeout }] = useDisclosure(false);
  const [rounds, setRounds] = React.useState<number>(0);
  const [faulted, setFaulted] = React.useState<boolean>(false);
  const [started, setStarted] = React.useState<boolean>(true);
  const [firstTeamServes, setFirstTeamServes] = React.useState<boolean>(false);
  const [timeoutExpirationTime, setTimeoutExpirationTime] = React.useState<number>(-1);
  const [currentTime, setCurrentTime] = React.useState<number>(300);
  const [teamOneTimeouts, setTeamOneTimeouts] = React.useState<number>(0);
  const [teamOneServedLeft, setTeamOneServedLeft] = React.useState<boolean>(true);
  const [teamOneIGA, setTeamOneIGA] = React.useState<boolean>(true);
  const [teamOneName, setTeamOneName] = React.useState<string>('Loading...');
  const [teamTwoName, setTeamTwoName] = React.useState<string>('Loading...');
  const [teamOneScore, setTeamOneScore] = React.useState<number>(0);
  const [teamOneLeft, setTeamOneLeft] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamOneRight, setTeamOneRight] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamOneSub, setTeamOneSub] = React.useState<PlayerGameStatsStructure | undefined>(
    undefined
  );
  const [teamTwoTimeouts, setTeamTwoTimeouts] = React.useState<number>(0);
  const [teamTwoServedLeft, setTeamTwoServedLeft] = React.useState<boolean>(true);
  const [teamTwoScore, setTeamTwoScore] = React.useState<number>(0);
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
    reloadGame(game);
  }, [game]);

  useEffect(() => {
    if (!gameObj) return;
    setFirstTeamServes(gameObj.firstTeamToServe);
    setRounds(gameObj.teamOneScore + gameObj.teamTwoScore);
    setFaulted(gameObj.faulted);
    setTeamOneIGA(gameObj.firstTeamIga ?? true);
    setTimeoutExpirationTime(gameObj.timeoutExpirationTime);
    setStarted(gameObj.started);
    //Team Specific
    setTeamOneTimeouts(gameObj.teamOneTimeouts);
    setTeamOneScore(gameObj.teamOneScore);
    setTeamOneServedLeft(gameObj.teamOne.servedFromLeft! !== gameObj.firstTeamToServe);
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
      setTeamOneLeft(teamOne.captain);
      setTeamOneRight(teamOne.nonCaptain);
      setTeamOneSub(teamOne.substitute);
    }
    setTeamOneName(gameObj.teamOne.name);
    setTeamTwoName(gameObj.teamTwo.name);
    setTeamTwoTimeouts(gameObj.teamTwoTimeouts);
    setTeamTwoScore(gameObj.teamTwoScore);
    setTeamTwoServedLeft(gameObj.teamTwo.servedFromLeft! === gameObj.firstTeamToServe);
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
      setTeamTwoRight(teamTwo.nonCaptain);
      setTeamTwoSub(teamTwo.substitute);
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
    firstTeamServes: {
      get: firstTeamServes,
      set: setFirstTeamServes,
    },
    faulted: {
      get: faulted,
      set: setFaulted,
    },
    id: gameObj?.id ?? -1,
    rounds: {
      get: rounds,
      set: setRounds,
    },
    servedFromLeft,
    teamOne: {
      name: teamOneName,
      score: {
        get: teamOneScore,
        set: setTeamOneScore,
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
      score: {
        get: teamTwoScore,
        set: setTeamTwoScore,
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
      <Title style={{ color: timeoutExpirationTime > currentTime ? 'white' : 'red' }} order={2}>
        {(Math.floor(Math.max(timeoutExpirationTime - currentTime, 0) / 100) / 10).toFixed(1)}{' '}
        Seconds
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
  return (
    <Box style={{ width: '100%', height: '100vh' }}>
      <LoadingOverlay
        visible={visibleLoading && loggedIn()}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'pink', type: 'bars' }}
      />
      <LoadingOverlay visible={visibleTimeout} loaderProps={{ children: timeoutKids }} />
      <LoadingOverlay visible={!loggedIn()} loaderProps={{ children: loginProps }} />
      <Box style={{ width: '100%', height: '40%' }}>
        <Box style={{ width: '50%', height: '90%', float: 'left' }}>
          <PlayerButton game={gameState} firstTeam={true} leftSide={false}></PlayerButton>
        </Box>
        <Box style={{ width: '50%', height: '90%', float: 'right' }}>
          <PlayerButton game={gameState} leftSide={true} firstTeam={true}></PlayerButton>
        </Box>
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
          {gameState.started.get ? (
            <>
              <Title order={1}>{gameState.teamOne.score.get}</Title>
              <Title order={1}>-</Title>
              <Title order={1}>{teamTwoScore}</Title>
            </>
          ) : (
            <Button size="lg" onClick={() => begin(gameState)}>
              Start
            </Button>
          )}
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
        <Box style={{ width: '50%', height: '90%', float: 'left' }}>
          <PlayerButton game={gameState} leftSide={true} firstTeam={false}></PlayerButton>
        </Box>
        <Box style={{ width: '50%', height: '90%', float: 'right' }}>
          <PlayerButton game={gameState} firstTeam={false} leftSide={false}></PlayerButton>
        </Box>
      </Box>
    </Box>
  );
}
