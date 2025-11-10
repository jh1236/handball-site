'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Image, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useGameState } from '@/components/HandballComponenets/GameState';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { useScreenVertical } from '@/components/hooks/useScreenVertical';
import { getGame } from '@/ServerActions/GameActions';
import { getOfficials } from '@/ServerActions/OfficialActions';
import { GameStructure, OfficialStructure } from '@/ServerActions/types';

interface ClassicEditGameParams {
  game: number;
}

export function ClassicEditGame({ game: gameID }: ClassicEditGameParams) {
  const { isOfficial, loading } = useUserData();
  const [officials, setOfficials] = useState<OfficialStructure[]>([]);
  const [scorer, setScorer] = useState<OfficialStructure>();
  const [official, setOfficial] = useState<OfficialStructure>();

  const [gameObj, setGameObj] = React.useState<GameStructure | null>(null);
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

  getGame({ gameID }).then((gameIn) => {
    setGameObj(gameIn);
  });

  useEffect(() => {
    if (!gameObj) return;
    setOfficial(gameObj?.official);
    setScorer(gameObj?.scorer ?? undefined);
    setGameForState(gameObj);
    //disabled as including setGameForState will cause an infinite reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameObj]);

  useEffect(() => {
    if (gameState.timeoutExpirationTime.get > 0) {
      openTimeout();
    } else {
      closeTimeout();
    }
  }, [closeTimeout, openTimeout, gameState.timeoutExpirationTime.get]);
  if (!loading && !isOfficial(gameObj?.tournament.searchableName)) return <></>;

  return (
    <Box w="98vw" h="100lvh">
      <Grid w="100%">
        <Grid.Col ta="center" span={5}>
          <Title>{gameState.teamOne.name.get}</Title>
        </Grid.Col>
        <Grid.Col ta="center" span={2}>
          <Title>vs</Title>
        </Grid.Col>
        <Grid.Col ta="center" span={5}>
          <Title>{gameState.teamTwo.name.get}</Title>
        </Grid.Col>

        <Grid.Col ta="center" span={6}>
          <Image m="auto" w="80%" src={gameObj?.teamOne.imageUrl}></Image>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Image m="auto" w="80%" src={gameObj?.teamTwo.imageUrl}></Image>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65}>
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Score for {gameState.teamOne.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65}>
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Score for {gameState.teamTwo.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6} mt={25}>
          <Button size="md" w={190} mih={65}>
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Score for {gameState.teamOne.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6} mt={25}>
          <Button size="md" w={190} mih={65}>
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Score for {gameState.teamTwo.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65} color="gray">
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Warning for {gameState.teamOne.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65} color="gray">
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Warning for {gameState.teamTwo.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65} color="green">
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Green Card for {gameState.teamOne.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65} color="green">
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Green Card for {gameState.teamTwo.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65} color="yellow">
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Yellow Card for {gameState.teamOne.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65} color="yellow">
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Yellow Card for {gameState.teamTwo.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65} color="red">
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Red Card for {gameState.teamOne.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <Button size="md" w={190} mih={65} color="red">
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Red Card for {gameState.teamTwo.name.get}
            </Text>
          </Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
