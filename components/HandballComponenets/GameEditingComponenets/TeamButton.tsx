import React, { useMemo } from 'react';
import {
  IconAlertTriangle,
  IconArrowsUpDown,
  IconBallTennis,
  IconClock,
  IconFlagFilled,
  IconNote,
  IconQuestionMark,
  IconTrophy,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import {
  Accordion,
  Button,
  List,
  Modal,
  Popover,
  Rating,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { markIfReqd } from '@/components/HandballComponenets/AdminGamePanel';
import {
  forfeit,
  timeout,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { AccordionSettings } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton';
import {
  decidedOnCoinToss,
  didWinGame,
} from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { GameState } from '@/components/HandballComponenets/GameState';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

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

function getActions(
  game: GameState,
  firstTeam: boolean,
  serving: boolean,
  close: () => void
): AccordionSettings[] {
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const players = [team.left.get, team.right.get, team.sub.get].filter(
    (a) => typeof a !== 'undefined'
  );
  const captain = players.filter((a) => a?.isCaptain)[0];

  function getSide(a: PlayerGameStatsStructure) {
    if (a.startSide) return a.startSide;
    if (a.searchableName === team.left.get?.searchableName) return 'Left';
    if (a.searchableName === team.right.get?.searchableName) return 'Right';
    return 'Substitute';
  }

  const out: AccordionSettings[] = captain
    ? [
        {
          Icon: IconUsersGroup,
          color: undefined,
          value: 'Team Lineup',
          content: (
            <>
              <Text>The team line up is:</Text>
              <List icon={<IconUser></IconUser>}>
                <List.Item>
                  <strong>Captain: </strong> {captain?.name} <i>(Started {getSide(captain)})</i>
                </List.Item>
                {players
                  .filter((a) => !a.isCaptain)
                  .map((a, i) => (
                    <List.Item key={i}>
                      <strong>Team Mate: </strong> {a.name} <i>(Started {getSide(a)})</i>
                    </List.Item>
                  ))}
              </List>
            </>
          ),
        },
      ]
    : [];

  if (!game.started.get) {
    out.splice(
      1,
      0,
      {
        color: undefined,
        Icon: IconArrowsUpDown,
        value: 'Swap Sides',
        content: (
          <Button
            size="lg"
            onClick={() => {
              game.teamOneIGA.set(!game.teamOneIGA?.get);
              close();
            }}
          >
            Swap
          </Button>
        ),
      },
      {
        color: undefined,
        Icon: IconBallTennis,
        value: serving ? 'Set Not Serving' : 'Set Serving',
        content: (
          <Button
            size="lg"
            onClick={() => {
              game.firstTeamServes.set(!game.firstTeamServes.get);
              close();
            }}
          >
            Swap Service
          </Button>
        ),
      }
    );
    return out;
  }
  if (game.ended.get) {
    out.splice(
      1,
      0,
      {
        Icon: IconAlertTriangle,
        value: 'Protest reason',
        color: 'yellow',
        content: (
          <Textarea
            value={team.protest.get}
            onChange={(v) => team.protest.set(v.currentTarget.value)}
          ></Textarea>
        ),
      },
      {
        Icon: IconNote,
        value: 'Feedback',
        title: markIfReqd(team.rating.get === 1 || !team.rating.get, 'Feedback'),
        color: undefined,
        content: (
          <>
            <Rating value={team.rating.get} count={4} size="lg" onChange={team.rating.set}></Rating>
            {FEEDBACK_TEXTS[team.rating.get]}
            <Textarea
              value={team.notes.get}
              onChange={(v) => team.notes.set(v.currentTarget.value)}
            ></Textarea>
          </>
        ),
      }
    );
    return out;
  }
  const timeoutsRemaining = 1 - team.timeouts.get;
  out.splice(
    1,
    0,
    {
      Icon: IconClock,
      value: `Timeout (${timeoutsRemaining} remaining)`,
      color: timeoutsRemaining > 0 ? undefined : 'grey',
      content: (
        <Button
          size="lg"
          color={timeoutsRemaining > 0 ? 'blue' : timeoutsRemaining === 0 ? 'grey' : 'red'}
          onClick={() => {
            timeout(game, firstTeam);
            close();
          }}
        >
          Timeout
        </Button>
      ),
    },
    {
      Icon: IconFlagFilled,
      value: 'Forfeit',
      color: 'red',
      content: (
        <Popover width={200} position="top" withArrow shadow="md">
          <Popover.Target>
            <Button size="lg" color="red">
              <strong>Forfeit</strong>
            </Button>
          </Popover.Target>
          <Popover.Dropdown ta="center">
            <Text m={5}>Are you sure you want to forfeit?</Text>
            <Button
              m={5}
              color="red"
              onClick={() => {
                forfeit(game, firstTeam);
                close();
              }}
            >
              Confirm
            </Button>
          </Popover.Dropdown>
        </Popover>
      ),
    }
  );
  return out;
}

export function TeamButton({ game, firstTeam: trueFirstTeam }: TeamButtonProps) {
  const firstTeam = trueFirstTeam === game.teamOneIGA.get;
  const team = useMemo(
    () => (firstTeam ? game.teamOne : game.teamTwo),
    [firstTeam, game.teamOne, game.teamTwo]
  );
  const otherTeam = useMemo(
    () => (firstTeam ? game.teamTwo : game.teamOne),
    [firstTeam, game.teamOne, game.teamTwo]
  );
  const serving = useMemo(
    () => !game.ended.get && game.firstTeamServes.get === firstTeam,
    [firstTeam, game.ended.get, game.firstTeamServes.get]
  );
  const [opened, { open, close }] = useDisclosure(false);

  const items = useMemo(
    () =>
      getActions(game, firstTeam, serving, close).map((item, i) => (
        <Accordion.Item key={i} value={item.value}>
          <Accordion.Control icon={<item.Icon color={item.color}></item.Icon>}>
            {item.title ?? item.value}
          </Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      )),
    [game, firstTeam, serving, close]
  );
  const name = team ? team.name.get : 'Loading...';
  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title> {name}</Title>
        <Accordion defaultValue="Score">{items}</Accordion>
      </Modal>
      <Button
        radius={0}
        size="lg"
        color={`${didWinGame(game, firstTeam) ? 'orange.5' : decidedOnCoinToss(game) ? 'green.9' : serving ? 'teal.5' : 'blue.5'}`}
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
