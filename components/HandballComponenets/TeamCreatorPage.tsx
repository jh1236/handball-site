'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconMinus, IconPlus, IconRefresh, IconUpload } from '@tabler/icons-react';
import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  ColorPicker,
  Container,
  Grid,
  Group,
  Image,
  luminance,
  Modal,
  Paper,
  Popover,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { SERVER_ADDRESS } from '@/app/config';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import {
  uploadPlayerImage,
  uploadTeamImage,
  uploadTournamentImage,
} from '@/ServerActions/ImageActions';
import {
  addOfficialToTournament,
  getOfficials,
  removeOfficialFromTournament,
  updateOfficialForTournament,
} from '@/ServerActions/OfficialActions';
import { getPlayers } from '@/ServerActions/PlayerActions';
import {
  addTeamToTournament,
  getTeams,
  removeTeamFromTournament,
  renameTeamForTournament,
} from '@/ServerActions/TeamActions';
import {
  getTournament,
  startTournament,
  updateTournament,
} from '@/ServerActions/TournamentActions';
import {
  OfficialStructure,
  PersonStructure,
  SearchableName,
  TeamStructure,
  TournamentStructure,
} from '@/ServerActions/types';
import classes from './TeamCreatorPage.module.css';

interface TeamCreatorPageArgs {
  tournament: SearchableName;
}

const SIDES = ['Captain', 'Non-Captain', 'Substitute'];

function PlayerCard({ player, index }: { player: PersonStructure; index: number }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Box
        pos="relative"
        w="50px" // fixed width instead of 20% for consistency
        h="50px"
        className={classes.hoverImage}
      >
        <Image
          pos="absolute"
          src={player?.imageUrl ?? `${SERVER_ADDRESS}/api/image?name=blank`}
          w={50}
          h={50}
        />
        <Text
          size="sm"
          pos="absolute"
          h={50}
          w={50}
          m="auto"
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          Change Image
        </Text>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            uploadPlayerImage(file, player.searchableName).then(() => {
              router.refresh();
            });
          }}
        />
      </Box>

      <span>
        <b>{SIDES[index]}: </b> {player.name}
      </span>
    </div>
  );
}

function CustomPlayerCard({
  index,
  setPlayers,
  players,
  allPlayers,
}: {
  allPlayers: PersonStructure[];
  index: number;
  setPlayers: (arg: (string | undefined)[]) => void;
  players: (string | undefined)[];
}) {
  return (
    <div>
      <Image
        src={
          allPlayers.find((p) => p.name === players[index])?.imageUrl ??
          `${SERVER_ADDRESS}/api/image?name=blank`
        }
        style={{
          width: 50,
          verticalAlign: 'middle',
          marginRight: 5,
        }}
        display="inline-block"
      ></Image>
      <b>{SIDES[index]}: </b>
      <Autocomplete
        display="inline-block"
        size="xs"
        placeholder="John Doe"
        value={players[index] ?? ''}
        data={allPlayers.map((a) => a.name)}
        onChange={(v) => {
          const copy = [...players];
          copy[index] = v || undefined;
          setPlayers(copy);
        }}
      />
    </div>
  );
}

interface CustomTeamCardArgs {
  setPlayers: (arg: (string | undefined)[]) => void;
  players: (string | undefined)[];
  allTeams: TeamStructure[];
  teamsInTournament: TeamStructure[];
  allPlayers: PersonStructure[];
  newTeamName: string | undefined;
  setTeamsInTournament: (value: TeamStructure[]) => void;
  setNewTeamName: (value: string | undefined) => void;
  tournament: string;
}

function CustomTeamCard({
  setPlayers,
  players,
  allPlayers,
  allTeams,
  tournament,
  setTeamsInTournament,
  teamsInTournament,
  newTeamName,
  setNewTeamName,
}: CustomTeamCardArgs) {
  const [team, setTeam] = useState<TeamStructure | undefined>();
  useEffect(() => {
    setPlayers([undefined, undefined, undefined]);
  }, [setPlayers]);
  useEffect(() => {
    for (const t of allTeams) {
      const possiblePlayers = [t.captain.name, t.nonCaptain?.name, t.substitute?.name];
      if (JSON.stringify(possiblePlayers.toSorted()) !== JSON.stringify(players.toSorted())) {
        continue;
      }
      setTeam(t);
      setNewTeamName(t.name);
      return;
    }
    setTeam(undefined);
  }, [players, allTeams, setNewTeamName]);
  return (
    <Paper shadow="lg" m={15} pos="relative" style={{ padding: '5px' }}>
      <Group>
        <Stack>
          <ActionIcon
            variant="subtle"
            color="green"
            size="md"
            pos="absolute"
            top={5}
            right={5}
            onClick={() => {
              if (team && team.name === newTeamName) {
                addTeamToTournament({
                  tournamentSearchableName: tournament,
                  teamName: team.name,
                }).then((t) => {
                  setTeamsInTournament([...teamsInTournament, t]);
                });
              } else {
                const [captainName, nonCaptainName, substituteName] = players;
                addTeamToTournament({
                  tournamentSearchableName: tournament,
                  teamName: newTeamName,
                  captainName: players[0],
                  ...(captainName && { captainName }),
                  ...(nonCaptainName && { nonCaptainName }),
                  ...(substituteName && { substituteName }),
                }).then((t) => setTeamsInTournament([...teamsInTournament, t]));
              }
              setPlayers([undefined, undefined, undefined]);
              setTeam(undefined);
              setNewTeamName('');
            }}
          >
            <IconPlus></IconPlus>
          </ActionIcon>
          <Image
            src={team?.imageUrl ?? `${SERVER_ADDRESS}/api/image?name=blank`}
            w="100px"
            h="100px"
          ></Image>
          <Autocomplete
            display="inline-block"
            size="xs"
            w="100px"
            placeholder="Team Name"
            value={newTeamName}
            data={allTeams.map((a) => a.name).filter((v, i, a) => a.indexOf(v) === i)}
            onChange={(v) => {
              setNewTeamName(v);
              const t = allTeams.find((t1) => t1.name === v);
              if (t) {
                setPlayers([t?.captain.name, t?.nonCaptain?.name, t?.substitute?.name]);
              }
            }}
          />
        </Stack>
        <Stack>
          <CustomPlayerCard
            setPlayers={setPlayers}
            players={players}
            index={0}
            allPlayers={allPlayers}
          ></CustomPlayerCard>
          <CustomPlayerCard
            setPlayers={setPlayers}
            players={players}
            index={1}
            allPlayers={allPlayers}
          ></CustomPlayerCard>
          <CustomPlayerCard
            setPlayers={setPlayers}
            players={players}
            index={2}
            allPlayers={allPlayers}
          ></CustomPlayerCard>
        </Stack>
      </Group>
    </Paper>
  );
}

interface CustomOfficialCardArgs {
  allOfficials: OfficialStructure[];
  officialsInTournament: OfficialStructure[];
  setOfficialsInTournament: (value: OfficialStructure[]) => void;
  tournament: string;
}

function CustomOfficialCard({
  allOfficials,
  tournament,
  setOfficialsInTournament,
  officialsInTournament,
}: CustomOfficialCardArgs) {
  const [umpireProficiency, setUmpireProficiency] = useState<number>(3);
  const [scorerProficiency, setScorerProficiency] = useState<number>(3);
  const [role, setRole] = useState<string>('Umpire');
  const [official, setOfficial] = useState<OfficialStructure | undefined>();
  return (
    <Paper shadow="lg" m={15} pos="relative" style={{ padding: '5px' }}>
      <ActionIcon
        variant="subtle"
        color="green"
        size="md"
        pos="absolute"
        top={5}
        right={5}
        onClick={() => {
          if (!official) return;
          addOfficialToTournament({
            tournamentSearchableName: tournament,
            officialSearchableName: official?.searchableName,
            umpireProficiency,
            scorerProficiency,
            role,
          });
          setOfficialsInTournament([...officialsInTournament, official]);
          setOfficial(undefined);
        }}
      >
        <IconPlus></IconPlus>
      </ActionIcon>
      <Group>
        <Stack w={{ base: '100%', md: '30%' }}>
          <Image
            src={official?.imageUrl ?? `${SERVER_ADDRESS}/api/image?name=blank`}
            w="100px"
            h="100px"
          ></Image>
          <Select
            display="inline-block"
            size="xs"
            w="100px"
            placeholder="Official Name"
            searchable
            value={official?.name}
            data={allOfficials.map((a) => a.name).filter((v, i, a) => a.indexOf(v) === i)}
            onChange={(v) => {
              setOfficial(allOfficials.find((o) => o.name === v));
            }}
          />
        </Stack>
        <Stack w={{ base: '100%', md: '60%' }}>
          <Select
            value={`${role}`}
            label="Role"
            onChange={(v) => setRole(v!)}
            size="sm"
            data={[
              { value: 'Tournament Director', label: 'Tourney Director' },
              'Umpire Manager',
              'Umpire',
            ]}
          ></Select>
          <Select
            label="Umpire Proficiency"
            value={`${umpireProficiency}`}
            onChange={(v) => setUmpireProficiency(+v!)}
            size="sm"
            data={[
              { label: 'Court One', value: '3' },
              { label: 'Mixed', value: '2' },
              { label: 'Court Two', value: '1' },
              { label: 'Emergency', value: '-1' },
              { label: 'None', value: '0' },
            ]}
          />
          <Select
            value={`${scorerProficiency}`}
            onChange={(v) => setScorerProficiency(+v!)}
            label="Scorer Proficiency"
            size="sm"
            data={[
              { label: 'Scorer', value: '3' },
              { label: 'Reserve', value: '2' },
              { label: 'Emergency', value: '1' },
              { label: 'None', value: '0' },
            ]}
          ></Select>
        </Stack>
      </Group>
    </Paper>
  );
}

interface TeamCardParams {
  tournament: string;
  team: TeamStructure;
  setTeamsInTournament: (
    value: ((prevState: TeamStructure[]) => TeamStructure[]) | TeamStructure[]
  ) => void;
  teamsInTournament: TeamStructure[];
  setAllTeams: (value: ((prevState: TeamStructure[]) => TeamStructure[]) | TeamStructure[]) => void;
}

function TeamCard({
  tournament,
  team,
  setTeamsInTournament,
  teamsInTournament,
  setAllTeams,
}: TeamCardParams) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState<string | undefined>(team.teamColor ?? undefined);
  const [newTeamName, setNewTeamName] = useState<string>(team.name);
  return (
    <Paper
      shadow="lg"
      m={15}
      pos="relative"
      bg={color}
      c={color && luminance(color) > 0.5 ? 'black' : 'white'}
    >
      <Box
        top={5}
        right={5}
        pos="absolute"
        style={{ display: 'flex', gap: '4px', flexDirection: 'row-reverse' }}
      >
        <ActionIcon
          variant="subtle"
          color="red"
          size="md"
          onClick={() => {
            removeTeamFromTournament(tournament, team.searchableName).then(() => {
              setTeamsInTournament(
                teamsInTournament.filter((t2) => t2.searchableName !== team.searchableName)
              );
            });
          }}
        >
          <IconMinus></IconMinus>
        </ActionIcon>
        {(newTeamName !== team.name || color?.toLowerCase() !== team.teamColor?.toLowerCase()) && (
          <>
            <ActionIcon
              variant="subtle"
              color="yellow"
              size="md"
              onClick={() => {
                setColor(team.teamColor ?? undefined);
                setNewTeamName(team.name);
              }}
            >
              <IconRefresh></IconRefresh>
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="blue"
              size="md"
              onClick={() => {
                renameTeamForTournament({
                  tournamentSearchableName: tournament,
                  teamSearchableName: team.searchableName,
                  newName: newTeamName !== team.name ? newTeamName : undefined,
                  newColor:
                    color?.toLowerCase() !== team.teamColor?.toLowerCase() ? color : undefined,
                }).then((newTeam) => {
                  setTeamsInTournament(
                    teamsInTournament.map((t) =>
                      t.searchableName === team.searchableName ? newTeam : t
                    )
                  );
                  getTeams({}).then((teams) => setAllTeams(teams.teams));
                });
              }}
            >
              <IconUpload></IconUpload>
            </ActionIcon>
          </>
        )}
      </Box>

      <Group m={15}>
        <Stack>
          <Box pos="relative" style={{ paddingBottom: 90 }} className={classes.hoverImage}>
            <Image
              pos="absolute"
              src={team?.imageUrl ?? `${SERVER_ADDRESS}/api/image?name=blank`}
              w="100px"
              h="100px"
            ></Image>
            <Text
              size="sm"
              pos="absolute"
              h={100}
              w={100}
              m="auto"
              style={{
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              Change Image
            </Text>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                uploadTeamImage(file, team.searchableName, tournament).then((t) => {
                  setTeamsInTournament(
                    teamsInTournament.map((t2) => (t2.searchableName === t.searchableName ? t : t2))
                  );
                  getTeams({}).then((teams) => setAllTeams(teams.teams));
                });
              }}
            />
          </Box>
          <Autocomplete
            display="inline-block"
            size="xs"
            w="100px"
            mb={10}
            placeholder="Team Name"
            value={newTeamName}
            data={[team.name]}
            onChange={(v) => {
              setNewTeamName(v);
            }}
          />
        </Stack>
        <ColorPicker w="100px" value={color} onChange={setColor} />
        <Stack>
          {[team.captain, team.nonCaptain, team.substitute]
            .filter((t1) => t1 !== null)
            .map((player, i) => (
              <PlayerCard key={i} index={i} player={player} />
            ))}
        </Stack>
      </Group>
    </Paper>
  );
}

interface OfficialCardParams {
  tournament: string;
  official: OfficialStructure;
  setOfficialsInTournament: (
    value: ((prevState: OfficialStructure[]) => OfficialStructure[]) | OfficialStructure[]
  ) => void;
  officialsInTournament: OfficialStructure[];
}

function OfficialCard({
  tournament,
  official,
  setOfficialsInTournament,
  officialsInTournament,
}: OfficialCardParams) {
  const [role, setRole] = useState<string>(official.role!);
  const [umpireProficiency, setUmpireProficiency] = useState<number>(official.umpireProficiency!);
  const [scorerProficiency, setScorerProficiency] = useState<number>(official.scorerProficiency!);
  return (
    <Paper shadow="lg" m={15} pos="relative" style={{ padding: '5px' }}>
      <Box
        top={5}
        right={5}
        pos="absolute"
        style={{ display: 'flex', gap: '4px', flexDirection: 'row-reverse' }}
      >
        <ActionIcon
          variant="subtle"
          color="red"
          size="md"
          onClick={() => {
            removeOfficialFromTournament(tournament, official.searchableName).then(() => {
              setOfficialsInTournament(
                officialsInTournament.filter((t2) => t2.searchableName !== official.searchableName)
              );
            });
          }}
        >
          <IconMinus></IconMinus>
        </ActionIcon>
        {(official.umpireProficiency !== umpireProficiency ||
          official.scorerProficiency !== scorerProficiency ||
          official.role !== role) && (
          <>
            <ActionIcon
              variant="subtle"
              color="blue"
              size="md"
              onClick={() => {
                updateOfficialForTournament({
                  tournamentSearchableName: tournament,
                  officialSearchableName: official.searchableName,
                  scorerProficiency:
                    scorerProficiency !== official.scorerProficiency
                      ? scorerProficiency
                      : undefined,
                  umpireProficiency:
                    umpireProficiency !== official.umpireProficiency
                      ? umpireProficiency
                      : undefined,
                  role: role !== official.role ? role : undefined,
                }).then(() => {
                  setOfficialsInTournament(
                    officialsInTournament.map((o) =>
                      o.searchableName === official.searchableName
                        ? {
                            ...official,
                            umpireProficiency,
                            scorerProficiency,
                          }
                        : o
                    )
                  );
                });
              }}
            >
              <IconUpload></IconUpload>
            </ActionIcon>
          </>
        )}
      </Box>
      <Group>
        <Stack w={{ base: '100%', md: '30%' }}>
          <Image
            src={official?.imageUrl ?? `${SERVER_ADDRESS}/api/image?name=blank`}
            w="100px"
            h="100px"
          ></Image>
          <Text display="inline-block" size="lg">
            <b>{official.name}</b>
          </Text>
        </Stack>
        <Stack w={{ base: '100%', md: '60%' }}>
          <Select
            value={`${role}`}
            label="Role"
            onChange={(v) => setRole(v!)}
            size="sm"
            data={[
              { value: 'Tournament Director', label: 'Tourney Director' },
              'Umpire Manager',
              'Umpire',
            ]}
          ></Select>
          <Select
            label="Umpire Proficiency"
            value={`${umpireProficiency}`}
            onChange={(v) => setUmpireProficiency(+v!)}
            size="sm"
            data={[
              { label: 'Court One', value: '3' },
              { label: 'Mixed', value: '2' },
              { label: 'Court Two', value: '1' },
              { label: 'Emergency', value: '-1' },
              { label: 'None', value: '0' },
            ]}
          />
          <Select
            value={`${scorerProficiency}`}
            onChange={(v) => setScorerProficiency(+v!)}
            label="Scorer Proficiency"
            size="sm"
            data={[
              { label: 'Scorer', value: '3' },
              { label: 'Reserve', value: '2' },
              { label: 'Emergency', value: '1' },
              { label: 'None', value: '0' },
            ]}
          ></Select>
        </Stack>
      </Group>
    </Paper>
  );
}

export function TeamCreatorPage({ tournament }: TeamCreatorPageArgs) {
  const [tournamentObj, setTournamentObj] = React.useState<TournamentStructure | undefined>();
  const [players, setPlayers] = React.useState<(string | undefined)[]>([
    undefined,
    undefined,
    undefined,
  ]);
  const [newTournamentName, setNewTournamentName] = useState<string>();
  const [openTournamentEdit, setOpenTournamentEdit] = useState<boolean>(false);
  const [fixturesType, setFixturesType] = useState<string>();
  const [finalsType, setFinalsType] = useState<string>();
  const [teamsInTournament, setTeamsInTournament] = React.useState<TeamStructure[]>([]);
  const [newTeamName, setNewTeamName] = React.useState<string | undefined>();
  const [officialsInTournament, setOfficialsInTournament] = React.useState<OfficialStructure[]>([]);
  const [allOfficials, setAllOfficials] = React.useState<OfficialStructure[]>([]);
  const [allTeams, setAllTeams] = React.useState<TeamStructure[]>([]);
  const [allPlayers, setAllPlayers] = React.useState<PersonStructure[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { loading, isTournamentDirector } = useUserData();
  useEffect(() => {
    if (!tournament) return;
    getTournament(tournament).then((t) => {
      setTournamentObj(t);
      setFixturesType(t.fixturesType);
      setFinalsType(t.finalsType);
      setNewTournamentName(t.name);
    });
    getTeams({ tournament }).then((t) => setTeamsInTournament(t.teams));
    getOfficials({ tournament }).then((o) => setOfficialsInTournament(o.officials));
  }, [tournament]);
  useEffect(() => {
    getPlayers({}).then((p) => setAllPlayers(p.players));
    getTeams({}).then((t) => setAllTeams(t.teams));
    getOfficials({}).then((o) => setAllOfficials(o.officials));
  }, []);
  useEffect(() => {
    if (!loading && !isTournamentDirector(tournament)) {
      router.push('/');
    }
  }, [isTournamentDirector, loading, router, tournament]);
  if (!loading && !isTournamentDirector) {
    return <Text>You do not have permissions to be here!</Text>;
  }
  if (loading) {
    return <Text>Loading</Text>;
  }
  return (
    <div>
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
        <Modal opened={openTournamentEdit} onClose={() => setOpenTournamentEdit(false)}>
          <Title>Edit Tournament</Title>
          <TextInput
            label="Name"
            value={newTournamentName}
            onChange={(e) => setNewTournamentName(e.target.value)}
          />
          <Select
            label="Fixtures Type"
            placeholder="Pick value"
            data={[{ label: 'Round Robin', value: 'RoundRobin' }, 'Pooled', 'Swiss']}
            value={fixturesType}
            onChange={(v) => setFixturesType(v!)}
            allowDeselect={false}
          />
          <Select
            label="Finals Type"
            placeholder="Pick value"
            data={[
              { value: 'BasicFinals', label: 'Basic Finals' },
              { value: 'PooledFinals', label: 'Pooled Finals' },
              { value: 'TopThreeFinals', label: 'Top Three Finals' },
            ]}
            value={finalsType}
            onChange={(v) => setFinalsType(v!)}
            allowDeselect={false}
          />
          <Button
            m={5}
            color="green"
            onClick={() =>
              updateTournament({
                searchableName: tournament,
                name: newTournamentName,
                fixturesType,
                finalsType,
              })
            }
          >
            Submit
          </Button>
        </Modal>
        <Box
          w={100}
          mih={100}
          pos="relative"
          style={{ paddingBottom: 100 }}
          className={classes.hoverImage}
        >
          <Image
            pos="absolute"
            src={tournamentObj?.imageUrl ?? `${SERVER_ADDRESS}/api/image?name=blank`}
            w="100px"
            h="100px"
          ></Image>
          <Text
            size="sm"
            pos="absolute"
            h={100}
            w={100}
            m="auto"
            style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            Change Image
          </Text>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              uploadTournamentImage(file, tournament).then((t) => {
                setTournamentObj(t);
              });
            }}
          />
        </Box>
        <Title ta="center">{tournamentObj?.name ?? 'Loading...'}</Title>

        <Group>
          <Button
            m={10}
            size="md"
            color="blue"
            variant="outline"
            onClick={() => setOpenTournamentEdit(true)}
          >
            Edit
          </Button>
          <Popover width={200} position="top" withArrow shadow="md">
            <Popover.Target>
              <Button m={10} size="md" color="green" variant="outline">
                Start
              </Button>
            </Popover.Target>
            <Popover.Dropdown ta="center">
              <Text m={5}>Are you sure you want to start?</Text>
              <Button
                m={5}
                color="green"
                onClick={() => {
                  startTournament(tournament);
                }}
              >
                Confirm
              </Button>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Container>
      <Grid w="95%">
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Title ta="center" order={2}>
            Teams
          </Title>
          {teamsInTournament.map((t, index) => (
            <TeamCard
              key={index}
              tournament={tournament}
              team={t}
              setTeamsInTournament={setTeamsInTournament}
              teamsInTournament={teamsInTournament}
              setAllTeams={setAllTeams}
            />
          ))}
          <CustomTeamCard
            setPlayers={setPlayers}
            players={players}
            allTeams={allTeams}
            allPlayers={allPlayers}
            newTeamName={newTeamName}
            setNewTeamName={setNewTeamName}
            tournament={tournament}
            setTeamsInTournament={setTeamsInTournament}
            teamsInTournament={teamsInTournament}
          ></CustomTeamCard>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Title ta="center" order={2}>
            Officials
          </Title>
          <Grid>
            {officialsInTournament.map((t, index) => (
              <Grid.Col key={index} span={6}>
                <OfficialCard
                  tournament={tournament}
                  official={t}
                  setOfficialsInTournament={setOfficialsInTournament}
                  officialsInTournament={officialsInTournament}
                />
              </Grid.Col>
            ))}
            <Grid.Col span={6}>
              <CustomOfficialCard
                allOfficials={allOfficials}
                officialsInTournament={officialsInTournament}
                setOfficialsInTournament={setOfficialsInTournament}
                tournament={tournament}
              ></CustomOfficialCard>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </div>
  );
}
