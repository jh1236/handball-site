'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Box, Button, LoadingOverlay, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  del,
  endTimeout,
  sync,
  undo,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { GameScore } from '@/components/HandballComponenets/GameEditingComponenets/GameScore';
import { PlayerButton } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton';
import { TeamButton } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import { setGameState, useGameState } from '@/components/HandballComponenets/GameState';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { getGame } from '@/ServerActions/GameActions';
import { GameStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

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
  const { isUmpireManager, isOfficial } = useUserData();

  const [gameObj, setGameObj] = React.useState<GameStructure | null>(null);
  setGameFn = setGameObj;
  const [visibleLoading, { open: openLoading, close: closeLoading }] = useDisclosure(false);
  const [editOfficialGame, { close: iKnowWhatImDoing }] = useDisclosure(true);
  startLoading = openLoading;
  const [visibleTimeout, { open: openTimeout, close: closeTimeout }] = useDisclosure(false);

  const [currentTime, setCurrentTime] = React.useState<number>(300);

  const gameState = useGameState(gameObj || undefined);

  //team one state

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
    setGameState(gameObj, gameState);
    closeLoading();
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
  return (
    <Box style={{ width: '100%', height: '100vh' }}>
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
          !isOfficial(gameObj?.tournament.searchableName) ||
          (gameObj?.status === 'Official' && editOfficialGame)
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
      <Box style={{ width: '100%', height: '40%' }}>
        {(
          gameState.teamOneIGA.get
            ? gameState.teamOne.right.get && gameState.teamOne.left.get
            : gameState.teamTwo.right.get && gameState.teamTwo.left.get
        ) ? (
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
            color={gameState.started.get ? 'blue' : 'red'}
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
        </Box>
      </Box>
      <Box style={{ width: '100%', height: '40%' }}>
        <Box style={{ width: '100%', height: '10%', float: 'right' }}>
          <TeamButton firstTeam={false} game={gameState}></TeamButton>
        </Box>
        {(
          gameState.teamOneIGA.get
            ? gameState.teamTwo.right.get && gameState.teamTwo.left.get
            : gameState.teamOne.right.get && gameState.teamOne.left.get
        ) ? (
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
