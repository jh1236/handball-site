import React, { useEffect, useMemo, useState } from 'react';
import { IconRotate3d } from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  Modal,
  Overlay,
  Paper,
  Popover,
  Portal,
  Stack,
  Text,
  Title,
  useMatches,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEditGameActions } from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { GameActionList } from '@/components/HandballComponenets/GameEditingComponenets/GameScore/GameActionList';
import { GameState } from '@/components/HandballComponenets/GameState';
import { useScreenVertical } from '@/components/hooks/useScreenVertical';
import { ReplayIcons } from '@/components/icons/ReplayIcons';
import { OfficialStructure } from '@/ServerActions/types';

interface GameScoreArgs {
  game: GameState;
  official?: OfficialStructure;
  scorer?: OfficialStructure;
}

export const QUICK_GAME_END = false;

export function GameScore({ game, official, scorer }: GameScoreArgs) {
  const isVertical = useScreenVertical();
  const fullscreen = useMatches({ base: true, md: false });
  const { abandon, begin, replay } = useEditGameActions(game);
  const [endGameOpen, { open: openEndGame, close: closeEndGame }] = useDisclosure(false);
  const [index, setIndex] = useState(0);
  const [openPopover, setOpenPopover] = useState(false);
  useEffect(() => {
    if (game.practice.get) {
      game.teamOne.rating.set(3);
      game.teamTwo.rating.set(3);
      if (!game.started.get) {
        game.teamOneIGA.set(Math.random() > 0.5);
        game.firstTeamServes.set(Math.random() > 0.5);
      }
    }
    // there is no sane reason to have the deps that it wants.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.practice.get]);
  const teamOne = game.teamOneIGA.get ? game.teamOne : game.teamTwo;
  const teamTwo = game.teamOneIGA.get ? game.teamTwo : game.teamOne;
  const matchPoints = useMemo(
    () =>
      teamOne.score.get >= (game.blitzGame.get ? 6 : 10) ||
      teamTwo.score.get >= (game.blitzGame.get ? 6 : 10)
        ? teamOne.score.get - teamTwo.score.get
        : 0,
    [game.blitzGame.get, teamOne.score.get, teamTwo.score.get]
  );
  return (
    <>
      <Box pos="absolute" m="auto" w={150} h={150} style={{ zIndex: -2 }}>
        <ReplayIcons replays={game.replaysSinceScore.get} width={150} height={150} color="#444" />
      </Box>
      <Modal
        opened={!fullscreen && endGameOpen}
        centered
        onClose={closeEndGame}
        size="auto"
        withCloseButton={false}
      >
        <Box miw={400} w="40%">
          <GameActionList
            index={index}
            setIndex={setIndex}
            game={game}
            close={closeEndGame}
          ></GameActionList>
        </Box>
      </Modal>
      {game.started.get ? (
        game.ended.get ? (
          <>
            <Button color="player-color" size="lg" onClick={openEndGame}>
              End
            </Button>
          </>
        ) : (
          <>
            <Popover
              opened={openPopover}
              onChange={setOpenPopover}
              position={isVertical ? undefined : 'right'}
              offset={isVertical ? undefined : 40}
            >
              <Popover.Target>
                <Box
                  onClick={() => {
                    if (!openPopover) {
                      setOpenPopover(true);
                    }
                  }}
                >
                  <Title order={1}>
                    {matchPoints > 0 ? `${teamOne.score.get}*` : teamOne.score.get}
                  </Title>
                  <Title order={1}>-</Title>
                  <Title order={1}>
                    {matchPoints < 0 ? `${teamTwo.score.get}*` : teamTwo.score.get}
                  </Title>
                </Box>
              </Popover.Target>

              <Popover.Dropdown>
                <>
                  {!!matchPoints && (
                    <>
                      <Center>
                        <Text fw={700} fz={20}>
                          <i>
                            {Math.abs(matchPoints)} match points to{' '}
                            {matchPoints > 0 ? teamOne.name.get : teamTwo.name.get}
                          </i>
                        </Text>
                      </Center>
                      <br />
                    </>
                  )}

                  <Stack>
                    <Popover width={200} position="top" withArrow shadow="md">
                      <Popover.Target>
                        <Button size="lg" color="red">
                          Abandon
                        </Button>
                      </Popover.Target>

                      <Popover.Dropdown ta="center">
                        <Text m={5}>Are you sure you want to abandon this game?</Text>
                        {Math.max(game.teamOne.score.get, game.teamTwo.score.get) < 5 && (
                          <Text>
                            <b style={{ color: 'red' }}>
                              Doing so will result in the game being decided on a coin toss!
                            </b>
                          </Text>
                        )}
                        <Button
                          m={5}
                          color="red"
                          onClick={() => {
                            abandon();
                            setOpenPopover(false);
                          }}
                        >
                          Confirm
                        </Button>
                      </Popover.Dropdown>
                    </Popover>

                    <Button
                      size="lg"
                      color="gray"
                      onClick={() => {
                        replay();
                        setOpenPopover(false);
                      }}
                    >
                      Replay
                    </Button>
                  </Stack>
                </>
              </Popover.Dropdown>
            </Popover>
          </>
        )
      ) : (
        <Button color="player-color" size="lg" onClick={() => begin(official, scorer)}>
          Start
        </Button>
      )}
      {fullscreen && endGameOpen && (
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
            onClick={closeEndGame}
          >
            {isVertical ? (
              <Paper
                p={20}
                pb={20}
                pt={20}
                w="90%"
                // mih="50%"
                m="auto"
                onClick={(e) => e.stopPropagation()}
              >
                <GameActionList
                  index={index}
                  setIndex={setIndex}
                  game={game}
                  close={closeEndGame}
                ></GameActionList>
              </Paper>
            ) : (
              <Paper p={20} maw="40%" m="auto" onClick={(e) => e.stopPropagation()}>
                <Title order={3} mb={15} ta="center">
                  <IconRotate3d style={{ marginRight: 5 }} />
                  Rotate your device
                </Title>
                <Text>
                  This menu is not suitable for a horizontal mobile device. Please rotate your
                  device to fill out the data required.
                </Text>
              </Paper>
            )}
          </Overlay>
        </Portal>
      )}
    </>
  );
}
