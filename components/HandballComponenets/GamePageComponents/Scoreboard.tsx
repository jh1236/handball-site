'use client';

import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Center,
  Grid,
  Image,
  LoadingOverlay,
  Portal,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getChangeCode, getGame, getNextGameId } from '@/ServerActions/GameActions';
import {
  GameEventStructure,
  GameStructure,
  GameTeamStructure,
  PersonStructure,
  PlayerGameStatsStructure,
} from '@/ServerActions/types';
import {
  customTournamentScoreboardEffects
} from '@/components/HandballComponenets/GamePageComponents/CustomTournamentScoreboardEffects';

interface ScoreboardProps {
  gameID: number;
}

export function Scoreboard({ gameID }: ScoreboardProps) {
  const [game, setGame] = React.useState<GameStructure>();
  const [prevGame, setPrevGame] = React.useState<GameStructure>();
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [lastCheck, setLastCheck] = React.useState<number>(0);
  const [isTimeoutOpen, { open: openTimeout, close: closeTimeout }] = useDisclosure(false);
  const urlSearchParams = useSearchParams();
  let coolEffect: React.JSX.Element | null = null;

  const teamOne = useMemo(() => (game?.firstTeamIga ? game?.teamOne : game?.teamTwo), [game]);
  const teamTwo = useMemo(() => (game?.firstTeamIga ? game?.teamTwo : game?.teamOne), [game]);
  function reloadGame() {
    getGame({
      gameID,
      includeGameEvents: true,
    }).then((g) => {
      const prev = game;
      setGame(g);
      if (g.timeoutExpirationTime > 0) {
        openTimeout();
      } else {
        closeTimeout();
      }
      if (prev && prev.firstTeamIga !== g.firstTeamIga) {
        //BUG: WHAT THE FUCK IS GOING ON!!!! The bg images REFUSE to co-operate without a forced reload if the side changes 😭😭😭😭
        location.reload();
      }
    });
    coolEffect = customTournamentScoreboardEffects(game);
  }

  //
  useEffect(() => {
    reloadGame();
  }, [gameID]);

  useEffect(() => {
    const prev = urlSearchParams.get('prev');
    if (prev) {
      getGame({
        gameID: +prev,
      }).then((g) => {
        setPrevGame(g);
      });
    }
    if (game && game.ended) {
      getNextGameId(gameID).then((nextGameId) => {
        if (nextGameId > 0) {
          location.href = `/games/${nextGameId}/scoreboard?prev=${gameID}`;
        }
      });
    }
  }, [urlSearchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    //this will run every time currentTime is updated (10 times a second)
    if (lastCheck + 500 < currentTime) {
      setLastCheck(currentTime);
      getChangeCode(gameID).then((code) => {
        if (game && code !== game.changeCode) {
          reloadGame();
        }
      });
    }
  }, [currentTime]);

  if (!game) {
    return <>Loading...</>;
  }

  function generateBackground(teamOneIn, teamTwoIn): any {
    const team1Col = teamOneIn?.teamColorAsRGBABecauseDigbyIsLazy?.toString() ?? '50,50,125,255';
    const team2Col = teamTwoIn?.teamColorAsRGBABecauseDigbyIsLazy?.toString() ?? '50,50,125,255';
    const imgURL1 = teamOneIn?.bigImageUrl ?? teamOneIn?.imageUrl;
    const imgURL2 = teamTwoIn?.bigImageUrl ?? teamTwoIn?.imageUrl;
    return {
      background: `
      linear-gradient(90deg, rgba(${team1Col}) 0%, rgba(0,0,0,0) 60%), 
      linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(${team2Col}) 100%), 
      url(${imgURL1}), 
      url(${imgURL2})`,
      backgroundPosition: '0 0, 0 0, -10vw center, 60vw center',
      backgroundSize: 'cover, cover, 50vw auto, 50vw auto',
      backgroundRepeat: 'no-repeat',
    };
  }

  function getSides(team: GameTeamStructure): {
    left: PlayerGameStatsStructure | undefined;
    right: PlayerGameStatsStructure | undefined;
    sub: PlayerGameStatsStructure | undefined;
  } {
    let left: PlayerGameStatsStructure | undefined;
    let right: PlayerGameStatsStructure | undefined;
    let sub: PlayerGameStatsStructure | undefined;
    const players: PlayerGameStatsStructure[] = [
      team.captain,
      team.nonCaptain,
      team.substitute,
    ].filter((a) => a !== null);
    if (!game?.started) {
      [left, right, sub] = players;
    } else if (players.length === 1) {
      if (game?.sideToServe === 'Left') {
        [left] = players;
      } else {
        [right] = players;
      }
    } else {
      for (const p of players) {
        if (!p) {
          //
        } else if (p.sideOfCourt === 'Left') {
          left = p;
        } else if (p.sideOfCourt === 'Right') {
          right = p;
        } else if (p.sideOfCourt === 'Substitute') {
          sub = p;
        }
      }
    }

    return {
      left,
      right,
      sub,
    };
  }

  function createNamePlate(team: GameTeamStructure, side: 'left' | 'right' | 'sub') {
    const p: PersonStructure | undefined = getSides(team)[side];
    if (!p) {
      return <p> error: player not found</p>;
    }
    if (!game) {
      return <p>error</p>;
    }
    const serving =
      game.firstTeamToServe === game.firstTeamIga
        ? team.name === teamOne?.name && side === game.sideToServe.toLowerCase()
        : team.name === teamTwo?.name && side === game.sideToServe.toLowerCase();

    let name: React.JSX.Element = <>{p.name}</>;

    if (serving && game.faulted) {
      name = <i>{name}*</i>;
    }

    name =
      team === teamOne ? (
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
      {prevGame && (
        <Portal>
          <Center>
            <Box
              w="800"
              pos="absolute"
              top="0"
              style={{
                zIndex: 999,
                backgroundColor: 'black',
              }}
            >
              <Center>
                <Title>Previous Game:</Title>
              </Center>
              <Grid ta="center" justify="center" columns={16} gutter="sm">
                <Grid.Col span={7}>
                  <Title order={2}>{prevGame.teamOne.name}</Title>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Title order={2}>vs</Title>
                </Grid.Col>
                <Grid.Col span={7}>
                  <Title order={2}>{prevGame.teamTwo.name}</Title>
                </Grid.Col>
                <Grid.Col span={7}>
                  <Image src={prevGame.teamOne.imageUrl} w={200} display="inline" />
                </Grid.Col>
                <Grid.Col span={1}></Grid.Col>
                <Grid.Col span={7}>
                  <Image src={prevGame.teamTwo.imageUrl} w={200} display="inline" />
                </Grid.Col>
                <Grid.Col span={7}>
                  <Title order={2} fz={50}>
                    {prevGame.teamOneScore}
                  </Title>
                </Grid.Col>
                <Grid.Col span={1}></Grid.Col>
                <Grid.Col span={7}>
                  <Title order={2} fz={50}>
                    {prevGame.teamTwoScore}
                  </Title>
                </Grid.Col>
              </Grid>
            </Box>
          </Center>
        </Portal>
      )}
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
                game.timeoutExpirationTime > currentTime || currentTime % 1000 <= 500 ? '' : 'red',
            }}
            fz={150}
            order={1}
          >
            {Math.max(Math.floor((game.timeoutExpirationTime - currentTime) / 100) / 10, 0).toFixed(
              1
            )}{' '}
            Seconds
          </Title>
        }
        sections={[
          {
            value:
              game.timeoutExpirationTime > currentTime
                ? 100 - (game.timeoutExpirationTime - currentTime) / 300
                : currentTime % 1000 > 500
                  ? 100
                  : 0,
            color: 'gray',
          },
        ]}
      ></RingProgress>
    </Stack>
  );

  return (
    <Box style={generateBackground(teamOne, teamTwo)} h="100vh" w="100vw">
      <p>{game.events.map(e => e.notes)}</p>
      <LoadingOverlay
        visible={!game.started || isTimeoutOpen}
        loaderProps={{ children: game.started ? timeoutKids : startKids }}
        overlayProps={{
          radius: 'sm',
          blur: game.started ? 10 : 1,
        }}
      />
      <Box w="100vw" pos="absolute" top="25px">
        <Center component={Title} fz={40}>
          {teamOne?.name} vs {teamTwo?.name}
        </Center>
      </Box>
      <Box mt="auto">
        {game.started && (
          <>
            <Box pos="absolute" left="15%">
              <Text fz="50vh" fw="semi-bold">
                {game.firstTeamIga ? game.teamOneScore : game.teamTwoScore}
              </Text>
            </Box>
            <Box pos="absolute" right="15%">
              <Text fz="50vh" fw="semi-bold">
                {game.firstTeamIga ? game.teamTwoScore : game.teamOneScore}
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
            Court : {game.court + 1}
          </Text>
          <Text ta="center" fz={20}>
            Official: {game.official.name}
          </Text>
          <Text ta="center" fz={20}>
            Time Elapsed:{' '}
            {game.ended
              ? new Date(Math.floor(game.length * 1000)).toISOString().slice(14, 19)
              : new Date(Math.floor(currentTime - game.startTime * 1000))
                  .toISOString()
                  .slice(14, 19)}
          </Text>
        </Box>
      </Box>
      {customTournamentScoreboardEffects(game)}
    </Box>
  );
}
