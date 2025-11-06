import React, { useMemo } from 'react';
import { IconQuestionMark, IconTrophy } from '@tabler/icons-react';
import useScreenOrientation from 'react-hook-screen-orientation';
import { Button, Modal, Overlay, Paper, Portal, Text, Title, useMatches } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TeamActionList } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton/TeamActionList';
import {
  decidedOnCoinToss,
  didWinGame,
} from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { GameState } from '@/components/HandballComponenets/GameState';
import { useScreenVertical } from '@/components/hooks/useScreenVertical';

interface TeamButtonProps {
  game: GameState;
  firstTeam: boolean;
}

export const FEEDBACK_TEXTS = [
  <Text display="inline" c="gray">
    <i>Unset</i>
  </Text>,
  <Text display="inline" c="red">
    Follow up Required
  </Text>,
  <Text display="inline" c="orange">
    Disrespectful Behaviour
  </Text>,
  <Text display="inline">Acceptable Behaviour</Text>,
  <Text display="inline" c="green">
    Above and Beyond
  </Text>,
];

export function TeamButton({ game, firstTeam: trueFirstTeam }: TeamButtonProps) {
  const screenOrientation = useScreenOrientation();

  const shouldNotFlip = useMemo(
    () => screenOrientation !== 'landscape-primary',
    [screenOrientation]
  );

  const firstTeam = useMemo(
    () => (trueFirstTeam === game.teamOneIGA.get) === shouldNotFlip,
    [game.teamOneIGA.get, shouldNotFlip, trueFirstTeam]
  );
  const team = useMemo(
    () => (firstTeam ? game.teamOne : game.teamTwo),
    [firstTeam, game.teamOne, game.teamTwo]
  );
  const serving = useMemo(
    () => !game.ended.get && game.firstTeamServes.get === firstTeam,
    [firstTeam, game.ended.get, game.firstTeamServes.get]
  );
  const [opened, { open, close }] = useDisclosure(false);
  const fullscreen = useMatches({ base: true, md: false });

  const name = team ? team.name.get : 'Loading...';
  const isVertical = useScreenVertical();
  return (
    <>
      <Modal opened={!fullscreen && opened} centered onClose={close} title={<Title> {name}</Title>}>
        <TeamActionList
          game={game}
          firstTeam={firstTeam}
          serving={serving}
          close={close}
        ></TeamActionList>
      </Modal>
      <Button
        radius={0}
        size="lg"
        color={`${didWinGame(game, firstTeam) ? 'orange.5' : decidedOnCoinToss(game) ? 'green.9' : serving ? 'serving-color.5' : 'player-color.5'}`}
        style={{
          width: '100%',
          height: '100%',
          fontWeight: serving ? 'bold' : 'normal',
        }}
        onClick={open}
      >
        {isVertical ? (
          <b>
            {name} ({(game.teamOneIGA?.get ?? true) === firstTeam ? 'IGA' : 'Stairs'}){' '}
            {didWinGame(game, firstTeam) && <IconTrophy />}
            {decidedOnCoinToss(game) && <IconQuestionMark />}
          </b>
        ) : (
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: firstTeam
                ? 'translate(-50%, -50%) rotate(90deg)'
                : 'translate(-50%, -50%) rotate(-90deg)',
              transformOrigin: 'center center',
              whiteSpace: 'nowrap',
              fontWeight: serving ? 'bold' : 'normal',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <b>
              {name} ({(game.teamOneIGA?.get ?? true) === firstTeam ? 'IGA' : 'Stairs'}){' '}
              {didWinGame(game, firstTeam) && <IconTrophy />}
              {decidedOnCoinToss(game) && <IconQuestionMark />}
            </b>
          </span>
        )}
      </Button>
      {fullscreen && opened && (
        <Portal>
          <Overlay
            pos="absolute"
            w="100lvw"
            h="100lvh"
            top={0}
            backgroundOpacity={0.85}
            blur={15}
            left={0}
            center={true}
            onClick={close}
          >
            <Paper
              p={5}
              pb={20}
              pt={20}
              mah={game.ended.get ? 500 : 350}
              w={isVertical ? '90%' : '70%'}
              h={isVertical ? 'auto' : '90%'}
              onClick={(e) => e.stopPropagation()}
            >
              <Title order={3} ml={15} mb={15}>
                {name}
              </Title>
              <TeamActionList
                game={game}
                firstTeam={firstTeam}
                serving={serving}
                close={close}
              ></TeamActionList>
            </Paper>
          </Overlay>
        </Portal>
      )}
    </>
  );
}
