import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Center, Modal, Popover, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  abandon,
  begin,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { GameActionList } from '@/components/HandballComponenets/GameEditingComponenets/GameScore/GameActionList';
import { GameState } from '@/components/HandballComponenets/GameState';
import { OfficialStructure } from '@/ServerActions/types';

interface GameScoreArgs {
  game: GameState;
  official?: OfficialStructure;
  scorer?: OfficialStructure;
}

export const QUICK_GAME_END = false;

export function GameScore({ game, official, scorer }: GameScoreArgs) {
  const [endGameOpen, { open: openEndGame, close: closeEndGame }] = useDisclosure(false);
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
      teamOne.score.get >= (game.blitzGame.get ? 10 : 6) ||
      teamTwo.score.get >= (game.blitzGame.get ? 10 : 6)
        ? teamOne.score.get - teamTwo.score.get
        : 0,
    [game.blitzGame.get, teamOne.score.get, teamTwo.score.get]
  );
  return (
    <>
      <Modal opened={endGameOpen} centered onClose={closeEndGame} title="Action">
        <Title> End Game</Title>
        <GameActionList game={game} close={closeEndGame}></GameActionList>
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
            <Popover opened={openPopover} onChange={setOpenPopover}>
              <Popover.Target>
                <Box
                  onClick={() => {
                    if (!openPopover && matchPoints === 0) {
                      setOpenPopover(true);
                    }
                  }}
                >
                  <Title order={1}>
                    {matchPoints > 0 ? <strong>{teamOne.score.get}*</strong> : teamOne.score.get}
                  </Title>
                  <Title order={1}>-</Title>
                  <Title order={1}>
                    {matchPoints < 0 ? <strong>{teamTwo.score.get}*</strong> : teamTwo.score.get}
                  </Title>
                </Box>
              </Popover.Target>

              <Popover.Dropdown>
                <>
                  {matchPoints && (
                    <Center>
                      <Text fw={700} fz={20}>
                        <i>
                          {Math.abs(matchPoints)} match points to{' '}
                          {matchPoints > 0 ? teamOne.name.get : teamTwo.name.get}
                        </i>
                      </Text>
                    </Center>
                  )}

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
                          abandon(game);
                          setOpenPopover(false);
                        }}
                      >
                        Confirm
                      </Button>
                    </Popover.Dropdown>
                  </Popover>
                </>
              </Popover.Dropdown>
            </Popover>
          </>
        )
      ) : (
        <Button color="player-color" size="lg" onClick={() => begin(game, official, scorer)}>
          Start
        </Button>
      )}
    </>
  );
}
