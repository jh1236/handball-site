import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconAlertTriangle,
  IconArrowsLeftRight,
  IconBallTennis,
  IconBallVolleyball,
  IconBounceRightFilled,
  IconCheckbox,
  IconCircleFilled,
  IconDeviceTv,
  IconExclamationMark,
  IconFilePencil,
  IconFlagCheck,
  IconFlagFilled,
  IconHandGrab,
  IconNote,
  IconPlayHandball,
  IconShoe,
  IconSquare,
  IconSquare1,
  IconSquare2,
  IconSquareFilled,
  IconStopwatch,
  IconTimeline,
  IconTriangleInvertedFilled,
} from '@tabler/icons-react';
import { GiTennisCourt } from 'react-icons/gi';
import { PiFlagCheckeredFill, PiHandshakeFill } from 'react-icons/pi';
import {
  Accordion,
  Button,
  Center,
  Divider,
  Group,
  Popover,
  Rating,
  Text,
  Timeline,
  Title,
} from '@mantine/core';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import {
  deleteGame,
  endGame,
  forfeitGame,
  resolveGame,
  startGame,
} from '@/ServerActions/GameActions';
import { CardStructure, GameEventStructure, GameStructure } from '@/ServerActions/types';

interface AdminGamePanelProps {
  game: GameStructure;
}

export const markIfReqd = (b: boolean, s: string) =>
  b ? (
    <strong>
      {s}
      <strong style={{ color: 'red' }}>*</strong>
    </strong>
  ) : (
    s
  );

const RESOLVED_STATUSES = [
  'Resolved',
  'In Progress',
  'Official',
  'Ended',
  'Waiting for Start',
  'Forfeit',
  undefined,
];

export const eventIcon = (e: CardStructure) => {
  switch (e.eventType) {
    case 'Timeout':
      return <IconStopwatch />;
    case 'Resolve':
      return <IconCheckbox color="green" />;
    case 'End Game':
      return <PiFlagCheckeredFill />;
    case 'Forfeit':
      return <IconFlagFilled color="red" />;
    case 'Notes':
      return <IconNote />;
    case 'Protest':
      return <IconAlertTriangle color="yellow" />;
    case 'Start':
      return <IconFlagCheck />;
    case 'Score':
      switch (e.notes) {
        case 'Ace':
          return <IconBallVolleyball />;
        case 'Double Bounce':
          return <IconBounceRightFilled />;
        case 'Straight':
          return <IconBallTennis />;
        case 'Out of Court':
          return <GiTennisCourt />;
        case 'Double Touch':
          return <IconHandGrab />;
        case 'Grabs':
          return <PiHandshakeFill />;
        case 'Illegal Body Part':
          return <IconShoe />;
        case 'Obstruction':
          return <IconBallTennis />;
      }
      return <IconBallTennis />;
    case 'Fault':
      return <IconPlayHandball />;
    case 'Substitute':
      return <IconArrowsLeftRight />;
    case 'Warning':
      return <IconExclamationMark color="grey" />;
    case 'Green Card':
      return <IconTriangleInvertedFilled color="green" />;
    case 'Yellow Card':
      return <IconSquareFilled color="yellow" />;
    case 'Red Card':
      return <IconCircleFilled color="red" />;
  }
  return null;
};

const cardColor = (e: GameEventStructure | CardStructure) =>
  e.eventType.toLowerCase().replace(' Card', '');

export function AdminGamePanel({ game }: AdminGamePanelProps) {
  const teamTwoCards = game.admin?.cards!.filter((a) => !a.firstTeam) ?? [];
  const teamOneCards = game.admin?.cards!.filter((a) => a.firstTeam) ?? [];
  const router = useRouter();
  const { isUmpireManager } = useUserData();
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
      {isUmpireManager && (
        <>
          <Accordion.Item value="actions">
            <Accordion.Control icon={<IconCheckbox />}>
              {markIfReqd(game.admin?.requiresAction!, 'Actions')}
            </Accordion.Control>
            <Accordion.Panel>
              <Button
                disabled={RESOLVED_STATUSES.includes(game.status)}
                onClick={() => {
                  resolveGame(game.id).then(() => router.refresh());
                }}
              >
                Resolve
              </Button>
              {!game.ended && (
                <>
                  <br />
                  <br />
                  <Popover width={200} position="top" withArrow shadow="md">
                    <Popover.Target>
                      <Button color="red">Forfeit</Button>
                    </Popover.Target>
                    <Popover.Dropdown w={350}>
                      <Group justify="center">
                        <Button
                          onClick={() => {
                            if (!game.started) {
                              startGame(game.id, false, false)
                                .then(() => forfeitGame(game.id, true))
                                .then(() =>
                                  endGame(
                                    game.id,
                                    game.teamTwo.captain.searchableName,
                                    3,
                                    3,
                                    `Pregame Forfeit by ${game.teamOne.name}`
                                  ).then(() => router.push(`/${game.tournament.searchableName}/fixtures`))
                                );
                            }
                            if (!game.someoneHasWon) {
                              forfeitGame(game.id, true)
                                .then(() =>
                                  endGame(
                                    game.id,
                                    game.teamTwo.captain.searchableName,
                                    3,
                                    3,
                                    `Pregame Forfeit by ${game.teamOne.name}`
                                  )
                                )
                                .then(() => router.push(`/${game.tournament.searchableName}/fixtures`));
                            } else {
                              endGame(
                                game.id,
                                game.teamTwo.captain.searchableName,
                                3,
                                3,
                                `Pregame Forfeit by ${game.teamOne.name}`
                              ).then(() => router.push(`/${game.tournament.searchableName}/fixtures`));
                            }
                          }}
                          color="red"
                        >
                          Forfeit for {game.teamOne.name}
                        </Button>
                        <Button
                          onClick={() => {
                            if (!game.started) {
                              startGame(game.id, false, false)
                                .then(() => forfeitGame(game.id, false))
                                .then(() =>
                                  endGame(
                                    game.id,
                                    game.teamOne.captain.searchableName,
                                    3,
                                    3,
                                    `Pregame Forfeit by ${game.teamTwo.name}`
                                  ).then(() => router.push(`/${game.tournament.searchableName}/fixtures`))
                                );
                            }
                            if (!game.someoneHasWon) {
                              forfeitGame(game.id, false)
                                .then(() => router.refresh())
                                .then(() =>
                                  endGame(
                                    game.id,
                                    game.teamOne.captain.searchableName,
                                    3,
                                    3,
                                    `Pregame Forfeit by ${game.teamTwo.name}`
                                  )
                                )
                                .then(() => router.push(`/${game.tournament.searchableName}/fixtures`));
                            } else {
                              endGame(
                                game.id,
                                game.teamTwo.captain.searchableName,
                                3,
                                3,
                                `Pregame Forfeit by ${game.teamOne.name}`
                              ).then(() => router.push(`/${game.tournament.searchableName}/fixtures`));
                            }
                          }}
                          color="red"
                        >
                          Forfeit for {game.teamTwo.name}
                        </Button>
                      </Group>
                    </Popover.Dropdown>
                  </Popover>
                </>
              )}

              {game.tournament.editable && (
                <>
                  <br />
                  <br />
                  <Popover width={200} position="top" withArrow shadow="md">
                    <Popover.Target>
                      <Button color="red">Delete</Button>
                    </Popover.Target>
                    <Popover.Dropdown w={350}>
                      <Group justify="center">
                        <Button
                          onClick={() => {
                            deleteGame(game.id).then(() => {
                              router.push(`/${game.tournament.searchableName}`);
                            });
                          }}
                          color="red"
                        >
                          Confirm
                        </Button>
                      </Group>
                    </Popover.Dropdown>
                  </Popover>
                </>
              )}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="notes">
            <Accordion.Control icon={<IconNote />}>
              {markIfReqd(game.admin?.markedForReview ?? false, 'Notes')}
            </Accordion.Control>
            <Accordion.Panel>
              <strong>Marked For Review: </strong>
              {game.admin?.markedForReview ? (
                <IconCheckbox size="1.25em"></IconCheckbox>
              ) : (
                <IconSquare size="1.25em"></IconSquare>
              )}
              <br />
              {!game.admin?.notes ? (
                !game.ended ? (
                  <Text>
                    <i>Notes can not be left until the game is completed</i>
                  </Text>
                ) : (
                  <Text>
                    <i>No notes have been left for this game</i>
                  </Text>
                )
              ) : (
                <>
                  <strong>Notes: </strong> {game?.admin?.notes}
                </>
              )}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="teamOne">
            <Accordion.Control icon={<IconSquare1 />}>
              {markIfReqd(
                game.admin?.teamOneProtest !== null ||
                  game.admin?.teamOneRating === 1 ||
                  teamOneCards.some((a) => ['Red Card', 'Yellow Card'].includes(a.eventType)),
                'Team One'
              )}
            </Accordion.Control>
            <Accordion.Panel>
              <Title order={3}>{markIfReqd(game.admin?.teamOneRating === 1, 'Rating')}</Title>
              <Center>
                <Rating count={4} value={game.admin?.teamOneRating} readOnly size="lg"></Rating>
              </Center>
              {FEEDBACK_TEXTS[game.admin?.teamOneRating ?? 0]}
              <Divider></Divider>
              <Title order={3}>
                {markIfReqd(
                  teamOneCards.some((a) => ['Red Card', 'Yellow Card'].includes(a.eventType)),
                  'Cards'
                )}
              </Title>
              {teamOneCards.length === 0 && (
                <Text>
                  <i>No cards were awarded to {game.teamOne.name} for this game</i>
                </Text>
              )}
              {teamOneCards?.map((card, i) => (
                <Text size="sm" key={i}>
                  <strong style={{ color: cardColor(card) }}>{card.eventType}</strong> to{' '}
                  <strong>{card.player!.name}</strong> for <i>{card.notes}</i>
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
              <Title order={3}>{markIfReqd(game.admin?.teamOneProtest !== null, 'Protest')}</Title>
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
            <Accordion.Control icon={<IconSquare2 />}>
              {markIfReqd(
                game.admin?.teamTwoProtest !== null ||
                  game.admin?.teamTwoRating === 1 ||
                  teamTwoCards.some((a) => ['Red Card', 'Yellow Card'].includes(a.eventType)),
                'Team Two'
              )}
            </Accordion.Control>
            <Accordion.Panel>
              <Title order={3}>{markIfReqd(game.admin?.teamTwoRating === 1, 'Rating')}</Title>
              <Center>
                <Rating count={4} value={game.admin?.teamTwoRating} readOnly size="lg"></Rating>
              </Center>
              {FEEDBACK_TEXTS[game.admin?.teamTwoRating ?? 0]}
              <Divider></Divider>
              <Title order={3}>
                {markIfReqd(
                  teamTwoCards.some((a) => ['Red Card', 'Yellow Card'].includes(a.eventType)),
                  'Cards'
                )}
              </Title>
              {teamTwoCards.length === 0 && (
                <Text>
                  <i>No cards were awarded to {game.teamTwo.name} for this game</i>
                </Text>
              )}
              {teamTwoCards.map((card, i) => (
                <Text size="sm" key={i}>
                  <strong style={{ color: cardColor(card) }}>{card.eventType}</strong> to{' '}
                  <strong>{card.player!.name}</strong> for <i>{card.notes}</i>
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
              <Title order={3}>{markIfReqd(game.admin?.teamTwoProtest !== null, 'Protest')}</Title>
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
            <Accordion.Control icon={<IconTriangleInvertedFilled />}>
              {markIfReqd(
                game.admin?.cards.some((a) => ['Red Card', 'Yellow Card'].includes(a.eventType)) ??
                  false,
                'Cards'
              )}
            </Accordion.Control>
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
                    title={`${card.eventType} for ${card.player!.name}`}
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
