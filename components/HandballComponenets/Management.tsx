'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Checkbox,
  ColorPicker,
  Container,
  Divider,
  Grid,
  Group,
  HoverCard,
  Image,
  Modal,
  Paper,
  Popover,
  Rating,
  Select,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { SERVER_ADDRESS } from '@/app/config';
import { eventIcon, RESOLVED_STATUSES } from '@/components/HandballComponenets/AdminGamePanel';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton/TeamButton';
import Players from '@/components/HandballComponenets/StatsComponents/Players';
import { getNoteableGames, resolveGame } from '@/ServerActions/GameActions';
import { getPlayers } from '@/ServerActions/PlayerActions';
import {
  forceNextRoundFinalsTournament,
  getFixtureTypes,
  getTournament,
  updateTournament,
} from '@/ServerActions/TournamentActions';
import { GameStructure, PersonStructure, TournamentStructure } from '@/ServerActions/types';
import { useUserData } from '@/components/hooks/userData';

interface ManagementArgs {
  tournament: string;
}

function gameToPaper(game: GameStructure, reload: () => void) {
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
              <Checkbox
                style={{ verticalAlign: 'middle' }}
                display="inline-block"
                checked={Boolean(game.admin?.markedForReview)}
              ></Checkbox>
            </Text>
            <HoverCard width={280} shadow="md" disabled={(game.admin!.notes ?? '') === ''}>
              <HoverCard.Target>
                <Text>
                  <strong>Notes: </strong>
                  <Checkbox
                    style={{ verticalAlign: 'middle' }}
                    display="inline-block"
                    checked={Boolean(game.admin?.notes)}
                  ></Checkbox>
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
                      <strong>{card.player?.name}</strong> received a{' '}
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
                      <strong>{card.player?.name}</strong> received a{' '}
                      <strong>{card.eventType}</strong> for <i>{card.notes}</i>
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              ))}
          </Grid.Col>
          <Grid.Col span={{ base: 4, md: 5 }}>
            <HoverCard width={280} shadow="md" disabled={(game.admin?.teamOneNotes ?? '') === ''}>
              <HoverCard.Target>
                <Text>
                  <strong>Notes: </strong>
                  <Checkbox
                    style={{ verticalAlign: 'middle' }}
                    display="inline-block"
                    checked={Boolean(game.admin!.teamOneNotes)}
                  ></Checkbox>
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
                  <Checkbox
                    style={{ verticalAlign: 'middle' }}
                    display="inline-block"
                    checked={Boolean(game.admin!.teamOneProtest)}
                  ></Checkbox>
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
          <Grid.Col span={{ base: 7, md: 5 }}>
            <Button
              disabled={RESOLVED_STATUSES.includes(game.status)}
              onClick={() => {
                resolveGame(game.id).then(() => reload());
              }}
            >
              Resolve
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 4, md: 5 }}>
            <HoverCard width={280} shadow="md" disabled={(game.admin?.teamTwoNotes ?? '') === ''}>
              <HoverCard.Target>
                <Text>
                  <strong>Notes: </strong>
                  <Checkbox
                    style={{ verticalAlign: 'middle' }}
                    display="inline-block"
                    checked={Boolean(game.admin!.teamTwoNotes)}
                  ></Checkbox>
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
                  <Checkbox
                    style={{ verticalAlign: 'middle' }}
                    display="inline-block"
                    checked={Boolean(game.admin!.teamTwoProtest)}
                  ></Checkbox>
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
  const [tournamentObj, setTournamentObj] = useState<TournamentStructure | undefined>();
  const [hasScorer, setHasScorer] = useState<boolean>(true);
  const [twoCourts, setTwoCourts] = useState<boolean>(true);
  const [newTournamentName, setNewTournamentName] = useState<string>();
  const [openTournamentEdit, setOpenTournamentEdit] = useState<boolean>(false);
  const [fixturesType, setFixturesType] = useState<string>();
  const [finalsType, setFinalsType] = useState<string>();
  const [badmintonServes, setBadmintonServes] = useState<boolean>(true);
  const [fixturesTypes, setFixturesTypes] = useState<string[]>([]);
  const [finalsTypes, setFinalsTypes] = useState<string[]>([]);
  const [tournamentColor, setTournamentColor] = useState<string>();
  const [noteableGames, setNoteableGames] = useState<GameStructure[]>([]);
  const { isUmpireManager, isTournamentDirector, loading } = useUserData();
  const router = useRouter();
  const reload = () =>
    getNoteableGames({ tournament }).then((g) => {
      setNoteableGames(g.games.filter((v) => !v.admin?.requiresAction).toReversed());
      setActionableGames(g.games.filter((v) => v.admin?.requiresAction).toReversed());
    });
  useEffect(() => {
    if (!isUmpireManager(tournament) && !loading) {
      router.push(`/${tournament}`);
    }
  }, [isUmpireManager, loading, router, tournament]);
  useEffect(() => {
    if (!loading) return;
    reload();
    getPlayers({
      tournament,
      includeStats: true,
      formatData: true,
    }).then((g) => setPlayers(g.players.filter((v) => v.stats!['Penalty Points'] >= 12)));
    if (tournament) {
      getTournament(tournament).then((t) => {
        setTournamentObj(t);
        setFixturesType(t.fixturesType);
        setFinalsType(t.finalsType);
        setNewTournamentName(t.name);
        setTournamentColor(t.color);
        setTwoCourts(t.twoCourts);
        setHasScorer(t.hasScorer);
        setBadmintonServes(t.usingBadmintonServes);
      });
    }
    // adding the deps it wants will cause infinite page reloads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, tournament]);

  useEffect(() => {
    getFixtureTypes().then((f) => {
      setFixturesTypes(f.fixturesTypes);
      setFinalsTypes(f.finalsTypes);
    });
  }, []);

  return (
    <>
      <br />
      <Modal
        opened={openTournamentEdit}
        onClose={() => setOpenTournamentEdit(false)}
        title={<Title>Edit Tournament</Title>}
      >
        <TextInput
          label="Name"
          value={newTournamentName}
          onChange={(e) => setNewTournamentName(e.target.value)}
        />
        <Select
          label="Fixtures Type"
          placeholder="Pick value"
          data={fixturesTypes}
          value={fixturesType}
          onChange={(v) => setFixturesType(v!)}
          allowDeselect={false}
        />
        <Select
          label="Finals Type"
          placeholder="Pick value"
          data={finalsTypes}
          value={finalsType}
          onChange={(v) => setFinalsType(v!)}
          allowDeselect={false}
        />
        <Checkbox
          label="Badminton Serves"
          m={15}
          checked={badmintonServes}
          onChange={(e) => setBadmintonServes(e.target.checked)}
        ></Checkbox>
        <Checkbox
          label="Has Scorer"
          m={15}
          checked={hasScorer}
          onChange={(e) => setHasScorer(e.target.checked)}
        ></Checkbox>
        <Checkbox
          label="Two Courts"
          m={15}
          checked={twoCourts}
          onChange={(e) => setTwoCourts(e.target.checked)}
        ></Checkbox>
        <Box>
          <TextInput
            label="Tournament Color"
            value={tournamentColor}
            onChange={(e) => setTournamentColor(e.currentTarget.value)}
            error={!/^#([0-9A-F]{3}){1,2}$/i.test(tournamentColor!)}
          ></TextInput>
          <ColorPicker
            mt={5}
            format="hex"
            onChange={setTournamentColor}
            value={tournamentColor}
            fullWidth
          ></ColorPicker>
        </Box>
        <Button
          m={5}
          color="green"
          onClick={() =>
            updateTournament({
              tournament,
              name: newTournamentName,
              fixturesType,
              finalsType,
              color: tournamentColor,
              hasScorer,
              twoCourts,
              badmintonServes,
            }).then(() => setOpenTournamentEdit(false))
          }
        >
          Submit
        </Button>
      </Modal>
      <Container
        w="auto"
        p={20}
        display="flex"
        pos="relative"
        style={{
          overflow: 'hidden',
          margin: 'auto',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image
          src={tournamentObj?.imageUrl ?? `${SERVER_ADDRESS}/api/image?name=SUSS`}
          w="100px"
          h="100px"
        ></Image>
        <Title ta="center">{tournamentObj?.name ?? 'SUSS Handball'}</Title>
        <Group>
          <Button
            m={10}
            size="md"
            disabled={!isTournamentDirector(tournament)}
            color="blue"
            variant="outline"
            onClick={() => setOpenTournamentEdit(true)}
          >
            Edit
          </Button>

          {!(tournamentObj?.inFinals ?? true) && (
            <Popover width={200} position="top" withArrow shadow="md">
              <Popover.Target>
                <Button m={10} size="md" color="green" variant="outline">
                  Force Finals
                </Button>
              </Popover.Target>
              <Popover.Dropdown ta="center">
                <Text m={5}>
                  Are you sure you want to force this tournament into finals?{' '}
                  <b>(This cannot be undone)</b>
                </Text>
                <Button
                  m={5}
                  color="green"
                  onClick={() => {
                    forceNextRoundFinalsTournament(tournament);
                  }}
                >
                  Confirm
                </Button>
              </Popover.Dropdown>
            </Popover>
          )}
        </Group>
      </Container>
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
            {actionableGames.map((g) => gameToPaper(g, reload))}
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
            {noteableGames.map((g) => gameToPaper(g, reload))}
          </Box>
        </Grid.Col>
      </Grid>
    </>
  );
}
