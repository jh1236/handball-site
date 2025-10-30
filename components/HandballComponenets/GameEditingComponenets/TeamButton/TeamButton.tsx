import React, { useMemo } from 'react';
import { IconQuestionMark, IconTrophy } from '@tabler/icons-react';
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
  <Text c="gray">
    <i>Unset</i>
  </Text>,
  <Text c="red">Follow up Required</Text>,
  <Text c="orange">Disrespectful Behaviour</Text>,
  <Text>Acceptable Behaviour</Text>,
  <Text c="green">Above and Beyond</Text>,
];

export function TeamButton({ game, firstTeam: trueFirstTeam }: TeamButtonProps) {
  const firstTeam = trueFirstTeam === game.teamOneIGA.get;
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
  if (isVertical) {
    return (
      <>
        <Modal
          opened={opened}
          fullScreen={fullscreen}
          centered
          onClose={close}
          title={<Title> {name}</Title>}
        >
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
          <b>
            {name} ({(game.teamOneIGA?.get ?? true) === firstTeam ? 'IGA' : 'Stairs'}){' '}
            {didWinGame(game, firstTeam) && <IconTrophy></IconTrophy>}
            {decidedOnCoinToss(game) && <IconQuestionMark></IconQuestionMark>}
          </b>
        </Button>
      </>
    );
  }
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
        color={
          didWinGame(game, firstTeam)
            ? 'orange.5'
            : decidedOnCoinToss(game)
              ? 'green.9'
              : serving
                ? 'serving-color.5'
                : 'player-color.5'
        }
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'visible',
        }}
        onClick={open}
      >
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
            <Paper p={20} w="70%" h="90%" m="auto" onClick={(e) => e.stopPropagation()}>
              <Title order={3} mb={15}>
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
