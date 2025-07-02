'use client';

import React, { useEffect, useState } from 'react';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import {
  ActionIcon,
  Autocomplete,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { SERVER_ADDRESS } from '@/app/config';
import { getPlayers } from '@/ServerActions/PlayerActions';
import { getTeams } from '@/ServerActions/TeamActions';
import {
  addTeamToTournament,
  getTournament,
  removeTeamFromTournament,
} from '@/ServerActions/TournamentActions';
import {
  PersonStructure,
  SearchableName,
  TeamStructure,
  TournamentStructure,
} from '@/ServerActions/types';

interface TeamCreatorPageArgs {
  tournament: SearchableName;
}

const SIDES = ['Captain', 'Non-Captain', 'Substitute'];

function PlayerCard({ player, index }: { player: PersonStructure; index: number }) {
  return (
    <div>
      <Image
        src={player.imageUrl ?? `${SERVER_ADDRESS}/api/image?name=blank`}
        style={{
          width: 50,
          verticalAlign: 'middle',
          marginRight: 5,
        }}
        display="inline-block"
      />
      <b>{SIDES[index]}: </b>
      {player.name}
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
      />
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
      return;
    }
    setTeam(undefined);
  }, [players, allTeams]);
  // @ts-ignore
  return (
    <Paper shadow="lg" m={15} pos="relative" style={{ padding: '5px' }}>
      <Group>
        <Stack>
          <ActionIcon
            variant="subtle"
            color="green"
            size="sm"
            pos="absolute"
            top={5}
            right={5}
            onClick={() => {
              if (team) {
                addTeamToTournament({
                  tournament,
                  teamName: team.name,
                });
                setTeamsInTournament([...teamsInTournament, team]);
              } else {
                const [captainName, nonCaptainName, substituteName] = players;
                addTeamToTournament({
                  tournament,
                  teamName: newTeamName,
                  captainName: players[0],
                  ...(captainName && { captainName }),
                  ...(nonCaptainName && { nonCaptainName }),
                  ...(substituteName && { substituteName }),
                });
              }
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
            error={newTeamName || false}
            placeholder="Team Name"
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

export function TeamCreatorPage({ tournament }: TeamCreatorPageArgs) {
  const [tournamentObj, setTournamentObj] = React.useState<TournamentStructure | undefined>();
  const [players, setPlayers] = React.useState<(string | undefined)[]>([
    undefined,
    undefined,
    undefined,
  ]);
  const [teamsInTournament, setTeamsInTournament] = React.useState<TeamStructure[]>([]);
  const [newTeamName, setNewTeamName] = React.useState<string | undefined>();
  const [allTeams, setAllTeams] = React.useState<TeamStructure[]>([]);
  const [allPlayers, setAllPlayers] = React.useState<PersonStructure[]>([]);
  useEffect(() => {
    getTournament(tournament).then(setTournamentObj);
    getTeams({ tournament }).then((t) => setTeamsInTournament(t.teams));
  }, [tournament]);
  useEffect(() => {
    getPlayers({}).then((t) => setAllPlayers(t.players));
    getTeams({}).then((t) => setAllTeams(t.teams));
  }, []);

  return (
    <div>
      <Title> {tournamentObj?.name ?? 'Loading...'} </Title>
      <Grid w="95%">
        <Grid.Col span={{ sm: 12, md: 6 }}>
          {teamsInTournament.map((t, index) => (
            <Paper key={index} shadow="lg" m={15} pos="relative">
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                pos="absolute"
                top={5}
                right={5}
                onClick={() => {
                  removeTeamFromTournament(tournament, t.searchableName);
                }}
              >
                <IconMinus></IconMinus>
              </ActionIcon>
              <Group>
                <Image src={t.imageUrl} w="auto" h="100px"></Image>
                <Stack>
                  {[t.captain, t.nonCaptain, t.substitute]
                    .filter((t1) => t1 !== null)
                    .map((player, i) => (
                      <PlayerCard key={i} index={i} player={player} />
                    ))}
                </Stack>
              </Group>
            </Paper>
          ))}
          <CustomTeamCard
            setPlayers={setPlayers}
            players={players}
            allTeams={allTeams}
            allPlayers={allPlayers}
            newTeamName={newTeamName}
            setNewTeamName={setNewTeamName}
            tournament={tournament}
            setTeamsInTournament={setAllTeams}
            teamsInTournament={teamsInTournament}
          ></CustomTeamCard>
        </Grid.Col>
      </Grid>
    </div>
  );
}
