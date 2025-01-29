import { useMemo } from 'react';
import { IconArrowsUpDown, IconBallTennis, IconClock } from '@tabler/icons-react';
import { Accordion, Button, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  GameState,
  timeout,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';

interface TeamButtonProps {
  game: GameState;
  firstTeam: boolean;
}

function getActions(game: GameState, firstTeam: boolean, serving: boolean, close: () => void) {
  if (!game.started.get) {
    return [
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
      },
    ];
  }
  return [
    {
      Icon: IconClock,
      value: 'Timeout',
      color: 'white',
      content: (
        <Button
          size="lg"
          onClick={() => {
            timeout(game, firstTeam);
            close();
          }}
        >
          Timeout
        </Button>
      ),
    },
  ];
}

export function TeamButton({ game, firstTeam: trueFirstTeam }: TeamButtonProps) {
  const firstTeam = trueFirstTeam === game.teamOneIGA.get;
  const team = useMemo(
    () => (firstTeam ? game.teamOne : game.teamTwo),
    [firstTeam, game.teamOne, game.teamTwo]
  );
  const serving = useMemo(
    () => game.firstTeamServes.get === firstTeam,
    [firstTeam, game.firstTeamServes.get]
  );
  const [opened, { open, close }] = useDisclosure(false);
  const items = useMemo(
    () =>
      getActions(game, trueFirstTeam, serving, close).map((item, i) => (
        <Accordion.Item key={i} value={item.value}>
          <Accordion.Control>
            <item.Icon color={item.color}></item.Icon>
            {item.value}
          </Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      )),
    [close, trueFirstTeam, game, serving]
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
        color={`${serving ? 'teal' : 'blue'}.5`}
        style={{
          width: '100%',
          height: '100%',
          fontWeight: serving ? 'bold' : 'normal',
        }}
        onClick={open}
      >
        <b>
          {name} ({(game.teamOneIGA?.get ?? true) === firstTeam ? 'IGA' : 'Stairs'})
        </b>
      </Button>
    </>
  );
}
