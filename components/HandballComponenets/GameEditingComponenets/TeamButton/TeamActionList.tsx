import React from 'react';
import {
  IconAlertTriangle,
  IconArrowsUpDown,
  IconBallTennis,
  IconClock,
  IconFlagFilled,
  IconNote,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { Accordion, Button, List, Popover, Rating, Text, Textarea } from '@mantine/core';
import { markIfReqd } from '@/components/HandballComponenets/AdminGamePanel';
import {
  forfeit,
  timeout,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { AccordionSettings } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton/PlayerButton';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton/TeamButton';
import { GameState } from '@/components/HandballComponenets/GameState';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

interface TeamActionListParams {
  game: GameState;
  firstTeam: boolean;
  serving: boolean;
  close: () => void;
}

export function TeamActionList({
  game,
  firstTeam,
  serving,
  close,
}: TeamActionListParams): React.ReactElement {
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
  } else if (game.ended.get) {
    out.splice(
      1,
      0,
      {
        Icon: IconAlertTriangle,
        value: 'Protest reason',
        color: 'yellow',
        content: (
          <Textarea
            label="Protest Reason"
            error={
              team.protest.get
                ? team.protest.get.split(' ').filter((a) => a.length > 0).length < 3
                  ? 'Protest must contain at least 3 words'
                  : undefined
                : undefined
            }
            value={team.protest.get}
            minRows={4}
            autosize
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
              label="Notes"
              value={team.notes.get}
              minRows={4}
              autosize
              error={
                team.rating.get === 1 &&
                team.notes.get.split(' ').filter((a) => a.length > 0).length < 3
                  ? team.notes.get
                    ? 'Notes must contain at least 3 words'
                    : 'Notes must be provided if review required'
                  : undefined
              }
              onChange={(v) => team.notes.set(v.currentTarget.value)}
            ></Textarea>
          </>
        ),
      }
    );
  } else {
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
            color={
              timeoutsRemaining > 0 ? 'player-color' : timeoutsRemaining === 0 ? 'grey' : 'red'
            }
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
  }
  return (
    <Accordion>
      {out.map((item, i) => (
        <Accordion.Item key={i} value={item.value}>
          <Accordion.Control icon={<item.Icon color={item.color}></item.Icon>}>
            {item.title ?? item.value}
          </Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
