'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Center,
  createTheme,
  DEFAULT_THEME,
  Flex,
  LoadingOverlay,
  MantineProvider,
  Popover,
  Select,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  del,
  endTimeout,
  sync,
  undo,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { GameScore } from '@/components/HandballComponenets/GameEditingComponenets/GameScore/GameScore';
import { PlayerButton } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton/PlayerButton';
import { TeamButton } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton/TeamButton';
import { useGameState } from '@/components/HandballComponenets/GameState';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { useScreenVertical } from '@/components/hooks/useScreenVertical';
import { getGame } from '@/ServerActions/GameActions';
import { getOfficials } from '@/ServerActions/OfficialActions';
import { GameStructure, OfficialStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

let setGameFn: (game: GameStructure) => void;
//necessary to reveal the state from the React component
// eslint-disable-next-line import/no-mutable-exports
export let startLoading: () => void;

export function playersFromGame(game: GameStructure): PlayerGameStatsStructure[] {
  return [
    game.teamOne.captain,
    game.teamOne.nonCaptain,
    game.teamOne.substitute,
    game.teamTwo.captain,
    game.teamTwo.nonCaptain,
    game.teamTwo.substitute,
  ].filter((pgs) => pgs !== null && pgs !== undefined);
}

export function reloadGame(gameID: number) {
  getGame({ gameID }).then((gameIn) => {
    setGameFn(gameIn);
  });
}

export function EditGame({ game }: { game: number }) {
  const { isUmpireManager, isOfficial, loading } = useUserData();
  const [officials, setOfficials] = useState<OfficialStructure[]>([]);
  const [scorer, setScorer] = useState<OfficialStructure>();
  const [official, setOfficial] = useState<OfficialStructure>();

  const [gameObj, setGameObj] = React.useState<GameStructure | null>(null);
  setGameFn = setGameObj;
  const [visibleLoading, { open: openLoading, close: closeLoading }] = useDisclosure(false);
  const [editOfficialGame, { close: iKnowWhatImDoing }] = useDisclosure(true);
  startLoading = openLoading;
  const [visibleTimeout, { open: openTimeout, close: closeTimeout }] = useDisclosure(false);
  const [currentTime, setCurrentTime] = React.useState<number>(300);
  const { gameState, setGameForState } = useGameState(gameObj || undefined);

  const isVertical = useScreenVertical();

  //team one state

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getOfficials({}).then((o) => setOfficials(o.officials));
  }, []);

  useEffect(() => {
    reloadGame(game);
  }, [game]);

  useEffect(() => {
    if (!gameObj) return;
    setOfficial(gameObj?.official);
    setScorer(gameObj?.scorer ?? undefined);
    setGameForState(gameObj);
    closeLoading();
    //disabled as including setGameForState will cause an infinite reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeLoading, gameObj]);

  useEffect(() => {
    if (gameState.timeoutExpirationTime.get > 0) {
      openTimeout();
    } else {
      closeTimeout();
    }
  }, [closeTimeout, openTimeout, gameState.timeoutExpirationTime.get]);

  const timeoutKids = (
    <>
      <Title
        style={{ color: gameState.timeoutExpirationTime.get > currentTime ? '' : 'red' }}
        order={2}
      >
        {(Math.floor((gameState.timeoutExpirationTime.get - currentTime) / 100) / 10).toFixed(1)}{' '}
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

  const theme = useMemo(
    () =>
      createTheme({
        colors: {
          'serving-color': gameState.blitzGame.get
            ? DEFAULT_THEME.colors.green
            : DEFAULT_THEME.colors.teal,
          'player-color': gameState.blitzGame.get
            ? DEFAULT_THEME.colors.teal
            : DEFAULT_THEME.colors.blue,
          'libero-color': DEFAULT_THEME.colors.violet,
        },
      }),
    [gameState.blitzGame.get]
  );

  return (
    <MantineProvider theme={theme}>
      <Box style={{ width: '100%', height: '100lvh' }}>
        <LoadingOverlay
          visible={visibleLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        <LoadingOverlay visible={visibleTimeout} loaderProps={{ children: timeoutKids }} />
        <LoadingOverlay
          overlayProps={{
            color: '#222',
            blur: 15,
          }}
          visible={
            !loading &&
            (!isOfficial(gameObj?.tournament.searchableName) ||
              (gameObj?.status === 'Official' && editOfficialGame))
          }
          loaderProps={{
            children:
              gameObj?.status === 'Official'
                ? isUmpireManager(gameObj.tournament.searchableName)
                  ? warnAdminAboutEditing
                  : OfficialCantEdit
                : loginProps,
          }}
        />

        <Flex direction={isVertical ? 'column' : 'row'} h="100lvh">
          <Flex direction={isVertical ? 'row' : 'column-reverse'} flex={4}>
            {(
              gameState.teamOneIGA.get
                ? gameState.teamOne.right.get && gameState.teamOne.left.get
                : gameState.teamTwo.right.get && gameState.teamTwo.left.get
            ) ? (
              <>
                <Box flex={1}>
                  <PlayerButton game={gameState} firstTeam={true} leftSide={false}></PlayerButton>
                </Box>
                <Box flex={1}>
                  <PlayerButton game={gameState} leftSide={true} firstTeam={true}></PlayerButton>
                </Box>
              </>
            ) : (
              <Box flex={1}>
                <PlayerButton game={gameState} firstTeam={true} leftSide={true}></PlayerButton>
              </Box>
            )}
          </Flex>
          <Box flex={1}>
            <TeamButton firstTeam={true} game={gameState}></TeamButton>
          </Box>
          <Flex flex={2} direction={isVertical ? 'row' : 'column'}>
            <Center mih={0} flex={30}>
              {gameState.started.get ? (
                <Button color="player-color" size="lg" onClick={() => sync(gameState)}>
                  Sync
                </Button>
              ) : (
                <Popover width={300} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <Button size="lg" color="player-color">
                      Officials
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Center>
                      <Stack>
                        <Select
                          label="Official"
                          searchable
                          allowDeselect={false}
                          placeholder="Pick value"
                          data={officials.map((a) => ({
                            value: a.searchableName,
                            label: a.name,
                          }))}
                          value={official?.searchableName}
                          onChange={(v) => {
                            setOfficial(officials.find((a) => a.searchableName === v)!);
                          }}
                          comboboxProps={{ withinPortal: false }}
                        />

                        <Select
                          label="Scorer"
                          allowDeselect={false}
                          placeholder="Pick value"
                          data={officials.map((a) => ({
                            value: a.searchableName,
                            label: a.name,
                          }))}
                          value={scorer?.searchableName}
                          onChange={(v) => {
                            setScorer(officials.find((a) => a.searchableName === v)!);
                          }}
                          comboboxProps={{ withinPortal: false }}
                        />
                      </Stack>
                    </Center>
                  </Popover.Dropdown>
                </Popover>
              )}
            </Center>
            <Box
              flex={30}
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
              <GameScore game={gameState} official={official} scorer={scorer}></GameScore>
            </Box>

            <Center flex={30}>
              <Button
                size="lg"
                color={gameState.started.get ? 'player-color' : 'red'}
                onClick={() => {
                  if (gameState.started.get) {
                    undo(gameState);
                  } else {
                    del(gameState);
                  }
                }}
              >
                {gameState.started.get ? 'Undo' : 'Delete'}
              </Button>
            </Center>
          </Flex>
          <Box flex={1} style={{ height: '100%', float: 'right' }}>
            <TeamButton firstTeam={false} game={gameState}></TeamButton>
          </Box>
          <Flex direction={isVertical ? 'row' : 'column-reverse'} flex={4}>
            {(
              gameState.teamOneIGA.get
                ? gameState.teamTwo.right.get && gameState.teamTwo.left.get
                : gameState.teamOne.right.get && gameState.teamOne.left.get
            ) ? (
              <>
                <Box flex={1}>
                  <PlayerButton game={gameState} leftSide={true} firstTeam={false}></PlayerButton>
                </Box>
                <Box flex={1}>
                  <PlayerButton game={gameState} firstTeam={false} leftSide={false}></PlayerButton>
                </Box>
              </>
            ) : (
              <Box flex={1}>
                <PlayerButton game={gameState} leftSide={true} firstTeam={false}></PlayerButton>
              </Box>
            )}
          </Flex>
        </Flex>
      </Box>
    </MantineProvider>
  );
}
