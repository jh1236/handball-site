'use client';

import React, { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { Box, Button, Text, Title } from '@mantine/core';
import {
  GameState,
  sync,
  undo,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { PlayerButton } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton';
import { tokenFetcher } from '@/components/HandballComponenets/ServerActions';
import {
  GameStructure,
  PlayerGameStatsStructure,
} from '@/components/HandballComponenets/StatsComponents/types';

export function getUrlForID(id: number) {
  return `/api/games/${id}?includePlayerStats=true`;
}

export function EditGame({ game }: { game: number }) {
  const url = getUrlForID(game);
  const { data, error, isLoading } = useSWR<{ game: GameStructure }>(url, tokenFetcher);
  const [gameObj, setGameObj] = React.useState<GameStructure | null>(null);
  const [rounds, setRounds] = React.useState<number>(0);
  const [faulted, setFaulted] = React.useState<boolean>(false);
  const [firstTeamServes, setFirstTeamServes] = React.useState<boolean>(false);
  const [teamOneTimeouts, setTeamOneTimeouts] = React.useState<number>(0);
  const [teamOneServedLeft, setTeamOneServedLeft] = React.useState<boolean>(true);
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
    if (!data) return;
    console.log(data.game);
    setGameObj(data.game);
    setFirstTeamServes(data.game.firstTeamToServe);
    setRounds(data.game.teamOneScore + data.game.teamTwoScore);
    setFaulted(data.game.faulted);
    //Team Specific
    setTeamOneTimeouts(data.game.teamOneTimeouts);
    setTeamOneScore(data.game.teamOneScore);
    setTeamOneServedLeft(data.game.teamOne.servedFromLeft! !== data.game.firstTeamToServe);
    const { teamOne } = data.game;
    for (const i of [teamOne.captain, teamOne.nonCaptain, teamOne.substitute]) {
      if (i?.sideOfCourt === 'Left') {
        setTeamOneLeft(i);
      }
      if (i?.sideOfCourt === 'Right') {
        setTeamOneRight(i);
      }
      if (i?.sideOfCourt === 'Substitute') {
        setTeamOneSub(i);
      }
    }
    setTeamTwoTimeouts(data.game.teamTwoTimeouts);
    setTeamTwoScore(data.game.teamTwoScore);
    setTeamTwoServedLeft(data.game.teamTwo.servedFromLeft! === data.game.firstTeamToServe);
    const { teamTwo } = data.game;
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
  }, [data]);
  if (error || isLoading) {
    return `Error: ${error}`;
  }
  const gameState: GameState = {
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
  return (
    <Box style={{ width: '100%', height: '100vh' }}>
      <Box style={{ width: '100%', height: '40%' }}>
        <Box style={{ width: '50%', height: '100%', float: 'left' }}>
          <PlayerButton game={gameState} firstTeam={true} leftSide={false}></PlayerButton>
        </Box>
        <Box style={{ width: '50%', height: '100%', float: 'right' }}>
          <PlayerButton game={gameState} leftSide={true} firstTeam={true}></PlayerButton>
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
          <Text size="lg">
            {gameObj?.teamOne.name}
          </Text>
          <Title order={1}>{gameState.teamOne.score.get}</Title>
          <Title order={1}>-</Title>
          <Title order={1}>{teamTwoScore}</Title>
          <Text size="lg">
            {gameObj?.teamTwo.name}
          </Text>
        </Box>

        <Box
          style={{
            display: 'flex',
            flex: 'auto',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Button size="lg" onClick={() => undo(gameState)}>
            Undo
          </Button>
        </Box>
      </Box>
      <Box style={{ width: '100%', height: '40%' }}>
        <Box style={{ width: '50%', height: '100%', float: 'left' }}>
          <PlayerButton game={gameState} leftSide={true} firstTeam={false}></PlayerButton>
        </Box>
        <Box style={{ width: '50%', height: '100%', float: 'right' }}>
          <PlayerButton game={gameState} firstTeam={false} leftSide={false}></PlayerButton>
        </Box>
      </Box>
    </Box>
  );
}
