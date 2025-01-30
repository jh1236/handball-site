import { useMemo } from 'react';
import {
  IconArrowsLeftRight,
  IconArrowsUpDown,
  IconBallTennis,
  IconBallVolleyball,
  IconCircleFilled,
  IconClock,
  IconExclamationMark,
  IconSkull,
  IconSquareFilled,
  IconTriangleInvertedFilled,
  IconTrophy,
} from '@tabler/icons-react';
import { Accordion, Box, Button, Modal, Progress, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ace,
  fault,
  GameState,
  greenCard,
  redCard,
  score,
  sub,
  timeout,
  warning,
  yellowCard,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { timeoutForGame } from '@/ServerActions/GameActions';

interface PlayerButtonProps {
  game: GameState;
  leftSide: boolean;
  firstTeam: boolean;
}

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
  ],
  red: [
    'Violence',
    'Disruptive Disrespect',
    'Violent Equipment Abuse',
    'Accusations Of Cheating',
    'Discrimination',
  ],
};

function getActions(
  game: GameState,
  firstTeam: boolean,
  leftSide: boolean,
  serving: boolean,
  close: () => void
) {
  if (!game.started.get) {
    const team = firstTeam ? game.teamOne : game.teamTwo;
    let players = [team.left, team.right, team.sub];
    const currentPlayer = players[leftSide ? 0 : 1];
    players = players.filter(
      (a) => a.get && a.get.searchableName !== currentPlayer.get?.searchableName
    );
    return players.map((a) => ({
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
    return [
      {
        Icon: IconTrophy,
        value: 'Set Best Player',
        color: 'white',
        content: (
          <Button
            size="lg"
            onClick={() => {
              score(game, firstTeam, leftSide);
              close();
            }}
          >
            Score
          </Button>
        ),
      },
    ];
  }
  const team = firstTeam ? game.teamOne : game.teamTwo;
  const out = [
    {
      Icon: IconBallTennis,
      value: 'Score',
      color: 'white',
      content: (
        <Button
          size="lg"
          onClick={() => {
            score(game, firstTeam, leftSide);
            close();
          }}
        >
          Score
        </Button>
      ),
    },
    {
      Icon: IconExclamationMark,
      value: 'Warning',
      color: 'grey',
      content: CARDS.warning.map((reason) => (
        <Button
          style={{ margin: '3px' }}
          size="sm"
          onClick={() => {
            warning(game, firstTeam, leftSide, reason);
            close();
          }}
        >
          {reason}
        </Button>
      )),
    },
    {
      Icon: IconTriangleInvertedFilled,
      color: 'green',
      value: 'Green Card',
      content: CARDS.green.map((reason) => (
        <Button
          style={{ margin: '3px' }}
          size="sm"
          onClick={() => {
            greenCard(game, firstTeam, leftSide, reason);
            close();
          }}
        >
          {reason}
        </Button>
      )),
    },
    {
      Icon: IconSquareFilled,
      color: 'yellow',
      value: 'Yellow Card',
      content: (
        <Box>
          {CARDS.yellow.map((reason) => (
            <Button
              style={{ margin: '3px' }}
              size="sm"
              onClick={() => {
                yellowCard(game, firstTeam, leftSide, reason);
                close();
              }}
            >
              {reason}
            </Button>
          ))}
        </Box>
      ),
    },
    {
      Icon: IconCircleFilled,
      color: 'red',
      value: 'Red Card',
      content: CARDS.red.map((reason) => (
        <Button
          style={{ margin: '3px' }}
          size="sm"
          onClick={() => {
            redCard(game, firstTeam, leftSide, reason);
            close();
          }}
        >
          {reason}
        </Button>
      )),
    },
  ];
  if (team.sub.get && game.teamOne.score.get + game.teamTwo.score.get < 9) {
    out.splice(1, 0, {
      Icon: IconArrowsLeftRight,
      value: `Substitute (${9 - (game.teamOne.score.get + game.teamTwo.score.get)} points remaining)`,
      color: 'white',
      content: (
        <Button
          size="lg"
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
    out.splice(
      1,
      0,
      {
        Icon: IconBallVolleyball,
        value: 'Ace',
        color: 'white',
        content: (
          <Button
            size="lg"
            onClick={() => {
              ace(game);
              close();
            }}
          >
            Ace
          </Button>
        ),
      },
      {
        Icon: IconSkull,
        value: 'Fault',
        color: 'white',
        content: (
          <Button
            size="lg"
            onClick={() => {
              fault(game);
              close();
            }}
          >
            Fault
          </Button>
        ),
      }
    );
  }

  return out;
}

export function PlayerButton({
  game,
  firstTeam: trueFirstTeam,
  leftSide: trueLeftSide,
}: PlayerButtonProps) {
  const firstTeam = trueFirstTeam === game.teamOneIGA.get;
  const serving = useMemo(
    () =>
      game.started.get &&
      game.servedFromLeft === trueLeftSide &&
      game.firstTeamServes.get === firstTeam,
    [firstTeam, game.firstTeamServes.get, game.servedFromLeft, game.started.get, trueLeftSide]
  );
  const player = useMemo(() => {
    const team = firstTeam ? game.teamOne : game.teamTwo;
    const cardedTeammates = [team.left.get, team.right.get].filter(
      (a) => a?.cardTimeRemaining !== 0
    );
    const uncardedTeammates = [team.left.get, team.right.get].filter(
      (a) => a?.cardTimeRemaining === 0
    );
    if (cardedTeammates.length) {
      if (game.servedFromLeft === trueLeftSide) {
        return uncardedTeammates[0];
      }
      return cardedTeammates[0];
    }
    return trueLeftSide ? team.left.get : team.right.get;
  }, [firstTeam, game.teamOne, game.teamTwo, game.servedFromLeft, trueLeftSide]);
  const leftSide = useMemo(() => player?.sideOfCourt === 'Left', [player?.sideOfCourt]);
  const [opened, { open, close }] = useDisclosure(false);
  const items = useMemo(
    () =>
      getActions(game, firstTeam, game.started.get ? leftSide : trueLeftSide, serving, close).map(
        (item, i) => (
          <Accordion.Item key={i} value={item.value}>
            <Accordion.Control>
              <item.Icon color={item.color}></item.Icon>
              {item.value}
            </Accordion.Control>
            <Accordion.Panel>{item.content}</Accordion.Panel>
          </Accordion.Item>
        )
      ),
    [close, firstTeam, game, leftSide, serving, trueLeftSide]
  );
  const name = player ? (player.isCaptain ? `${player.name} (c)` : player.name) : 'Loading...';
  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title> {player?.name ?? 'Placeholder'}</Title>
        <Accordion defaultValue="Score">{items}</Accordion>
      </Modal>
      <Button
        size="lg"
        radius={0}
        color={`${serving ? 'teal' : 'blue'}.${trueLeftSide ? 7 : 9}`}
        style={{
          width: '100%',
          height: (player?.cardTimeRemaining ?? 0) !== 0 ? '95%' : '100%',
          fontWeight: serving ? 'bold' : 'normal',
          margin: 0,
        }}
        onClick={open}
      >
        {player?.cardTimeRemaining !== 0 ? (
          <s>{name}</s>
        ) : game.faulted.get && serving ? (
          <i>{name}</i>
        ) : (
          name
        )}
      </Button>
      {player?.cardTimeRemaining !== 0 && player && (
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
