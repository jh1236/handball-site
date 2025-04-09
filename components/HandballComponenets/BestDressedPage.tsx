'use client';

import React, { useEffect, useState } from 'react';
import { Box, Center, Grid, Image, Paper, Text, Title } from '@mantine/core';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { getTeams } from '@/ServerActions/TeamActions';
import { getTournament } from '@/ServerActions/TournamentActions';
import { TeamStructure, TournamentStructure } from '@/ServerActions/types';

interface BestDressedPageArgs {
  tournamentName: string;
}

function generateTeamBlock(team: TeamStructure, percentage: number) {
  if (!team) {
    return null;
  }
  return (
    <Paper h={200} bg="gray" fw={700} pos="relative" style={{ zIndex: 50 }}>
      <Box w="30%" style={{ overflow: 'hidden' }}>
        <Image src={team.imageUrl} style={{ zIndex: 100 }}></Image>
      </Box>
      <Box
        pos="absolute"
        top={0}
        style={{ zIndex: 0 }}
        bg="red"
        w="100%"
        mih={`${100 * percentage}%`}
      ></Box>
    </Paper>
  );
}

export default function BestDressedPage({ tournamentName }: BestDressedPageArgs) {
  const [tournament, setTournament] = useState<TournamentStructure>();
  useEffect(() => {
    getTournament(tournamentName).then(setTournament);
  }, [tournamentName]);
  const { loading, isLoggedIn } = useUserData();
  const [teams, setTeams] = useState<TeamStructure[]>([]);
  useEffect(() => {
    getTeams({ tournament: tournamentName }).then((o) => setTeams(o.teams));
  }, [tournamentName]);

  function generateTeamsTable() {
    if (!teams) return null;
    return teams.map((t) => (
      <Grid.Col span={{ base: 6, lg: 3 }}>{generateTeamBlock(t, 0.3)}</Grid.Col>
    ));
  }

  if (loading || !tournament) {
    return <p>loading...</p>;
  }
  if (!isLoggedIn) {
    return (
      <>
        <Center h="100vh">
          <Paper h={150} w={300} bg="gray.3" shadow="md">
            <Text>NOT OK. LOGIN</Text>
          </Paper>
        </Center>
      </>
    );
  }
  /*if (tournament.finished || tournament.name === 'suss_practice') {
                          return (
                              <>
                                <Center h="100vh">
                                  <Paper h={150} w={300} bg="gray.3" shadow="md">
                                    <Text>NOT OK. LOGIN</Text>
                                  </Paper>
                                </Center>
                              </>
                          );
                        }*/
  return (
    <>
      <Center>
        <Image
          src={tournament?.imageUrl ?? 'https://api.squarers.club/api/image?name=SUSS'}
          alt="The SUSS handball Logo"
          h="100"
          w="auto"
        ></Image>
      </Center>
      <Center>
        <Text />
        <Title ta="center">{tournament?.name ?? 'Loading...'}</Title>
      </Center>
      <Grid w="99.5%">{generateTeamsTable()}</Grid>
    </>
  );
}
