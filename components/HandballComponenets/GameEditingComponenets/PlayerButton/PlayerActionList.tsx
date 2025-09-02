import React, { Fragment, useCallback, useState } from 'react';
import {
  IconArrowsLeftRight,
  IconArrowsUpDown,
  IconBallTennis,
  IconCircleFilled,
  IconExclamationMark,
  IconPlayHandball,
  IconSquareFilled,
  IconStarFilled,
  IconTriangleInvertedFilled,
} from '@tabler/icons-react';
import {
  Accordion,
  Box,
  Button,
  Collapse,
  Modal,
  Select,
  Slider,
  TextInput,
  Title,
} from '@mantine/core';
import { makeUnique } from '@/components/HandballComponenets/GameCreatingComponents/CreateTeamButton';
import {
  ace,
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
  const [openModal, setOpenModal] = useState<
    undefined | 'green' | 'yellow' | 'red' | 'score' | 'warning'
  >(undefined);
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const players = [team.left, team.right, team.sub].filter((a) => typeof a.get !== 'undefined');
  const currentPlayer = players.length > 1 ? players[leftSide ? 0 : 1] : players[0];
  if (!currentPlayer?.get) return <></>;
  let out: AccordionSettings[] = [
    {
      Icon: IconStarFilled,
      value: 'Merit',
      color: '#3262a8',
      content: (
        <>
          <TextInput
            value={otherReason}
            onChange={(event) => setOtherReason(event.currentTarget.value)}
            label="Explain briefly what happened"
          ></TextInput>
          <Button
            onClick={() => {
              merit(game, firstTeam, leftSide, otherReason);
              close();
            }}
            style={{ margin: '3px' }}
            size="sm"
            disabled={!otherReason}
            color="player-color"
          >
            Submit
          </Button>
        </>
      ),
    },
    {
      Icon: IconExclamationMark,
      value: 'Warning',
      color: 'grey',
      content: (
        <>
          {GAME_CONFIG.cards.warning.map((reason, i) => (
            <Fragment key={i}>
              <Button
                style={{ margin: '3px' }}
                size="sm"
                color="gray.6"
                disabled={!buttonEnabledFor(currentPlayer.get!, reason, 'Warning')}
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
        </>
      ),
    },
    {
      Icon: IconTriangleInvertedFilled,
      color: 'green',
      value: 'Green Card',
      content: (
        <>
          {GAME_CONFIG.cards.green.map((reason, i) => (
            <Fragment key={i}>
              <Button
                style={{ margin: '3px' }}
                size="sm"
                disabled={!buttonEnabledFor(currentPlayer.get!, reason, 'Green Card')}
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
                disabled: !buttonEnabledFor(currentPlayer.get!, `Repeated ${a}`, 'Green Card'),
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
        </>
      ),
    },
    {
      Icon: IconSquareFilled,
      color: 'yellow',
      value: 'Yellow Card',
      content: (
        <Box>
          {GAME_CONFIG.cards.yellow.map((reason, i) => (
            <Fragment key={i}>
              <Button
                style={{ margin: '3px' }}
                size="sm"
                disabled={!buttonEnabledFor(currentPlayer.get!, reason, 'Yellow Card')}
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
                  disabled: !buttonEnabledFor(currentPlayer.get!, `Repeated ${a}`, 'Yellow Card'),
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
          <Title order={2}>Rounds: </Title>
          <Slider
            min={game.blitzGame ? 3 : 6}
            max={game.blitzGame ? 9 : 12}
            step={1}
            value={cardTime}
            onChange={(value) => setCardTime(value)}
          />
        </Box>
      ),
    },
    {
      Icon: IconCircleFilled,
      color: 'red',
      value: 'Red Card',
      content: (
        <>
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
            Repeat Offence
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
        </>
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
    if (team.sub.get && game.teamOne.score.get + game.teamTwo.score.get < 9) {
      out.splice(1, 0, {
        Icon: IconArrowsLeftRight,
        value: `Substitute (${9 - (game.teamOne.score.get + game.teamTwo.score.get)} points remaining)`,
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
