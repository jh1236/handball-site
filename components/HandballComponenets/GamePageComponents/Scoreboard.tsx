'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Box, Center, LoadingOverlay, RingProgress, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { addGameEventToGame } from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { setGameState, TeamState, useGameState } from '@/components/HandballComponenets/GameState';
import { EventMessage, Message, UpdateMessage } from '@/ServerActions/SocketTypes';
import { PersonStructure } from '@/ServerActions/types';

interface ScoreboardProps {
  gameID: number;
}

export function Scoreboard({ gameID }: ScoreboardProps) {
  const gameState = useGameState();
  const [teamOneColor, setTeamOneColor] = useState<number[] | undefined>();
  const [teamTwoColor, setTeamTwoColor] = useState<number[] | undefined>();
  const [teamOneImage, setTeamOneImage] = useState<string | undefined>();
  const [teamTwoImage, setTeamTwoImage] = useState<string | undefined>();
  const [time, setTime] = useState<number>(0); //holds length if game is finished, or else start time
  const [court, setCourt] = useState<number>(0);
  const [official, setOfficial] = useState<string>();
  const teamOne = useMemo(
    () => (gameState?.teamOneIGA.get ? gameState?.teamOne : gameState?.teamTwo),
    [gameState?.teamOne, gameState?.teamOneIGA.get, gameState?.teamTwo]
  );
  const teamTwo = useMemo(
    () => (gameState?.teamOneIGA.get ? gameState?.teamTwo : gameState?.teamOne),
    [gameState?.teamOne, gameState?.teamOneIGA.get, gameState?.teamTwo]
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [isTimeoutOpen, { open: openTimeout, close: closeTimeout }] = useDisclosure(false);
  const WS_URL = `wss://api.squarers.club/api/scoreboard?gameId=${gameID}`;
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 2 * 60 * 1000, //2 minutes
      interval: 25 * 1000, //25 seconds
    },
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage('update');
    }
  }, [readyState, sendMessage]);
  useEffect(() => {
    const message = lastJsonMessage as Message;
    if (message?.type === 'update') {
      const gameUpdate = (lastJsonMessage as UpdateMessage).game;
      setGameState(gameUpdate, gameState);
      setTeamOneColor(gameUpdate.teamOne.teamColorAsRGBABecauseDigbyIsLazy || undefined);
      setTeamTwoColor(gameUpdate.teamTwo.teamColorAsRGBABecauseDigbyIsLazy || undefined);
      setTeamOneImage(gameUpdate.teamOne.bigImageUrl ?? gameUpdate.teamOne.imageUrl);
      setTeamTwoImage(gameUpdate.teamTwo.bigImageUrl ?? gameUpdate.teamTwo.imageUrl);
      if (gameUpdate.ended) {
        setTime(gameUpdate.length);
      } else {
        setTime(gameUpdate.startTime);
      }
      setOfficial(gameUpdate.official.name);
      setCourt(gameUpdate.court);
      if (gameUpdate.timeoutExpirationTime > 0) {
        openTimeout();
      } else {
        closeTimeout();
      }
    } else if (message?.type === 'event') {
      const { event } = lastJsonMessage as EventMessage;
      addGameEventToGame(gameState, event);
      if (event.eventType === 'End Game') {
        setTime(currentTime - time);
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeTimeout, lastJsonMessage, openTimeout]);

  if (!gameState.id) {
    return <>Loading...</>;
  }

  function generateBackground(): any {
    const team1Col = teamOneColor ?? '50,50,125,255';
    const team2Col = teamTwoColor ?? '50,50,125,255';
    return {
      background: `
      linear-gradient(90deg, rgba(${team1Col}) 0%, rgba(0,0,0,0) 60%), 
      linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(${team2Col}) 100%), 
      url(${teamOneImage}), 
      url(${teamTwoImage})`,
      backgroundPosition: '0 0, 0 0, -10vw center, 60vw center',
      backgroundSize: 'cover, cover, 50vw auto, 50vw auto',
      backgroundRepeat: 'no-repeat',
    };
  }

  function createNamePlate(team: TeamState, side: 'left' | 'right' | 'sub') {
    const p: PersonStructure | undefined = team[side].get;
    if (!p) {
      return <p> error: player not found</p>;
    }
    if (!gameState) {
      return <p>error</p>;
    }
    const serving =
      gameState.firstTeamServes.get === gameState.teamOneIGA.get
        ? team.name.get === teamOne?.name.get &&
          side === (gameState.servingFromLeft ? 'left' : 'right')
        : team.name.get === teamTwo?.name.get &&
          side === (gameState.servingFromLeft ? 'left' : 'right');

    let name: React.JSX.Element = <>{p.name}</>;

    if (serving && gameState.faulted.get) {
      name = <i>{name}*</i>;
    }

    name =
      team.name.get === teamOne?.name.get ? (
        <>
          [{side === 'left' ? 'L' : 'R'}] {name}
        </>
      ) : (
        <>
          {name} [{side === 'left' ? 'L' : 'R'}]
        </>
      );

    return (
      <Text
        fz="5vh"
        fw={serving ? 'bold' : ''}
        td={p.cardTimeRemaining === 0 ? '' : 'line-through'}
      >
        {name}
      </Text>
    );
  }

  //TODO: Digby make this look nice please :3
  const startKids = (
    <>
      <Text ta="center" fz="20vh" fw="semi-bold">
        Waiting for start.{currentTime % 2100 > 700 && '.'}
        {currentTime % 2100 > 1400 && '.'}
      </Text>
    </>
  );
  const timeoutKids = (
    <Stack>
      <RingProgress
        size={1000}
        thickness={80}
        rootColor="red"
        label={
          <Title
            ta="center"
            style={{
              color:
                gameState.timeoutExpirationTime.get > currentTime || currentTime % 1000 <= 500
                  ? ''
                  : 'red',
            }}
            fz={150}
            order={1}
          >
            {Math.max(
              Math.floor((gameState.timeoutExpirationTime.get - currentTime) / 100) / 10,
              0
            ).toFixed(1)}{' '}
            Seconds
          </Title>
        }
        sections={[
          {
            value:
              gameState.timeoutExpirationTime.get > currentTime
                ? 100 - (gameState.timeoutExpirationTime.get - currentTime) / 300
                : currentTime % 1000 > 500
                  ? 100
                  : 0,
            color: 'gray',
          },
        ]}
      ></RingProgress>
    </Stack>
  );

  if (!teamOneImage) {
    return 'Loading...';
  }

  return (
    <Box style={generateBackground()} h="100vh" w="100vw">
      <LoadingOverlay
        visible={!gameState.started.get || isTimeoutOpen}
        loaderProps={{ children: gameState.started.get ? timeoutKids : startKids }}
        overlayProps={{
          radius: 'sm',
          blur: gameState.started.get ? 10 : 1,
        }}
      />
      <Box w="100vw" pos="absolute" top="25px">
        <Center component={Title} fz={40}>
          {teamOne?.extendedName} vs {teamTwo?.extendedName}
        </Center>
      </Box>
      <Box mt="auto">
        {gameState.started.get && (
          <>
            <Box pos="absolute" left="15%">
              <Text fz="50vh" fw="semi-bold">
                {gameState.teamOneIGA.get
                  ? gameState.teamOne.score.get
                  : gameState.teamTwo.score.get}
              </Text>
            </Box>
            <Box pos="absolute" right="15%">
              <Text fz="50vh" fw="semi-bold">
                {gameState.teamOneIGA.get
                  ? gameState.teamTwo.score.get
                  : gameState.teamOne.score.get}
              </Text>
            </Box>
          </>
        )}
        <Box pos="absolute" left="10%" bottom="10%">
          {createNamePlate(teamOne!, 'right')}
          {createNamePlate(teamOne!, 'left')}
        </Box>
        <Box pos="absolute" right="10%" bottom="10%" style={{ textAlign: 'right' }}>
          {createNamePlate(teamTwo!, 'right')}
          {createNamePlate(teamTwo!, 'left')}
        </Box>
        <Box pos="absolute" bottom={20} w="100%">
          <Text ta="center" fz={20}>
            Court : {court + 1}
          </Text>
          <Text ta="center" fz={20}>
            Official: {official}
          </Text>
          <Text ta="center" fz={20}>
            Time Elapsed:{' '}
            {gameState.ended.get
              ? new Date(Math.floor(time * 1000)).toISOString().slice(14, 19)
              : new Date(Math.floor(currentTime - time * 1000)).toISOString().slice(14, 19)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
