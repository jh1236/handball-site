'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Center,
  Grid,
  Image,
  LoadingOverlay,
  luminance,
  Portal,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { customTournamentScoreboardEffects } from '@/components/HandballComponenets/GamePageComponents/CustomTournamentScoreboardEffects';
import { getChangeCode, getGame, getNextGameId } from '@/ServerActions/GameActions';
import { GameStructure, GameTeamStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

interface ScoreboardProps {
  gameID: number;
}

function cardColorFromDuration(duration: number) {
  if (duration < 0) return 'red';
  if (duration === 2) return 'green';
  return 'orange';
}

export function Scoreboard({ gameID }: ScoreboardProps) {
  const [game, setGame] = React.useState<GameStructure>();
  const [prevGame, setPrevGame] = React.useState<GameStructure>();
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [lastCheck, setLastCheck] = React.useState<number>(0);
  const [isTimeoutOpen, { open: openTimeout, close: closeTimeout }] = useDisclosure(false);
  const urlSearchParams = useSearchParams();
  const router = useRouter();
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
        router.refresh();
      }
    });
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
          router.push(`/games/${nextGameId}/scoreboard?prev=${gameID}`);
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
        if (game !== undefined && code !== game.changeCode) {
          reloadGame();
        }
      });
    }
  }, [currentTime, game, gameID, lastCheck]);

  if (!game) {
    return <>Loading...</>;
  }

  function generateBackground(
    teamOneIn: GameTeamStructure | undefined,
    teamTwoIn: GameTeamStructure | undefined
  ): any {
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
    Left: PlayerGameStatsStructure | undefined;
    Right: PlayerGameStatsStructure | undefined;
    Sub: PlayerGameStatsStructure | undefined;
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
    // I know these violate the naming conventions, but this is how they are received in sideToServe and sideOfCourt from the backend
    return {
      Left: left,
      Right: right,
      Sub: sub,
    };
  }

  function createNamePlate(team: GameTeamStructure, side: 'Left' | 'Right' | 'Sub') {
    const sides = getSides(team);
    const servingSidePlayer = sides[game?.sideToServe ?? 'Left']!;
    let p: PlayerGameStatsStructure | undefined = sides[side];
    if (servingSidePlayer.cardTimeRemaining !== 0) {
      if (side === 'Left') p = sides.Right;
      else if (side === 'Right') p = sides.Left;
    }

    if (!p) {
      return <p> error: player not found</p>;
    }
    if (!game) {
      return <p>error</p>;
    }
    const serving =
      game.firstTeamToServe === game.firstTeamIga
        ? team.name === teamOne?.name && side === game.sideToServe
        : team.name === teamTwo?.name && side === game.sideToServe;

    let name: React.JSX.Element = <>{p.name}</>;

    if (serving && game.faulted) {
      name = <i>{name}*</i>;
    }
    const newColor = [...(team.teamColorAsRGBABecauseDigbyIsLazy ?? [0.7, 0.7, 0.7, 1.0])].map(
      (a) => a * 0.7
    );
    newColor[3] = 0.7;
    const cardPercent = p.cardTimeRemaining / p.cardTime;
    let background: string;
    if (p.cardTimeRemaining !== 0) {
      if (team === teamOne) {
        background = `linear-gradient(90deg, ${cardColorFromDuration(p.cardTime)} ${75 * cardPercent}%, rgba(0,0,0,0) ${100 * cardPercent}%)`;
      } else {
        background = `linear-gradient(90deg, rgba(0,0,0,0) ${100 - 100 * cardPercent}%, ${cardColorFromDuration(p.cardTime)} ${100 - 75 * cardPercent}%)`;
      }
    } else if (team === teamOne) {
      background = `linear-gradient(90deg, rgba(${newColor}) 0%, rgba(0,0,0,0) 100%)`;
    } else {
      background = `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(${newColor}) 100%)`;
    }
    name =
      team === teamOne ? (
        <div
          style={{
            textAlign: 'left',
            display: 'inline-block',
            width: '100%',
            margin: 10,
            position: 'relative',
            minWidth: 600,
            background,
            color: team.teamColor && luminance(team.teamColor) < 0.5 ? 'white' : 'black',
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
          />
          {p.cardTimeRemaining !== 0 && (
            <Image
              pos="absolute"
              top={0}
              left={0}
              style={{
                width: 120,
                verticalAlign: 'middle',
                margin: 10,
                marginRight: 20,
                clipPath: `polygon(100% 0%, 100% 100%,${cardPercent} 100%,${cardPercent} 0%`,
              }}
              src="https://static.vecteezy.com/system/resources/previews/027/391/874/non_2x/red-cross-checkmark-isolated-on-a-transparent-background-free-png.png"
            ></Image>
          )}
          [{p.cardTimeRemaining ? '-' : side[0]}] {name}
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
            color: team.teamColor && luminance(team.teamColor) < 0.5 ? 'white' : 'black',
          }}
        >
          {name} [{p.cardTimeRemaining ? '-' : side[0]}]
          <Image
            src={p.imageUrl}
            style={{
              margin: 10,
              width: 120,
              marginLeft: 20,
              clipPath: `polygon(100% 0%, 100% 100%,${cardPercent} 100%,${cardPercent} 0%`,
              verticalAlign: 'middle',
            }}
            display="inline-block"
          />
          {p.cardTimeRemaining !== 0 && (
            <Image
              pos="absolute"
              top={0}
              right={0}
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
          {teamOne?.extendedName} vs {teamTwo?.extendedName}
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
          {createNamePlate(teamOne!, 'Right')}
          {createNamePlate(teamOne!, 'Left')}
        </Box>
        <Box pos="absolute" right="10%" bottom="10%" style={{ textAlign: 'right' }}>
          {createNamePlate(teamTwo!, 'Right')}
          {createNamePlate(teamTwo!, 'Left')}
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
