'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
  Box,
  Center,
  Image,
  LoadingOverlay,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { addGameEventToGame } from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { setGameState, TeamState, useGameState } from '@/components/HandballComponenets/GameState';
import { EventMessage, Message, UpdateMessage } from '@/ServerActions/SocketTypes';
import { GameEventStructure, PlayerGameStatsStructure } from '@/ServerActions/types';
import classes from './Scoreboard.module.css';

interface ScoreboardProps {
  gameID: number;
}

function cardColorFromPlayer(player: PlayerGameStatsStructure) {
  if (player.cardTime < 0) return 'red';
  if (player.cardTime === 2) return 'green';
  return 'orange';
}

function eventToClass(event: GameEventStructure) {
  switch (event.eventType) {
    case 'Score':
      if (event.notes === 'Ace') return classes.ace;
      return classes.score;
    default:
      return undefined;
  }
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
    const servingSidePlayer = gameState.servingFromLeft ? team.left.get : team.right.get;
    let p: PlayerGameStatsStructure | undefined = team[side].get;
    if (servingSidePlayer?.cardTimeRemaining !== 0) {
      if (side === 'left') p = team.right.get;
      else if (side === 'right') p = team.left.get;
    }

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
    const color = team.name.get === gameState.teamOne.name.get ? teamOneColor : teamTwoColor;
    const newColor = [...(color ?? [0.7, 0.7, 0.7, 1.0])].map((a) => a * 0.7);
    newColor[3] = 0.7;
    const cardPercent = p.cardTimeRemaining > 0 ? p.cardTimeRemaining / p.cardTime : 1;
    let background: string;
    if (p.cardTimeRemaining !== 0) {
      if (team === teamOne) {
        background = `linear-gradient(90deg, ${cardColorFromPlayer(p)} ${75 * cardPercent}%, rgba(0,0,0,0) ${100 * cardPercent}%)`;
      } else {
        background = `linear-gradient(90deg, rgba(0,0,0,0) ${100 - 100 * cardPercent}%, ${cardColorFromPlayer(p)} ${100 - 75 * cardPercent}%)`;
      }
    } else if (team === teamOne) {
      background = `linear-gradient(90deg, rgba(${newColor}) 0%, rgba(0,0,0,0) 70%)`;
    } else {
      background = `linear-gradient(90deg, rgba(0,0,0,0) 30%, rgba(${newColor}) 100%)`;
    }
    name =
      team.name.get === teamOne.name.get ? (
        <div
          style={{
            textAlign: 'left',
            display: 'inline-block',
            width: '100%',
            margin: 10,
            position: 'relative',
            minWidth: 600,
            background,
          }}
        >
          <Image
            src={p.imageUrl}
            style={{
              width: 120,
              verticalAlign: 'middle',
              margin: 10,
              marginRight: 20,
            }}
            display="inline-block"
            className={
              (lastJsonMessage as EventMessage)?.event?.player?.searchableName === p.searchableName
                ? eventToClass((lastJsonMessage as EventMessage)?.event)
                : undefined
            }
          />
          {p.cardTimeRemaining !== 0 && (
            <Image
              pos="absolute"
              top={0}
              left={0}
              className={classes.floating}
              style={{
                width: 120,
                verticalAlign: 'middle',
                margin: 10,
                marginRight: 20,
              }}
              src="https://static.vecteezy.com/system/resources/previews/027/391/874/non_2x/red-cross-checkmark-isolated-on-a-transparent-background-free-png.png"
            ></Image>
          )}
          [{p.cardTimeRemaining ? '-' : side[0].toUpperCase()}] {name}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'right',
            display: 'inline-block',
            minWidth: 600,
            width: '100%',
            margin: 10,
            position: 'relative',
            background,
          }}
        >
          {name} [{p.cardTimeRemaining ? '-' : side[0].toUpperCase()}]{' '}
          <Image
            src={p.imageUrl}
            style={{
              margin: 10,
              width: 120,
              marginLeft: 20,
              verticalAlign: 'middle',
            }}
            className={
              (lastJsonMessage as EventMessage)?.event?.player?.searchableName === p.searchableName
                ? eventToClass((lastJsonMessage as EventMessage)?.event)
                : undefined
            }
            display="inline-block"
          />
          {p.cardTimeRemaining !== 0 && (
            <Image
              pos="absolute"
              top={0}
              right={0}
              className={classes.floating}
              style={{
                width: 120,
                verticalAlign: 'middle',
                margin: 10,
                marginRight: 20,
              }}
              src="https://static.vecteezy.com/system/resources/previews/027/391/874/non_2x/red-cross-checkmark-isolated-on-a-transparent-background-free-png.png"
            ></Image>
          )}
        </div>
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
          {teamOne?.name.get} vs {teamTwo?.name.get}
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
