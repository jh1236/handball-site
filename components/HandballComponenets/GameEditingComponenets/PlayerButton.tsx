import React, { useMemo } from 'react';
import {
  IconArrowsLeftRight,
  IconArrowsUpDown,
  IconBallTennis,
  IconBallVolleyball,
  IconCircleFilled,
  IconExclamationMark,
  IconPlayHandball,
  IconSquareFilled,
  IconTriangleInvertedFilled,
  IconTrophy,
} from '@tabler/icons-react';
import { Accordion, Box, Button, Divider, Modal, Progress, Slider, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
  close: () => void,
  cardTime: number,
  setCardTime: (v: number) => void
) {
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
  const currentPlayer = players[leftSide ? 0 : 1];
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
    return [
      {
        Icon: IconTrophy,
        value: 'Set Best Player',
        color: 'white',
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
      },
    ];
  }
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
                yellowCard(game, firstTeam, leftSide, reason, cardTime);
                close();
              }}
            >
              {reason}
            </Button>
          ))}
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
        Icon: IconPlayHandball,
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
  const [cardTime, setCardTime] = React.useState<number>(6);
  const serving = useMemo(
    () =>
      game.started.get &&
      !game.ended.get &&
      game.servedFromLeft === trueLeftSide &&
      game.firstTeamServes.get === firstTeam,
    [
      firstTeam,
      game.ended.get,
      game.firstTeamServes.get,
      game.servedFromLeft,
      game.started.get,
      trueLeftSide,
    ]
  );
  const player = useMemo(() => {
    const team = firstTeam ? game.teamOne : game.teamTwo;
    if (game.ended.get) {
      return trueLeftSide ? team.left.get : team.right.get;
    }
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
  }, [firstTeam, game.teamOne, game.teamTwo, game.ended.get, game.servedFromLeft, trueLeftSide]);
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
        setCardTime
      ).map((item, i) => (
        <Accordion.Item key={i} value={item.value}>
          <Accordion.Control>
            <item.Icon color={item.color}></item.Icon>
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
        <Accordion defaultValue="Score">{items}</Accordion>
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
        )}
      </Button>
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
