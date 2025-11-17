import React, { ForwardRefExoticComponent, useMemo } from 'react';
import useScreenOrientation from 'react-hook-screen-orientation';
import {
  Box,
  Button,
  Modal,
  Overlay,
  Paper,
  Portal,
  Progress,
  Title,
  useMatches,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PlayerActionList } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton/PlayerActionList';
import { GameState } from '@/components/HandballComponenets/GameState';
import { useScreenVertical } from '@/components/hooks/useScreenVertical';

interface PlayerButtonProps {
  game: GameState;
  leftSide: boolean;
  firstTeam: boolean;
}

export type AccordionSettings = {
  Icon: ForwardRefExoticComponent<any>;
  value: string;
  title?: string | React.JSX.Element;
  color: string | undefined;
  content: React.JSX.Element;
};

export function PlayerButton({
  game,
  firstTeam: trueFirstTeam,
  leftSide: trueLeftSide,
}: PlayerButtonProps) {
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
    () =>
      game.started.get &&
      !game.ended.get &&
      (game.servingFromLeft === trueLeftSide || !team.left.get || !team.right.get) &&
      game.firstTeamServes.get === firstTeam,
    [
      firstTeam,
      game.ended.get,
      game.firstTeamServes.get,
      game.servingFromLeft,
      game.started.get,
      team.left.get,
      team.right.get,
      trueLeftSide,
    ]
  );
  const player = useMemo(() => {
    if (team.right.get === undefined) {
      return team.left.get;
    }
    if (team.left.get === undefined) {
      return team.right.get;
    }
    if (game.ended.get || !game.started.get) {
      return trueLeftSide ? team.left.get : team.right.get;
    }
    return [team.right.get, team.left.get].find(
      (pgs) => pgs.actingSideOfCourt === (trueLeftSide ? 'Left' : 'Right')
    );
  }, [team.right.get, team.left.get, game.ended.get, game.started.get, trueLeftSide]);

  const leftSide = useMemo(
    () => (game.ended.get || !game.started.get ? trueLeftSide : player?.sideOfCourt === 'Left'),
    [game.ended.get, game.started.get, player?.sideOfCourt, trueLeftSide]
  );
  const [opened, { open, close }] = useDisclosure(false);
  const isVertical = useScreenVertical();
  const name = player ? (player.isCaptain ? `${player.name} (c)` : player.name) : 'Loading...';
  const servingColor = 'serving-color';
  const defaultColor = 'player-color';
  const fullscreen = useMatches({ base: true, md: false });
  return (
    <>
      <Modal
        opened={!fullscreen && opened}
        fullScreen={fullscreen}
        centered
        onClose={close}
        title={<Title>{player?.name ?? 'Loading...'}</Title>}
      >
        <Box h={300}>
          <PlayerActionList
            game={game}
            fullscreen={fullscreen}
            firstTeam={firstTeam}
            leftSide={leftSide}
            serving={serving}
            close={close}
          ></PlayerActionList>
        </Box>
      </Modal>
      <Button
        size="lg"
        radius={0}
        color={`${serving ? servingColor : player?.isLibero ? 'libero-color' : defaultColor}.${trueLeftSide ? 7 : 9}`}
        style={{
          width: '100%',
          height: (player?.cardTimeRemaining ?? 0) !== 0 && !game.ended.get ? '95%' : '100%',
          fontWeight: serving ? 'bold' : 'normal',
          margin: 0,
        }}
        onClick={open}
      >
        {player?.cardTimeRemaining !== 0 && !game.ended.get ? (
          <s>{name}</s>
        ) : game.faulted.get && serving ? (
          <i>{name}*</i>
        ) : (
          name
        )}{' '}
        {(!team.left.get || !team.right.get) && `(${player?.actingSideOfCourt ?? '?'})`}
      </Button>
      <br />
      {player?.cardTimeRemaining !== 0 && player && !game.ended.get && (
        <Progress
          radius={0}
          style={{ height: '5%' }}
          color={player!.cardTimeRemaining < 0 ? 'red' : player!.cardTime > 2 ? 'yellow' : 'green'}
          value={
            100 *
            (player!.cardTimeRemaining >= 0 ? player!.cardTimeRemaining / player!.cardTime : 1)
          }
        ></Progress>
      )}
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
              p={isVertical ? 5 : 20}
              pb={20}
              pt={20}
              mah={isVertical ? 600 : 400}
              w={isVertical ? '90%' : '70%'}
              h={isVertical ? 'auto' : '90%'}
              m="auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Title order={3} ml={isVertical ? 15 : undefined} mb={15}>
                {player?.name ?? 'Loading...'}
              </Title>
              <PlayerActionList
                game={game}
                fullscreen
                firstTeam={firstTeam}
                leftSide={leftSide}
                serving={serving}
                close={close}
              ></PlayerActionList>
            </Paper>
          </Overlay>
        </Portal>
      )}
    </>
  );
}
