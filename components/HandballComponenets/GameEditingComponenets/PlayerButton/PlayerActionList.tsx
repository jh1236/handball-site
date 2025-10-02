import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
  IconArrowsLeftRight,
  IconArrowsUpDown,
  IconBallTennis,
  IconCircleFilled,
  IconExclamationMark,
  IconMasksTheater,
  IconPlayHandball,
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
  Collapse,
  Modal,
  Select,
  Slider,
  Tabs,
  TextInput,
  Title,
} from '@mantine/core';
import { makeUnique } from '@/components/HandballComponenets/GameCreatingComponents/CreateTeamButton';
import {
  ace,
  demerit,
  fault,
  greenCard,
  merit,
  redCard,
  score,
  sub,
  warning,
  yellowCard,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { GAME_CONFIG } from '@/components/HandballComponenets/GameEditingComponenets/GameEditingConfig';
import { AccordionSettings } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton/PlayerButton';
import { GameState } from '@/components/HandballComponenets/GameState';
import { IconHandballCards } from '@/components/icons/IconCards';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

function buttonEnabledFor(player: PlayerGameStatsStructure, reason: string, type: string): boolean {
  if (!player) return true;
  const cards = player.prevCards!;
  const prevCard = cards.find((i) => i.eventType === type && i.notes === reason);
  return prevCard === undefined;
}

interface PlayerActionListParams {
  game: GameState;
  firstTeam: boolean;
  leftSide: boolean;
  serving: boolean;
  close: () => void;
}

export function PlayerActionList({
  game,
  firstTeam,
  leftSide,
  serving,
  close: _close,
}: PlayerActionListParams): React.ReactElement {
  const [cardTime, setCardTime] = React.useState<number>(game.blitzGame.get ? 3 : 6);
  const [otherReason, setOtherReason] = React.useState<string>('');
  const close = useCallback(() => {
    _close();
    setCardTime(game.blitzGame.get ? 3 : 6);
    setOpenModal(undefined);
    setOtherReason('');
  }, [_close, game.blitzGame.get]);

  const subsAllowedScore = useMemo(() => (game.blitzGame.get ? 5 : 9), [game.blitzGame.get]);
  const [openModal, setOpenModal] = useState<
    undefined | 'green' | 'yellow' | 'red' | 'score' | 'warning'
  >(undefined);
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const players = [team.left, team.right, team.sub].filter((a) => typeof a.get !== 'undefined');
  const currentPlayer = players.length > 1 ? players[leftSide ? 0 : 1] : players[0];
  if (!currentPlayer?.get) return <></>;
  let out: AccordionSettings[] = [
    {
      Icon: IconHandballCards,
      value: 'Cards',
      content: (
        <Tabs defaultValue="Warn">
          <Tabs.List grow style={{ flexWrap: 'nowrap' }}>
            <Tabs.Tab
              size="sm"
              color="grey"
              value="Warn"
              leftSection={<IconExclamationMark color="grey" size={12} stroke={3} />}
            >
              Warn
            </Tabs.Tab>
            <Tabs.Tab
              size="sm"
              color="green"
              value="Green"
              leftSection={<IconTriangleInvertedFilled color="green" size={12} />}
            >
              Green
            </Tabs.Tab>
            <Tabs.Tab
              size="sm"
              color="yellow"
              value="Yellow"
              leftSection={<IconSquareFilled color="yellow" size={12} />}
            >
              Yellow
            </Tabs.Tab>
            <Tabs.Tab
              size="sm"
              color="red"
              value="Red"
              leftSection={<IconCircleFilled color="red" size={12} />}
            >
              Red
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Warn">
            {GAME_CONFIG.cards.warning.map((reason, i) => (
              <Fragment key={i}>
                <Button
                  style={{ margin: '3px' }}
                  size="sm"
                  color="gray.6"
                  disabled={
                    !game.practice.get && !buttonEnabledFor(currentPlayer.get!, reason, 'Warning')
                  }
                  onClick={() => {
                    warning(game, firstTeam, leftSide, reason);
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
              size="sm"
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
                  warning(game, firstTeam, leftSide, otherReason);
                  close();
                }}
                style={{ margin: '3px' }}
                size="sm"
                disabled={!otherReason}
                color="player-color"
              >
                Submit
              </Button>
            </Modal>
          </Tabs.Panel>
          <Tabs.Panel value="Green">
            {GAME_CONFIG.cards.green.map((reason, i) => (
              <Fragment key={i}>
                <Button
                  style={{ margin: '3px' }}
                  size="sm"
                  disabled={
                    !game.practice.get &&
                    !buttonEnabledFor(currentPlayer.get!, reason, 'Green Card')
                  }
                  color="green"
                  onClick={() => {
                    greenCard(game, firstTeam, leftSide, reason);
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
              size="sm"
              color="gray"
            >
              Repeat/Other
            </Button>

            <Modal
              opened={openModal === 'green'}
              onClose={() => {
                setOpenModal(undefined);
                setOtherReason('');
              }}
            >
              <Select
                label="Select Repeat Reason"
                allowDeselect={false}
                defaultValue="Other"
                data={GAME_CONFIG.cards.warning.concat('Other').map((a) => ({
                  value: a,
                  label: a,
                  disabled:
                    !game.practice.get &&
                    !buttonEnabledFor(currentPlayer.get!, `Repeated ${a}`, 'Green Card'),
                }))}
                onChange={(reason) =>
                  setOtherReason(reason === 'Other' ? 'Other' : `Repeated ${reason}`)
                }
              ></Select>
              <TextInput
                value={
                  otherReason.startsWith('Repeated ')
                    ? '-'
                    : otherReason === 'Other'
                      ? ''
                      : otherReason
                }
                disabled={otherReason.startsWith('Repeated ')}
                onChange={(event) => setOtherReason(event.currentTarget.value)}
                label="Select Other Reason"
              ></TextInput>
              <Button
                onClick={() => {
                  greenCard(game, firstTeam, leftSide, otherReason);
                  close();
                }}
                style={{ margin: '3px' }}
                size="sm"
                disabled={!otherReason}
                color="green"
              >
                Submit
              </Button>
            </Modal>
          </Tabs.Panel>
          <Tabs.Panel value="Yellow">
            <Title m={5} order={2}>
              Rounds:{' '}
            </Title>
            <Slider
              min={game.blitzGame.get ? 3 : 6}
              max={game.blitzGame.get ? 9 : 12}
              step={1}
              value={cardTime}
              onChange={(value) => setCardTime(value)}
            />
            <br />
            {GAME_CONFIG.cards.yellow.map((reason, i) => (
              <Fragment key={i}>
                <Button
                  style={{ margin: '3px' }}
                  size="sm"
                  disabled={
                    !game.practice.get &&
                    !buttonEnabledFor(currentPlayer.get!, reason, 'Yellow Card')
                  }
                  color="orange"
                  onClick={() => {
                    yellowCard(game, firstTeam, leftSide, reason, cardTime);
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
              size="sm"
              color="gray"
            >
              Repeat/Other
            </Button>
            <Modal
              opened={openModal === 'yellow'}
              onClose={() => {
                setOpenModal(undefined);
                setOtherReason('');
              }}
            >
              <Select
                label="Select Repeat Reason"
                allowDeselect={false}
                defaultValue="Other"
                data={makeUnique(GAME_CONFIG.cards.warning.concat(GAME_CONFIG.cards.green))
                  .concat('Other')
                  .map((a) => ({
                    value: a,
                    label: a,
                    disabled:
                      !game.practice.get &&
                      !buttonEnabledFor(currentPlayer.get!, `Repeated ${a}`, 'Yellow Card'),
                  }))}
                onChange={(reason) =>
                  setOtherReason(reason === 'Other' ? 'Other' : `Repeated ${reason}`)
                }
              ></Select>
              <TextInput
                value={
                  otherReason.startsWith('Repeated ')
                    ? '-'
                    : otherReason === 'Other'
                      ? ''
                      : otherReason
                }
                disabled={otherReason.startsWith('Repeated ')}
                onChange={(event) => setOtherReason(event.currentTarget.value)}
                label="Select Other Reason"
              ></TextInput>
              <Button
                onClick={() => {
                  yellowCard(game, firstTeam, leftSide, otherReason);
                  close();
                }}
                style={{ margin: '3px' }}
                size="sm"
                disabled={!otherReason}
                color="orange"
              >
                Submit
              </Button>
            </Modal>
          </Tabs.Panel>
          <Tabs.Panel value="Red">
            {GAME_CONFIG.cards.red.map((reason, i) => (
              <Fragment key={i}>
                <Button
                  style={{ margin: '3px' }}
                  size="sm"
                  color="red"
                  onClick={() => {
                    redCard(game, firstTeam, leftSide, reason);
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
              size="sm"
              color="gray"
            >
              Repeat/Other
            </Button>
            <Modal
              opened={openModal === 'red'}
              onClose={() => {
                setOpenModal(undefined);
                setOtherReason('');
              }}
            >
              <Select
                label="Select Repeat Reason"
                allowDeselect={false}
                defaultValue="Other"
                data={makeUnique(
                  GAME_CONFIG.cards.warning
                    .concat(GAME_CONFIG.cards.green)
                    .concat(GAME_CONFIG.cards.yellow)
                ).concat('Other')}
                onChange={(reason) =>
                  setOtherReason(reason === 'Other' ? 'Other' : `Repeated ${reason}`)
                }
              ></Select>
              <TextInput
                value={
                  otherReason.startsWith('Repeated ')
                    ? '-'
                    : otherReason === 'Other'
                      ? ''
                      : otherReason
                }
                disabled={otherReason.startsWith('Repeated ')}
                onChange={(event) => setOtherReason(event.currentTarget.value)}
                label="Select Other Reason"
              ></TextInput>
              <Button
                onClick={() => {
                  redCard(game, firstTeam, leftSide, otherReason);
                  close();
                }}
                style={{ margin: '3px' }}
                size="sm"
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
        <Tabs defaultValue="Merit">
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
          <Tabs.Panel value="Merit">
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
                merit(game, firstTeam, leftSide, otherReason);
                close();
              }}
              m={5}
              size="sm"
              color="player-color"
            >
              Submit
            </Button>
          </Tabs.Panel>
          <Tabs.Panel value="Demerit">
            <Autocomplete
              label="Select Reason"
              placeholder="Write something or pick from the list"
              data={['Nefarious Laugh', 'Devious Joke', 'Sinister Rage Bait', 'Abominable Play']}
              onChange={setOtherReason}
            ></Autocomplete>
            <Button
              onClick={() => {
                demerit(game, firstTeam, leftSide, otherReason);
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
    out = otherPlayers.map((a) => ({
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
    }));
  } else if (!game.ended.get) {
    out.splice(0, 0, {
      Icon: IconBallTennis,
      value: 'Score',
      color: undefined,
      content: (
        <>
          {GAME_CONFIG.scoreMethods.slice(0, 3).map((method, i) => (
            <Fragment key={i}>
              <Button
                color="player-color"
                style={{ margin: '3px' }}
                size="sm"
                onClick={() => {
                  score(game, firstTeam, leftSide, method);
                  close();
                }}
              >
                {method}
              </Button>
              <br />
            </Fragment>
          ))}
          <Box>
            <Button
              style={{ margin: '3px' }}
              color="gray"
              onClick={() => setOpenModal(openModal ? undefined : 'score')}
            >
              Show {openModal ? 'Less' : 'More'}
            </Button>

            <Collapse in={openModal === 'score'}>
              {GAME_CONFIG.scoreMethods.slice(3).map((method, i) => (
                <Fragment key={i}>
                  <Button
                    style={{ margin: '3px' }}
                    size="sm"
                    color="player-color"
                    onClick={() => {
                      score(game, firstTeam, leftSide, method);
                      close();
                    }}
                  >
                    {method}
                  </Button>
                  <br />
                </Fragment>
              ))}
            </Collapse>
          </Box>
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
            color="player-color"
            size="sm"
            style={{ margin: '3px' }}
            onClick={() => {
              sub(game, firstTeam, leftSide);
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
        value: 'Serving Actions',
        color: undefined,
        content: (
          <>
            <Button
              color="player-color"
              style={{ margin: '3px' }}
              size="sm"
              onClick={() => {
                ace(game);
                close();
              }}
            >
              Ace
            </Button>
            <br />
            <Button
              color="player-color"
              style={{ margin: '3px' }}
              size="sm"
              onClick={() => {
                fault(game);
                close();
              }}
            >
              Fault
            </Button>
          </>
        ),
      });
    }
  }
  return (
    <Accordion defaultValue="Score" onChange={() => setOpenModal(undefined)}>
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
