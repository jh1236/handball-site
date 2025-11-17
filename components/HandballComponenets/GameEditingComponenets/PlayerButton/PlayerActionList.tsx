import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
  IconArrowsLeftRight,
  IconArrowsUpDown,
  IconBallTennis,
  IconCircleFilled,
  IconExclamationMark,
  IconMasksTheater,
  IconPlayHandball,
  IconShield,
  IconSquareFilled,
  IconStarFilled,
  IconTriangleInvertedFilled,
} from '@tabler/icons-react';
import { ImEvil } from 'react-icons/im';
import {
  Accordion,
  Autocomplete,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  Overlay,
  Paper,
  Portal,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  useMatches,
} from '@mantine/core';
import { VerticalSlider } from '@/components/basic/VerticalSlider';
import { useEditGameActions } from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { GAME_CONFIG } from '@/components/HandballComponenets/GameEditingComponenets/GameEditingConfig';
import { AccordionSettings } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton/PlayerButton';
import SelectCourtLocation from '@/components/HandballComponenets/GameEditingComponenets/SelectCourtLocation';
import { GameState } from '@/components/HandballComponenets/GameState';
import { useScreenVertical } from '@/components/hooks/useScreenVertical';
import { IconHandballCards } from '@/components/icons/IconCards';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

export function playerCanReceiveCard(
  player: PlayerGameStatsStructure,
  reason: string,
  type: string
): boolean {
  if (!player) return true;
  const cards = player.prevCards!;
  const prevCard = cards.find(
    (i) => getCardBadness(i.eventType) >= getCardBadness(type) && i.notes === reason
  );
  return prevCard === undefined;
}
function getCardBadness(eventType: string): number {
  return (
    {
      Warning: 1,
      'Green Card': 2,
      'Yellow Card': 3,
      'Red Card': 4,
    }[eventType] || 0
  );
}

interface PlayerActionListParams {
  game: GameState;
  firstTeam: boolean;
  fullscreen: boolean;
  leftSide: boolean;
  serving: boolean;
  close: () => void;
}

export function PlayerActionList({
  game,
  firstTeam,
  fullscreen,
  leftSide,
  serving,
  close: _close,
}: PlayerActionListParams): React.ReactElement {
  const isVertical = useScreenVertical();
  const { ace, demerit, fault, greenCard, merit, redCard, score, sub, warning, yellowCard } =
    useEditGameActions(game);
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const [cardTime, setCardTime] = React.useState<number>(
    Math.max(1, 6 - (game.blitzGame.get ? 3 : 0) - (team.isSolo ? 3 : 0))
  );

  const [location, setLocation] = React.useState<string[]>([]);
  const fullscreenScoreSelector = useMatches({ base: !isVertical, md: false });
  const [otherReason, setOtherReason] = React.useState<string>('');
  const close = useCallback(() => {
    _close();
    setCardTime(Math.max(1, 6 - (game.blitzGame.get ? 3 : 0) - (team.isSolo ? 3 : 0)));
    setOpenModal(undefined);
    setOtherReason('');
  }, [_close, game.blitzGame.get, team.isSolo]);

  const subsAllowedScore = useMemo(() => (game.blitzGame.get ? 5 : 9), [game.blitzGame.get]);
  const [openModal, setOpenModal] = useState<
    undefined | 'green' | 'yellow' | 'red' | 'score' | 'warning' | 'ace'
  >(undefined);
  const players = [team.left, team.right, team.sub].filter((a) => typeof a.get !== 'undefined');
  const currentPlayer = players.length > 1 ? players[leftSide ? 0 : 1] : players[0];

  const defaultCategory = useMemo(() => {
    if (!currentPlayer.get) return 'Warning';
    const cards = currentPlayer.get!.prevCards!.filter((gE) => gE.gameId === game.id);
    const prevCard = cards.reduce(
      (prev, card) => Math.max(prev, getCardBadness(card.eventType)),
      0
    );
    return ['Warning', 'Green Card', 'Yellow Card', 'Red Card'][prevCard] as
      | 'Warning'
      | 'Green Card'
      | 'Yellow Card'
      | 'Red Card';
  }, [currentPlayer.get, game.id]);

  const disabledCategories = useMemo(() => {
    const possible = ['Warning', 'Green Card', 'Yellow Card', 'Red Card'];

    return possible.filter((i) => getCardBadness(i) < getCardBadness(defaultCategory));
  }, [defaultCategory]);

  if (!currentPlayer?.get) return <></>;

  const out: AccordionSettings[] = [
    {
      Icon: IconHandballCards,
      value: 'Cards',
      content: (
        <Tabs
          w="100%"
          defaultValue={defaultCategory}
          orientation={isVertical ? undefined : 'vertical'}
        >
          <Tabs.List
            style={{ flexWrap: 'nowrap' }}
            mr={!isVertical ? 10 : undefined}
            mb={isVertical ? 10 : undefined}
            grow
          >
            <Tabs.Tab
              size="xs"
              color="grey"
              value="Warning"
              leftSection={<IconExclamationMark color="grey" size={12} stroke={3} />}
              disabled={disabledCategories.includes('Warning')}
            >
              Warn
            </Tabs.Tab>
            <Tabs.Tab
              size="xs"
              color="green"
              value="Green Card"
              leftSection={<IconTriangleInvertedFilled color="green" size={12} />}
              disabled={disabledCategories.includes('Green Card')}
            >
              Green
            </Tabs.Tab>
            <Tabs.Tab
              size="xs"
              color="yellow"
              value="Yellow Card"
              leftSection={<IconSquareFilled color="yellow" size={12} />}
              disabled={disabledCategories.includes('Yellow Card')}
            >
              Yellow
            </Tabs.Tab>
            <Tabs.Tab
              size="xs"
              color="red"
              value="Red Card"
              leftSection={<IconCircleFilled color="red" size={12} />}
            >
              Red
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Warning">
            {GAME_CONFIG.cards.warning.map((reason, i) => (
              <Fragment key={i}>
                <Button
                  size="xs"
                  m={3}
                  miw={160}
                  color="gray.6"
                  disabled={
                    !game.practice.get &&
                    !playerCanReceiveCard(currentPlayer.get!, reason, 'Warning')
                  }
                  onClick={() => {
                    warning(firstTeam, leftSide, reason);
                    close();
                  }}
                >
                  {reason}
                </Button>
                <br />
              </Fragment>
            ))}
            <Button
              onClick={() => setOpenModal('warning')}
              style={{ margin: '3px' }}
              size="xs"
              color="gray"
            >
              Other
            </Button>

            <Modal
              opened={openModal === 'warning'}
              onClose={() => {
                setOpenModal(undefined);
                setOtherReason('');
              }}
            >
              <TextInput
                value={otherReason}
                onChange={(event) => setOtherReason(event.currentTarget.value)}
                label="Select Other Reason"
              ></TextInput>
              <Button
                onClick={() => {
                  warning(firstTeam, leftSide, otherReason);
                  close();
                }}
                style={{ margin: '3px' }}
                size="xs"
                disabled={!otherReason}
                color="player-color"
              >
                Submit
              </Button>
            </Modal>
          </Tabs.Panel>
          <Tabs.Panel value="Green Card">
            {GAME_CONFIG.cards.green.map((reason, i) => (
              <Fragment key={i}>
                <Button
                  size="xs"
                  m={3}
                  miw={160}
                  disabled={
                    !game.practice.get &&
                    !playerCanReceiveCard(currentPlayer.get!, reason, 'Green Card')
                  }
                  color="green"
                  onClick={() => {
                    greenCard(firstTeam, leftSide, reason);
                    close();
                  }}
                >
                  {reason}
                </Button>
                <br />
              </Fragment>
            ))}
            <Button
              onClick={() => setOpenModal('green')}
              style={{ margin: '3px' }}
              size="xs"
              color="gray"
            >
              Other
            </Button>

            <Modal
              opened={openModal === 'green'}
              onClose={() => {
                setOpenModal(undefined);
                setOtherReason('');
              }}
            >
              <TextInput
                value={otherReason}
                onChange={(event) => setOtherReason(event.currentTarget.value)}
                label="Select Other Reason"
              ></TextInput>
              <Button
                onClick={() => {
                  greenCard(firstTeam, leftSide, otherReason);
                  close();
                }}
                style={{ margin: '3px' }}
                size="xs"
                disabled={!otherReason}
                color="green"
              >
                Submit
              </Button>
            </Modal>
          </Tabs.Panel>
          <Tabs.Panel value="Yellow Card">
            <Flex flex="space-between">
              <Box>
                {GAME_CONFIG.cards.yellow.map((reason, i) => (
                  <Fragment key={i}>
                    <Button
                      m={3}
                      miw={160}
                      size="xs"
                      disabled={
                        !game.practice.get &&
                        !playerCanReceiveCard(currentPlayer.get!, reason, 'Yellow Card')
                      }
                      color="orange"
                      onClick={() => {
                        yellowCard(firstTeam, leftSide, reason, cardTime);
                        close();
                      }}
                    >
                      {reason}
                    </Button>
                    <br />
                  </Fragment>
                ))}
                <Button
                  onClick={() => setOpenModal('yellow')}
                  style={{ margin: '3px' }}
                  size="xs"
                  color="gray"
                >
                  Other
                </Button>
              </Box>

              <Stack m="auto">
                <VerticalSlider
                  minValue={game.blitzGame.get ? 3 : 6}
                  maxValue={game.blitzGame.get ? 9 : 12}
                  value={cardTime}
                  setValue={setCardTime}
                />

                <Text ta="center" mt="xs">
                  <b>Card Time:</b> {cardTime} Rounds
                </Text>
              </Stack>
            </Flex>
            <Modal
              opened={openModal === 'yellow'}
              onClose={() => {
                setOpenModal(undefined);
                setOtherReason('');
              }}
            >
              <TextInput
                value={otherReason}
                onChange={(event) => setOtherReason(event.currentTarget.value)}
                label="Select Other Reason"
              ></TextInput>
              <Button
                onClick={() => {
                  yellowCard(firstTeam, leftSide, otherReason, cardTime);
                  close();
                }}
                style={{ margin: '3px' }}
                size="xs"
                disabled={!otherReason}
                color="orange"
              >
                Submit
              </Button>
            </Modal>
          </Tabs.Panel>
          <Tabs.Panel value="Red Card">
            {GAME_CONFIG.cards.red.map((reason, i) => (
              <Fragment key={i}>
                <Button
                  m={3}
                  miw={160}
                  size="xs"
                  color="red"
                  onClick={() => {
                    redCard(firstTeam, leftSide, reason);
                    close();
                  }}
                >
                  {reason}
                </Button>
                <br />
              </Fragment>
            ))}
            <Button
              onClick={() => setOpenModal('red')}
              style={{ margin: '3px' }}
              size="xs"
              color="gray"
            >
              Other
            </Button>
            <Modal
              opened={openModal === 'red'}
              onClose={() => {
                setOpenModal(undefined);
                setOtherReason('');
              }}
            >
              <TextInput
                value={otherReason}
                onChange={(event) => setOtherReason(event.currentTarget.value)}
                label="Select Other Reason"
              ></TextInput>
              <Button
                onClick={() => {
                  redCard(firstTeam, leftSide, otherReason);
                  close();
                }}
                style={{ margin: '3px' }}
                size="xs"
                disabled={!otherReason}
                color="red"
              >
                Submit
              </Button>
            </Modal>
          </Tabs.Panel>
        </Tabs>
      ),
      color: 'white',
    },
    {
      Icon: IconMasksTheater,
      value: 'Other',
      color: 'white',
      content: (
        <Tabs w="100%" defaultValue="Merit">
          <Tabs.List grow>
            <Tabs.Tab
              size="sm"
              color="#3262a8"
              value="Merit"
              leftSection={<IconStarFilled color="#3262a8" size={16} stroke={3} />}
            >
              Merit
            </Tabs.Tab>
            <Tabs.Tab
              size="sm"
              color="#C00000"
              value="Demerit"
              leftSection={<ImEvil color="#C00000" size={16} />}
            >
              Demerit
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Merit" m={10}>
            <Autocomplete
              label="Select Reason"
              placeholder="Write something or pick from the list"
              data={[
                'Above and Beyond Effort',
                'Cool Body Part',
                'Good Sportsmanship',
                'Trick Shot',
                'Well Placed Ball',
              ]}
              onChange={setOtherReason}
            ></Autocomplete>
            <Button
              onClick={() => {
                merit(firstTeam, leftSide, otherReason);
                close();
              }}
              m={5}
              size="sm"
              color="player-color"
            >
              Submit
            </Button>
          </Tabs.Panel>
          <Tabs.Panel value="Demerit" m={10}>
            <Autocomplete
              label="Select Reason"
              placeholder="Write something or pick from the list"
              data={[
                'Nefarious Laugh',
                'Devious Joke',
                'Sinister Rage Bait',
                'Abominable Play',
                'Conniving Conspiracy',
                'Speaking in Tongues',
              ]}
              onChange={setOtherReason}
            ></Autocomplete>
            <Button
              onClick={() => {
                demerit(firstTeam, leftSide, otherReason);
                close();
              }}
              m={5}
              size="sm"
              color="#C00000"
            >
              Submit
            </Button>
          </Tabs.Panel>
        </Tabs>
      ),
    },
  ];
  if (!game.started.get) {
    const otherPlayers = players.filter(
      (a) => a.get && a.get.searchableName !== currentPlayer.get?.searchableName
    );
    out.push({
      Icon: IconShield,
      value: 'Set as Libero',
      color: 'orange',
      content: (
        <>
          {currentPlayer.get.isLibero ? (
            <Button
              size="lg"
              onClick={() => {
                const me = currentPlayer.get!;
                me.isLibero = false;
                currentPlayer.set(me);
                close();
              }}
            >
              Set Not Libero
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => {
                const me = currentPlayer.get!;
                otherPlayers.forEach((pgs) =>
                  pgs.set(pgs.get ? { ...pgs.get, isLibero: false } : undefined)
                );
                me.isLibero = true;
                currentPlayer.set(me);
                close();
              }}
            >
              Set Libero
            </Button>
          )}
        </>
      ),
    });
    out.push(
      ...otherPlayers.map((a) => ({
        Icon: IconArrowsUpDown,
        value: `Swap with ${a.get?.name}`,
        color: 'white',
        content: (
          <Button
            size="lg"
            onClick={() => {
              const temp = a.get!;
              a.set(currentPlayer.get!);
              currentPlayer.set(temp);
              close();
            }}
          >
            Swap
          </Button>
        ),
      }))
    );
  } else if (!game.ended.get) {
    out.splice(0, 0, {
      Icon: IconBallTennis,
      value: 'Score',
      color: undefined,
      content: (
        <>
          {fullscreen && openModal === 'score' && !isVertical && (
            <Portal>
              <Overlay
                pos="absolute"
                w="100lvw"
                h="100lvh"
                backgroundOpacity={0.35}
                top={0}
                left={0}
                center={true}
                onClick={() => setOpenModal(undefined)}
              >
                <Paper shadow="xl" m="auto" onClick={(e) => e.stopPropagation()} p={30}>
                  <Center>
                    <SelectCourtLocation
                      location={location}
                      setLocation={setLocation}
                      leftSide={leftSide}
                      isAce={otherReason === 'ace'}
                      reverse={game.teamOneIGA.get !== firstTeam}
                    ></SelectCourtLocation>
                    <br />
                    <Button
                      ml={15}
                      onClick={() => {
                        if (otherReason === 'ace') {
                          ace(location);
                        } else {
                          score(firstTeam, leftSide, otherReason, location);
                        }
                        close();
                      }}
                      disabled={!location.length}
                    >
                      Submit
                    </Button>
                  </Center>
                </Paper>
              </Overlay>
            </Portal>
          )}
          <Modal
            opened={openModal === 'score' && (isVertical || !fullscreen)}
            fullScreen={fullscreenScoreSelector}
            withCloseButton={!fullscreenScoreSelector}
            title={!fullscreenScoreSelector ? <Title order={3}>Score Location</Title> : undefined}
            onClose={() => {
              setOtherReason('');
              setLocation([]);
              setOpenModal(undefined);
            }}
          >
            <Stack>
              <Center>
                <SelectCourtLocation
                  location={location}
                  setLocation={setLocation}
                  isAce={otherReason === 'ace'}
                  leftSide={leftSide}
                  reverse={game.teamOneIGA.get !== firstTeam}
                ></SelectCourtLocation>
              </Center>
              <br />
              <Button
                onClick={() => {
                  if (otherReason === 'ace') {
                    ace(location);
                  } else {
                    score(firstTeam, leftSide, otherReason, location);
                  }
                  close();
                }}
                disabled={!location.length}
              >
                Submit
              </Button>
            </Stack>
          </Modal>
          <Flex direction="column">
            {!isVertical && (
              <>
                <Title order={3}>Score Reason</Title>
                <Divider m={5}></Divider>
              </>
            )}
            <Flex direction="row" justify="space-around" w="100%">
              <Flex direction="column">
                <Text m={5} fw={600} ta="center">
                  Common Methods
                </Text>
                {GAME_CONFIG.scoreMethods.slice(0, 3).map((method, i) => (
                  <Fragment key={i}>
                    <Button
                      miw={160}
                      m={isVertical ? 3 : 5}
                      color="player-color"
                      size="sm"
                      onClick={() => {
                        setOtherReason(method);
                        setOpenModal('score');
                      }}
                    >
                      {method}
                    </Button>
                    <br />
                  </Fragment>
                ))}
                <Button
                  miw={160}
                  m={isVertical ? 3 : 5}
                  color="player-color"
                  size="sm"
                  disabled={!serving}
                  onClick={() => {
                    setOtherReason('ace');
                    setOpenModal('score');
                  }}
                >
                  <i>Ace</i>
                </Button>
              </Flex>
              <Flex direction="column">
                <Text m={5} fw={600} ta="center">
                  Alternative Methods
                </Text>
                {GAME_CONFIG.scoreMethods.slice(3).map((method, i) => (
                  <Fragment key={i}>
                    <Button
                      miw={160}
                      m={isVertical ? 3 : 5}
                      size="sm"
                      color="player-color"
                      onClick={() => {
                        setOtherReason(method);
                        setOpenModal('score');
                      }}
                    >
                      {method}
                    </Button>
                  </Fragment>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </>
      ),
    });
    if (team.sub.get && game.teamOne.score.get + game.teamTwo.score.get < subsAllowedScore) {
      out.splice(1, 0, {
        Icon: IconArrowsLeftRight,
        value: `Substitute (${subsAllowedScore - (game.teamOne.score.get + game.teamTwo.score.get)} points remaining)`,
        color: undefined,
        content: (
          <Button
            miw={160}
            color="player-color"
            size="sm"
            style={{ margin: '3px' }}
            onClick={() => {
              sub(firstTeam, leftSide);
              close();
            }}
          >
            Swap with {team.sub.get.name}
          </Button>
        ),
      });
    }
    if (serving) {
      out.splice(1, 0, {
        Icon: IconPlayHandball,
        value: 'Fault',
        color: undefined,
        content: (
          <Flex direction="column">
            {!isVertical && (
              <>
                <Title order={3}>Fault Reason</Title>
                <Divider m={5}></Divider>
              </>
            )}
            <Flex direction="row" justify="space-around" w="100%">
              <Flex direction="column">
                <Text m={5} fw={600} ta="center">
                  Common Methods
                </Text>
                {GAME_CONFIG.faultMethods.slice(0, 4).map((method, i) => (
                  <Fragment key={i}>
                    <Button
                      miw={160}
                      m={isVertical ? 3 : 5}
                      color="player-color"
                      size="sm"
                      onClick={() => {
                        fault(method);
                        close();
                      }}
                    >
                      {method}
                    </Button>
                    <br />
                  </Fragment>
                ))}
              </Flex>
              <Flex direction="column">
                <Text m={5} fw={600} ta="center">
                  Alternative Methods
                </Text>
                {GAME_CONFIG.faultMethods.slice(4).map((method, i) => (
                  <Fragment key={i}>
                    <Button
                      miw={160}
                      m={isVertical ? 3 : 5}
                      size="sm"
                      color="player-color"
                      onClick={() => {
                        fault(method);
                        close();
                      }}
                    >
                      {method}
                    </Button>
                  </Fragment>
                ))}
              </Flex>
            </Flex>
          </Flex>
        ),
      });
    }
  }
  if (isVertical) {
    return (
      <Accordion defaultValue={out[0].value} transitionDuration={0}>
        {out.map((item, i) => (
          <Accordion.Item key={i} value={item.value}>
            <Accordion.Control icon={<item.Icon color={item.color}></item.Icon>}>
              {item.value}
            </Accordion.Control>
            <Accordion.Panel>{item.content}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  }

  return (
    <Tabs orientation="vertical" w="100%" h="90%" defaultValue={out[0].value}>
      <Tabs.List mr={10}>
        {out.map((item, i) => (
          <Tabs.Tab
            leftSection={<item.Icon color={item.color} />}
            key={i}
            value={item.value}
          ></Tabs.Tab>
        ))}
      </Tabs.List>
      {out.map((item, i) => (
        <Tabs.Panel key={i} value={item.value}>
          <Center>{item.content}</Center>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
