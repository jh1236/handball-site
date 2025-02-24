import React, { ForwardRefExoticComponent, useMemo, useState } from 'react';
import {
  IconArrowsLeftRight,
  IconArrowsUpDown,
  IconBallTennis,
  IconCircleFilled,
  IconExclamationMark,
  IconPlayHandball,
  IconSquareFilled,
  IconTriangleInvertedFilled,
  IconTrophy,
} from '@tabler/icons-react';
import {
  Accordion,
  Box,
  Button,
  Collapse,
  Modal,
  Progress,
  Select,
  Slider,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { makeUnique } from '@/components/HandballComponenets/GameCreatingComponents/CreateTeamButton';
import {
  ace,
  fault,
  GameState,
  greenCard,
  redCard,
  score,
  sub,
  warning,
  yellowCard,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

interface PlayerButtonProps {
  game: GameState;
  leftSide: boolean;
  firstTeam: boolean;
}

const SCORE_METHODS = [
  'Double Bounce',
  'Straight',
  'Out of Court',
  'Double Touch',
  'Grabs',
  'Illegal Body Part',
  'Obstruction',
];

const CARDS = {
  warning: [
    'Audible Swearing',
    'Delay of Game',
    'Missed Post-game Handshake',
    'Unreasonable Carry',
  ],
  green: [
    'Disrespect',
    'Audible Swearing',
    'Dangerous Play (James)',
    'Deliberate Delay of Game',
    'Hindering another Player',
    'Inappropriate Uniform',
  ],
  yellow: [
    'Continuous Disrespect',
    'Equipment Abuse',
    'Aggressive Play (James)',
    'Misconduct Whilst Carded',
    'Displays of Aggression',
    'Trying to circumvent swearing rules',
    'Egregiously Inappropriate Uniform',
  ],
  red: [
    'Violence',
    'Disruptive Disrespect',
    'Violent Equipment Abuse',
    'Accusations Of Cheating',
    'Discrimination',
  ],
};

function buttonEnabledFor(player: PlayerGameStatsStructure, reason: string, type: string): boolean {
  if (!player) return true;
  const cards = player.prevCards!;
  const prevCard = cards.find((i) => i.eventType === type && i.notes === reason);
  return prevCard === undefined;
}

export type AccordionSettings = {
  Icon: ForwardRefExoticComponent<any>;
  value: string;
  title?: string | React.JSX.Element;
  color: string | undefined;
  content: React.JSX.Element;
};

function getActions(
  game: GameState,
  firstTeam: boolean,
  leftSide: boolean,
  serving: boolean,
  closeIn: () => void,
  cardTime: number,
  setCardTime: (v: number) => void,
  openModal: string | undefined,
  setOpenModal: (v: undefined | 'green' | 'yellow' | 'red' | 'score' | 'warning') => void,
  otherReason: string,
  setOtherReason: (v: string) => void
): AccordionSettings[] {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const allPlayers = [
    game.teamOne.left,
    game.teamOne.right,
    game.teamOne.sub,
    game.teamTwo.left,
    game.teamTwo.right,
    game.teamTwo.sub,
  ].filter((a) => typeof a.get !== 'undefined');
  const players = [team.left, team.right, team.sub].filter((a) => typeof a.get !== 'undefined');
  const currentPlayer = players.length > 1 ? players[leftSide ? 0 : 1] : players[0];
  const close = () => {
    closeIn();
    setCardTime(6);
    setOpenModal(undefined);
    setOtherReason('');
  };
  if (!currentPlayer?.get) return [];
  const out: AccordionSettings[] = [
    {
      Icon: IconExclamationMark,
      value: 'Warning',
      color: 'grey',
      content: (
        <>
          {CARDS.warning.map((reason) => (
            <>
              <Button
                style={{ margin: '3px' }}
                size="sm"
                disabled={!buttonEnabledFor(currentPlayer.get!, reason, 'Warning')}
                onClick={() => {
                  warning(game, firstTeam, leftSide, reason);
                  close();
                }}
              >
                {reason}
              </Button>
              <br />
            </>
          ))}
          <Button
            onClick={() => setOpenModal('warning')}
            style={{ margin: '3px' }}
            size="sm"
            color="gray"
          >
            More
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
              color="blue"
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
          {CARDS.green.map((reason) => (
            <>
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
            </>
          ))}
          <Button
            onClick={() => setOpenModal('green')}
            style={{ margin: '3px' }}
            size="sm"
            color="gray"
          >
            More
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
              data={CARDS.warning.concat('Other').map((a) => ({
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
          {CARDS.yellow.map((reason) => (
            <>
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
            </>
          ))}
          <Button
            onClick={() => setOpenModal('yellow')}
            style={{ margin: '3px' }}
            size="sm"
            color="gray"
          >
            More
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
              data={makeUnique(CARDS.warning.concat(CARDS.green))
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
            defaultValue={6}
            min={6}
            max={12}
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
          {CARDS.red.map((reason) => (
            <>
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
            </>
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
              data={makeUnique(CARDS.warning.concat(CARDS.green).concat(CARDS.yellow)).concat(
                'Other'
              )}
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
    return otherPlayers.map((a) => ({
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
  }
  if (game.ended.get) {
    out.splice(0, 0, {
      Icon: IconTrophy,
      value: 'Set Best Player',
      color: undefined,
      content: (
        <Button
          color={currentPlayer.get?.isBestPlayer ? 'orange' : 'blue'}
          size="lg"
          onClick={() => {
            allPlayers.forEach((p) => {
              const t = p.get!;
              t.isBestPlayer = t.searchableName === currentPlayer?.get?.searchableName;
              p.set(t);
            });
            close();
          }}
        >
          Best
        </Button>
      ),
    });
    return out;
  }
  out.splice(0, 0, {
    Icon: IconBallTennis,
    value: 'Score',
    color: undefined,
    content: (
      <>
        {SCORE_METHODS.slice(0, 3).map((method) => (
          <>
            <Button
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
          </>
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
            {SCORE_METHODS.slice(3).map((method) => (
              <>
                <Button
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
              </>
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

  return out;
}

export function PlayerButton({
  game,
  firstTeam: trueFirstTeam,
  leftSide: trueLeftSide,
}: PlayerButtonProps) {
  const firstTeam = useMemo(
    () => trueFirstTeam === game.teamOneIGA.get,
    [game.teamOneIGA.get, trueFirstTeam]
  );
  const [cardTime, setCardTime] = React.useState<number>(6);
  const [otherReason, setOtherReason] = React.useState<string>('');
  const team = useMemo(
    () => (firstTeam ? game.teamOne : game.teamTwo),
    [firstTeam, game.teamOne, game.teamTwo]
  );
  const [openModal, setOpenModal] = useState<
    undefined | 'green' | 'yellow' | 'red' | 'score' | 'warning'
  >(undefined);
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
    if (game.ended.get) {
      return trueLeftSide ? team.left.get : team.right.get;
    }
    const cardedTeammates = [team.left.get, team.right.get].filter(
      (a) => a?.cardTimeRemaining !== 0
    );
    const uncardedTeammates = [team.left.get, team.right.get].filter(
      (a) => a?.cardTimeRemaining === 0
    );
    if (cardedTeammates.length !== 0) {
      if (game.servingFromLeft === trueLeftSide) {
        return uncardedTeammates[0];
      }
      return cardedTeammates[0];
    }
    return trueLeftSide ? team.left.get : team.right.get;
  }, [
    team.right.get,
    team.left.get,
    game.ended.get,
    game.teamOne.servingFromLeft,
    game.teamTwo.servingFromLeft,
    trueLeftSide,
  ]);
  const leftSide = useMemo(
    () => (game.ended.get ? trueLeftSide : player?.sideOfCourt === 'Left'),
    [game.ended.get, player?.sideOfCourt, trueLeftSide]
  );
  const [opened, { open, close }] = useDisclosure(false);
  const items = useMemo(
    () =>
      getActions(
        game,
        firstTeam,
        game.started.get ? leftSide : trueLeftSide,
        serving,
        close,
        cardTime,
        setCardTime,
        openModal,
        setOpenModal,
        otherReason,
        setOtherReason
      ).map((item, i) => (
        <Accordion.Item key={i} value={item.value}>
          <Accordion.Control icon={<item.Icon color={item.color}></item.Icon>}>
            {item.value}
          </Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      )),
    [cardTime, close, firstTeam, game, leftSide, serving, trueLeftSide]
  );
  const name = player ? (player.isCaptain ? `${player.name} (c)` : player.name) : 'Loading...';
  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title> {player?.name ?? 'Placeholder'}</Title>
        <Accordion defaultValue="Score" onChange={() => setOpenModal(undefined)}>
          {items}
        </Accordion>
      </Modal>
      <Button
        size="lg"
        radius={0}
        color={`${player?.isBestPlayer && game.ended.get ? 'yellow' : serving ? 'teal' : 'blue'}.${trueLeftSide ? 7 : 9}`}
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
        {(!team.left.get || !team.right.get) && (game.servingFromLeft ? ' (Left)' : ' (Right)')}
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
    </>
  );
}
