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
import { AccordionSettings } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton/PlayerButton';
import { TeamActionList } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton/TeamActionList';
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

export function TeamButton({ game, firstTeam: trueFirstTeam }: TeamButtonProps) {
  const firstTeam = trueFirstTeam === game.teamOneIGA.get;
  const team = useMemo(
    () => (firstTeam ? game.teamOne : game.teamTwo),
    [firstTeam, game.teamOne, game.teamTwo]
  );
  const serving = useMemo(
    () => !game.ended.get && game.firstTeamServes.get === firstTeam,
    [firstTeam, game.ended.get, game.firstTeamServes.get]
  );
  const [opened, { open, close }] = useDisclosure(false);

  const name = team ? team.name.get : 'Loading...';
  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title> {name}</Title>
        <TeamActionList
          game={game}
          firstTeam={firstTeam}
          serving={serving}
          close={close}
        ></TeamActionList>
      </Modal>
      <Button
        radius={0}
        size="lg"
        color={`${didWinGame(game, firstTeam) ? 'orange.5' : decidedOnCoinToss(game) ? 'green.9' : serving ? 'serving-color.5' : 'player-color.5'}`}
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
