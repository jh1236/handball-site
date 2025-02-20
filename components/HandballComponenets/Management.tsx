'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Divider,
  Grid,
  HoverCard,
  Image,
  Paper,
  Rating,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { eventIcon } from '@/components/HandballComponenets/AdminGamePanel';
import { FakeCheckbox } from '@/components/HandballComponenets/GameEditingComponenets/GameScore';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import Players from '@/components/HandballComponenets/StatsComponents/Players';
import { getNoteableGames } from '@/ServerActions/GameActions';
import { getPlayers } from '@/ServerActions/PlayerActions';
import { GameStructure, PersonStructure } from '@/ServerActions/types';

interface ManagementArgs {
  tournament: string;
}

function gameToPaper(game: GameStructure) {
  const teamOneName =
    game.teamOne.name.length > 15 ? `${game.teamOne.name.substring(0, 12)}...` : game.teamOne.name;
  const teamTwoName =
    game.teamTwo.name.length > 15 ? `${game.teamTwo.name.substring(0, 12)}...` : game.teamTwo.name;
  return (
    <>
      <Paper shadow="lg" radius="md" p="xl" ml={{ md: 30 }} mr={{ md: 30 }}>
        <Grid ta="center" justify="center" columns={15}>
          <Grid.Col span={{ base: 4, md: 5 }} fw={700}>
            <Link href={`/games/${game.id}?tab=admin`} className="hideLink">
              {teamOneName}
            </Link>
          </Grid.Col>
          <Grid.Col span={{ base: 7, md: 5 }} fw={700}>
            <Link href={`/games/${game.id}?tab=admin`} className="hideLink">
              vs
            </Link>
          </Grid.Col>
          <Grid.Col span={{ base: 4, md: 5 }} fw={700}>
            <Link href={`/games/${game.id}?tab=admin`} className="hideLink">
              {teamTwoName}
            </Link>
          </Grid.Col>
          <Grid.Col span={{ base: 4, md: 5 }}>
            <Image
              w={100}
              h={100}
              style={{ width: 100, height: 100 }}
              display="inline"
              src={game.teamOne.imageUrl}
            ></Image>
          </Grid.Col>
          <Grid.Col span={{ base: 7, md: 5 }}>
            <Text>
              <strong>Game Id: </strong>
              {game.id}
            </Text>
            <Text>
              <strong>Status: </strong>
              {game.admin!.noteableStatus}
            </Text>
            <Text>
              <strong>Marked For Review: </strong>
              <FakeCheckbox checked={game.admin?.markedForReview}> </FakeCheckbox>
            </Text>
            <HoverCard width={280} shadow="md" disabled={game.admin!.notes === null}>
              <HoverCard.Target>
                <Text>
                  <strong>Notes: </strong>
                  <FakeCheckbox checked={game.admin?.notes}> </FakeCheckbox>
                </Text>
              </HoverCard.Target>
              <HoverCard.Dropdown>{game.admin?.notes ?? <i>No Notes Left</i>}</HoverCard.Dropdown>
            </HoverCard>
          </Grid.Col>
          <Grid.Col span={{ base: 4, md: 5 }}>
            <Image
              w={100}
              h={100}
              style={{ width: 100, height: 100 }}
              display="inline"
              src={game.teamTwo.imageUrl}
            ></Image>
          </Grid.Col>
          <Grid.Col span={{ base: 4, md: 5 }}>
            {game.admin?.cards
              .filter((c) => c.firstTeam)
              .map((card) => (
                <HoverCard width={280} shadow="md">
                  <HoverCard.Target>{eventIcon(card)}</HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text>
                      <strong>{card.player.name}</strong> received a{' '}
                      <strong>{card.eventType}</strong> for <i>{card.notes}</i>
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              ))}
          </Grid.Col>
          <Grid.Col span={{ base: 7, md: 5 }}></Grid.Col>
          <Grid.Col span={{ base: 4, md: 5 }}>
            {game.admin?.cards
              .filter((c) => !c.firstTeam)
              .map((card) => (
                <HoverCard width={280} shadow="md">
                  <HoverCard.Target>{eventIcon(card)}</HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text>
                      <strong>{card.player.name}</strong> received a{' '}
                      <strong>{card.eventType}</strong> for <i>{card.notes}</i>
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              ))}
          </Grid.Col>
          <Grid.Col span={{ base: 4, md: 5 }}>
            <HoverCard width={280} shadow="md" disabled={game.admin!.teamOneNotes === null}>
              <HoverCard.Target>
                <Text>
                  <strong>Notes: </strong>
                  <FakeCheckbox checked={game.admin!.teamOneNotes}></FakeCheckbox>
                </Text>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {game.admin?.teamOneNotes ?? <i>No Notes Left</i>}
              </HoverCard.Dropdown>
            </HoverCard>
            <HoverCard width={280} shadow="md" disabled={game.admin!.teamOneProtest === null}>
              <HoverCard.Target>
                <Text>
                  <strong>Protested: </strong>
                  <FakeCheckbox checked={game.admin!.teamOneProtest}></FakeCheckbox>
                </Text>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {game.admin?.teamOneProtest ?? <i>No Protest</i>}
              </HoverCard.Dropdown>
            </HoverCard>
            <Box display={{ md: 'flex' }}>
              <strong>Rating: </strong>
              <Space hiddenFrom="md" h="md"></Space>
              <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                  <Text>
                    <Rating
                      count={4}
                      readOnly
                      size="sm"
                      w="auto"
                      value={game.admin?.teamOneRating}
                    ></Rating>
                  </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  {FEEDBACK_TEXTS[game.admin?.teamOneRating!]}
                </HoverCard.Dropdown>
              </HoverCard>
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 7, md: 5 }}></Grid.Col>
          <Grid.Col span={{ base: 4, md: 5 }}>
            <HoverCard width={280} shadow="md" disabled={game.admin!.teamTwoNotes === null}>
              <HoverCard.Target>
                <Text>
                  <strong>Notes: </strong>
                  <FakeCheckbox checked={game.admin!.teamTwoNotes}></FakeCheckbox>
                </Text>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {game.admin?.teamTwoNotes ?? <i>No Notes Left</i>}
              </HoverCard.Dropdown>
            </HoverCard>
            <HoverCard width={280} shadow="md" disabled={game.admin!.teamTwoProtest === null}>
              <HoverCard.Target>
                <Text>
                  <strong>Protested: </strong>
                  <FakeCheckbox checked={game.admin!.teamTwoProtest}></FakeCheckbox>
                </Text>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {game.admin?.teamTwoProtest ?? <i>No Protest</i>}
              </HoverCard.Dropdown>
            </HoverCard>
            <Box display={{ md: 'flex' }}>
              <strong>Rating: </strong>
              <Space hiddenFrom="md" h="md"></Space>
              <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                  <Text>
                    <Rating
                      count={4}
                      readOnly
                      w="auto"
                      size="sm"
                      value={game.admin?.teamTwoRating}
                    ></Rating>
                  </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  {FEEDBACK_TEXTS[game.admin?.teamTwoRating!]}
                </HoverCard.Dropdown>
              </HoverCard>
            </Box>
          </Grid.Col>
        </Grid>
      </Paper>
      <br />
    </>
  );
}

export function Management({ tournament }: ManagementArgs) {
  const [actionableGames, setActionableGames] = useState<GameStructure[]>([]);
  const [players, setPlayers] = useState<PersonStructure[] | null>(null);
  const [noteableGames, setNoteableGames] = useState<GameStructure[]>([]);
  useEffect(() => {
    getNoteableGames({ tournament }).then((g) => {
      setNoteableGames(g.games.filter((v) => !v.admin?.requiresAction).toReversed());
      setActionableGames(g.games.filter((v) => v.admin?.requiresAction).toReversed());
    });
    getPlayers({
      tournament,
      includeStats: true,
      formatData: true,
    }).then((g) => setPlayers(g.players.filter((v) => v.stats!['Penalty Points'] >= 12)));
  }, [tournament]);
  return (
    <>
      <br />
      <Divider></Divider>
      <Grid w="97.5%">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Box>
            <Title ta="center" order={2}>
              Games Requiring action
            </Title>
            {actionableGames.length === 0 && (
              <Paper shadow="lg" radius="md" p="xl" ta="center" ml={30} mr={30}>
                <i>There are no games to show</i>
              </Paper>
            )}
            {actionableGames.map((g) => gameToPaper(g))}
            <br />
            <Divider></Divider>
            <br />
            <Title ta="center" order={2}>
              Players Requiring Actioned
            </Title>
            <Players
              editable={false}
              maxRows={players?.length ?? 5}
              sortIndex={2}
              playersIn={players}
              columns={['Penalty Points', 'Yellow Cards', 'Red Cards']}
            ></Players>
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Box>
            <Title ta="center" order={2}>
              Games Already Actioned
            </Title>
            {noteableGames.length === 0 && (
              <Paper shadow="lg" radius="md" p="xl" ta="center" ml={30} mr={30}>
                <i>There are no games to show</i>
              </Paper>
            )}
            {noteableGames.map((g) => gameToPaper(g))}
          </Box>
        </Grid.Col>
      </Grid>
    </>
  );
}
