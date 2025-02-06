import Link from 'next/link';
import {
  IconAlertTriangle,
  IconArrowsLeftRight,
  IconBallTennis,
  IconBallVolleyball,
  IconBounceRightFilled,
  IconCheckbox,
  IconCircleFilled, IconDeviceTv,
  IconExclamationMark,
  IconFilePencil,
  IconFlagCheck,
  IconFlagFilled,
  IconHandGrab,
  IconNote,
  IconPlayHandball,
  IconShieldCheckered,
  IconShoe,
  IconSquare1,
  IconSquare2,
  IconSquareFilled,
  IconStopwatch,
  IconTimeline,
  IconTriangleInvertedFilled,
} from '@tabler/icons-react';
import { GiTennisCourt } from 'react-icons/gi';
import { PiHandshakeFill } from 'react-icons/pi';
import { Accordion, Button, Center, Divider, Rating, Text, Timeline, Title } from '@mantine/core';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import { isUmpireManager } from '@/components/HandballComponenets/ServerActions';
import { resolveGame } from '@/ServerActions/GameActions';
import { GameEventStructure, GameStructure } from '@/ServerActions/types';

interface AdminGamePanelProps {
  game: GameStructure;
}

const RESOLVED_STATUSES = [
  'Resolved',
  'In Progress',
  'Official',
  'Ended',
  'Waiting for Start',
  'Forfeit',
  undefined,
];

const eventIcon = (e: GameEventStructure) => {
  switch (e.eventType) {
    case 'Ace':
      return <IconBallVolleyball color="white" />;
    case 'Timeout':
      return <IconStopwatch color="white" />;
    case 'Resolve':
      return <IconCheckbox color="green" />;
    case 'End Game':
      return <IconShieldCheckered color="white" />;
    case 'Forfeit':
      return <IconFlagFilled color="red" />;
    case 'Protest':
      return <IconAlertTriangle color="yellow" />;
    case 'Start':
      return <IconFlagCheck color="white" />;
    case 'Score':
      switch (e.notes) {
        case 'Double Bounce':
          return <IconBounceRightFilled color="white" />;
        case 'Straight':
          return <IconBallTennis color="white" />;
        case 'Out of Court':
          return <GiTennisCourt color="white" />;
        case 'Double Touch':
          return <IconHandGrab color="white" />;
        case 'Grabs':
          return <PiHandshakeFill color="white" />;
        case 'Illegal Body Part':
          return <IconShoe color="white" />;
        case 'Obstruction':
          return <IconBallTennis color="white" />;
      }
      return <IconBallTennis color="white" />;
    case 'Fault':
      return <IconPlayHandball color="white" />;
    case 'Substitute':
      return <IconArrowsLeftRight color="white" />;
    case 'Warning':
      return <IconExclamationMark color="grey" />;
    case 'Green Card':
      return <IconTriangleInvertedFilled color="green" />;
    case 'Yellow Card':
      return <IconSquareFilled color="yellow" size="lg" />;
    case 'Red Card':
      return <IconCircleFilled color="red" />;
  }
  return null;
};

const cardColor = (e: GameEventStructure) => e.eventType.toLowerCase().replace(' Card', '');

export function AdminGamePanel({ game }: AdminGamePanelProps) {
  return (
    <Accordion>
      <Accordion.Item value="edit">
        <Accordion.Control icon={<IconFilePencil />}>Edit Game</Accordion.Control>
        <Accordion.Panel>
          <Link href={`/games/${game.id}/edit`} className="hideLink">
            <Button>Edit Game</Button>
          </Link>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="display">
        <Accordion.Control icon={<IconDeviceTv />}>Game Scoreboard</Accordion.Control>
        <Accordion.Panel>
          <Link href={`/games/${game.id}/scoreboard`} className="hideLink">
            <Button>Display Game</Button>
          </Link>
        </Accordion.Panel>
      </Accordion.Item>
      {isUmpireManager() && (
        <>
          <Accordion.Item value="resolve">
            <Accordion.Control icon={<IconCheckbox />}>Resolve</Accordion.Control>
            <Accordion.Panel>
              <Button
                disabled={RESOLVED_STATUSES.includes(game.status)}
                onClick={() => {
                  resolveGame(game.id).then(() => location.reload());
                }}
              >
                Resolve
              </Button>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="notes">
            <Accordion.Control icon={<IconNote />}>Notes</Accordion.Control>
            <Accordion.Panel>
              {!game.admin?.notes &&
                (!game.ended ? (
                  <Text>
                    <i>Notes can not be left until the game is completed</i>
                  </Text>
                ) : (
                  <Text>
                    <i>No notes have been left for this game</i>
                  </Text>
                ))}
              <Text>{game.admin?.notes}</Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="teamOne">
            <Accordion.Control icon={<IconSquare1 />}>Team One</Accordion.Control>
            <Accordion.Panel>
              <Title order={3}>Rating</Title>
              <Center>
                <Rating value={game.admin?.teamOneRating} readOnly size="lg"></Rating>
              </Center>
              {FEEDBACK_TEXTS[game.admin?.teamOneRating ?? 0]}
              <Divider></Divider>
              <Title order={3}>Cards</Title>
              {game.admin?.cards.filter((a) => a.firstTeam).length === 0 && (
                <Text>
                  <i>No cards were awarded to {game.teamOne.name} for this game</i>
                </Text>
              )}
              {game.admin?.cards
                ?.filter((a) => a.firstTeam)
                .map((card, i) => (
                  <Text c="dimmed" size="sm" key={i}>
                    <strong color={cardColor(card)}>{card.eventType}</strong> to{' '}
                    <strong>{card.player.name}</strong> for <i>{card.notes}</i>
                  </Text>
                ))}
              <Divider></Divider>
              <Title order={3}>Notes</Title>
              {!game.admin?.teamOneNotes &&
                (!game.ended ? (
                  <Text>
                    <i>Notes can not be left until the game is completed</i>
                  </Text>
                ) : (
                  <Text>
                    <i>No notes have been left for this team</i>
                  </Text>
                ))}
              <Text>{game.admin?.teamOneNotes}</Text>
              <Divider></Divider>
              <Title order={3}>Protest</Title>
              {!game.admin?.teamOneProtest &&
                (!game.ended ? (
                  <Text>
                    <i>Notes can not be left until the game is completed</i>
                  </Text>
                ) : (
                  <Text>
                    <i>This team did not opt to protest</i>
                  </Text>
                ))}
              <Text>{game.admin?.teamOneProtest}</Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="teamTwo">
            <Accordion.Control icon={<IconSquare2 />}>Team Two</Accordion.Control>
            <Accordion.Panel>
              <Title order={3}>Rating</Title>
              <Center>
                <Rating value={game.admin?.teamTwoRating} readOnly size="lg"></Rating>
              </Center>
              {FEEDBACK_TEXTS[game.admin?.teamTwoRating ?? 0]}
              <Divider></Divider>
              <Title order={3}>Cards</Title>
              {game.admin?.cards.filter((a) => !a.firstTeam).length === 0 && (
                <Text>
                  <i>No cards were awarded to {game.teamTwo.name} for this game</i>
                </Text>
              )}
              {game.admin?.cards
                ?.filter((a) => !a.firstTeam)
                .map((card, i) => (
                  <Text size="sm" key={i}>
                    <strong>{card.eventType}</strong> to <strong>{card.player.name}</strong> for{' '}
                    <i>{card.notes}</i>
                  </Text>
                ))}
              <Divider></Divider>
              <Title order={3}>Notes</Title>
              {!game.admin?.teamTwoNotes &&
                (!game.ended ? (
                  <Text>
                    <i>Notes can not be left until the game is completed</i>
                  </Text>
                ) : (
                  <Text>
                    <i>No notes have been left for this team</i>
                  </Text>
                ))}
              <Text>{game.admin?.teamTwoNotes}</Text>
              <Divider></Divider>
              <Title order={3}>Protest</Title>
              {!game.admin?.teamTwoProtest &&
                (!game.ended ? (
                  <Text>
                    <i>Notes can not be left until the game is completed</i>
                  </Text>
                ) : (
                  <Text>
                    <i>This team did not opt to protest</i>
                  </Text>
                ))}
              <Text>{game.admin?.teamTwoProtest}</Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="cards">
            <Accordion.Control icon={<IconTriangleInvertedFilled />}>Cards</Accordion.Control>
            <Accordion.Panel>
              {(game.admin?.cards?.length ?? 0) === 0 && (
                <Text>
                  <i>No Cards Recorded Yet</i>
                </Text>
              )}
              <Timeline bulletSize={24}>
                {game.admin?.cards?.map((card, i) => (
                  <Timeline.Item
                    key={i}
                    title={`${card.eventType} for ${card.player.name}`}
                    bullet={eventIcon(card)}
                  >
                    <Text c="dimmed" size="sm">
                      <strong>{card.notes}</strong>
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="timeline">
            <Accordion.Control icon={<IconTimeline />}>Timeline</Accordion.Control>
            <Accordion.Panel>
              {(game.events?.length ?? 0) === 0 && (
                <Text>
                  <i>No Events Recorded Yet</i>
                </Text>
              )}
              <Timeline bulletSize={24}>
                {game.events
                  ?.filter(
                    (a) =>
                      a.notes !== 'Penalty' &&
                      (a.notes || a.eventType !== 'Notes') &&
                      a.eventType !== 'End Timeout'
                  )
                  .map((e, i) => (
                    <Timeline.Item
                      key={i}
                      title={`${e.eventType} ${e.player ? `for ${e.player.name}` : e.firstTeam !== null ? `for ${e.firstTeam ? game.teamOne.name : game.teamTwo.name}` : ''}`}
                      bullet={eventIcon(e)}
                    >
                      <Text c="dimmed" size="sm">
                        <strong>{e.notes ?? ''}</strong>
                      </Text>
                    </Timeline.Item>
                  ))}
              </Timeline>
            </Accordion.Panel>
          </Accordion.Item>
        </>
      )}
    </Accordion>
  );
}
