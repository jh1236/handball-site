import { useMemo } from 'react';
import {
  IconBallTennis,
  IconBallVolleyball,
  IconCircleFilled,
  IconExclamationMark,
  IconSkull,
  IconSquareFilled,
  IconTriangleInvertedFilled,
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
    'Did not follow the end of game process',
    'Unreasonable Carry',
  ],
  green: [
    'Disrespect Towards Officials',
    'Audible Swearing',
    'Dangerous Play (James)',
    'Deliberate Delay of Game',
    'Deliberately Hindering another Player',
    'Not Meeting the Uniform Requirements',
  ],
  yellow: [
    'Continuous Disrespect Towards Officials',
    'Equipment Abuse',
    'Aggressively Dangerous Play (James)',
    'Misconduct Whilst Carded',
    'Displays of Aggression towards Anyone',
    'Trying to get around swearing rules',
  ],
  red: [
    'Violence Towards Any Person',
    'Disruptive Disrespect Towards Officials',
    'Equipment Abuse in a Violent Manner',
    'Accusations Of Cheating',
    'Any Form of Discrimination',
  ],
};

function getActions(
  game: GameState,
  firstTeam: boolean,
  leftSide: boolean,
  serving: boolean,
  close: () => void,
) {
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
          style={{ margin: '5px' }}
          size="lg"
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
          style={{ margin: '5px' }}
          size="lg"
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
              style={{ margin: '5px' }}
              size="lg"
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
          style={{ margin: '5px' }}
          size="lg"
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
      },
    );
  }
  return out;
}

export function PlayerButton({ game, firstTeam, leftSide }: PlayerButtonProps) {
  const player = useMemo(() => {
    if (firstTeam) {
      return leftSide ? game.teamOne.left.get : game.teamOne.right.get;
    }
    return leftSide ? game.teamTwo.left.get : game.teamTwo.right.get;
  }, [
    firstTeam,
    leftSide,
    game.teamOne.left.get,
    game.teamOne.right.get,
    game.teamTwo.left.get,
    game.teamTwo.right.get,
  ]);
  const serving = useMemo(
    () => game.servedFromLeft === leftSide && game.firstTeamServes.get === firstTeam,
    [firstTeam, game.firstTeamServes.get, game.servedFromLeft, leftSide],
  );
  const carded = useMemo(() => player?.cardTimeRemaining !== 0, [player]);
  const [opened, { open, close }] = useDisclosure(false);
  const items = useMemo(
    () =>
      getActions(game, firstTeam, leftSide, serving, close).map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control>
            <item.Icon color={item.color}></item.Icon>
            {item.value}
          </Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      )),
    [close, firstTeam, game, leftSide, serving],
  );
  const name = player ? player.name : 'Loading...';
  return (
    <>
      <Modal hiddenFrom="md" opened={opened} centered fullScreen onClose={close} title="Action">
        <Title> {player?.name ?? 'Placeholder'}</Title>
        <Accordion defaultValue="Score">{items}</Accordion>
      </Modal>
      <Modal visibleFrom="md" opened={opened} centered onClose={close} title="Action">
        <Title> {player?.name ?? 'Placeholder'}</Title>
        <Accordion defaultValue="Score">{items}</Accordion>
      </Modal>
      <Button
        size="lg"
        color={`${serving ? 'teal' : 'green'}.${leftSide ? 7 : 9}`}
        style={{
          width: '100%',
          height: carded ? '95%' : '100%',
          fontWeight: serving ? 'bold' : 'normal',
        }}
        onClick={open}
      >
        {carded ? <s>{name}</s> : game.faulted.get && serving ? <i>{name}</i> : name}
      </Button>
      {carded && player && (
        <Progress
          style={{ height: '5%' }}
          color={player!.cardTimeRemaining < 0 ? 'red' : player!.cardTime > 2 ? 'yellow' : 'green'}
          value={100 * (player!.cardTimeRemaining >= 0 ? (player!.cardTimeRemaining / player!.cardTime) : 1)}
        >
        </Progress>
      )}
    </>
  );
}
