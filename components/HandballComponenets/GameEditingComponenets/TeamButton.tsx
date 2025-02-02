import { useMemo } from 'react';
import {
  IconAlertTriangle,
  IconArrowsUpDown,
  IconBallTennis,
  IconClock,
  IconNote,
  IconNotes,
  IconTrophy,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { Accordion, Button, List, Modal, Text, Textarea, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  GameState,
  timeout,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

interface TeamButtonProps {
  game: GameState;
  firstTeam: boolean;
}

function getActions(game: GameState, firstTeam: boolean, serving: boolean, close: () => void) {
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

  const out = captain
    ? [
        {
          Icon: IconUsersGroup,
          value: 'Team Lineup',
          color: 'white',
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
        Icon: IconArrowsUpDown,
        value: 'Swap Sides',
        color: 'white',
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
        Icon: IconBallTennis,
        value: serving ? 'Set Not Serving' : 'Set Serving',
        color: 'white',
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
    const allPlayers = [
      game.teamOne.left,
      game.teamOne.right,
      game.teamOne.sub,
      game.teamTwo.left,
      game.teamTwo.right,
      game.teamTwo.sub,
    ].filter((a) => typeof a.get !== 'undefined');
    if (team.sub.get) {
      out.splice(1, 0, {
        Icon: IconTrophy,
        value: `Set ${team.sub.get.name} as Best Player`,
        color: 'white',
        content: (
          <Button
            color={team.sub.get?.isBestPlayer ? 'orange' : 'blue'}
            size="lg"
            onClick={() => {
              allPlayers.forEach((p) => {
                const t = p.get!;
                t.isBestPlayer = t.searchableName === team.sub?.get?.searchableName;
                p.set(t);
              });
              close();
            }}
          >
            Best
          </Button>
        ),
      });
    }
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
        value: 'Notes',
        color: 'white',
        content: <Textarea
          value={team.notes.get}
          onChange={(v) => team.notes.set(v.currentTarget.value)}
        ></Textarea>,
      }
    );
    return out;
  }
  const timeoutsRemaining = 1 - team.timeouts.get;
  out.splice(1, 0, {
    Icon: IconClock,
    value: `Timeout (${timeoutsRemaining} remaining)`,
    color: timeoutsRemaining > 0 ? 'white' : 'grey',
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
  });
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
          <Accordion.Control>
            <item.Icon color={item.color}></item.Icon>
            {item.value}
          </Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      )),
    [game, firstTeam, serving, close]
  );
  const name = team ? team.name : 'Loading...';
  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title> {name}</Title>
        <Accordion defaultValue="Score">{items}</Accordion>
      </Modal>
      <Button
        radius={0}
        size="lg"
        color={`${game.ended.get && team.score.get > otherTeam.score.get ? 'orange' : serving ? 'teal' : 'blue'}.5`}
        style={{
          width: '100%',
          height: '100%',
          fontWeight: serving ? 'bold' : 'normal',
        }}
        onClick={open}
      >
        <b>
          {name} ({(game.teamOneIGA?.get ?? true) === firstTeam ? 'IGA' : 'Stairs'}){' '}
          {game.ended.get && team.score.get > otherTeam.score.get && <IconTrophy></IconTrophy>}
        </b>
      </Button>
    </>
  );
}
