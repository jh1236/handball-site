'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { getTournament } from '@/ServerActions/TournamentActions';
import { TournamentStructure } from '@/ServerActions/types';
import {Box, Center, Modal, Paper, Text, FocusTrap, Title} from "@mantine/core";

interface BestDressedPageArgs {
  tournamentName: string;
}

function voteForTeam() {}

export default function BestDressedPage({ tournamentName }: BestDressedPageArgs) {
  const [tournament, setTournament] = useState<TournamentStructure>();
  useEffect(() => {
    getTournament(tournamentName).then(setTournament);
  }, [tournamentName]);
  const { loading, isLoggedIn } = useUserData();
  if (loading || !tournament) {
    return <p>loading...</p>;
  }
  if (!isLoggedIn) {
    return (
        <>
          <Center h="100vh">
            <Paper h={150} w={300} bg="gray.3" shadow="md">
              <Text >NOT OK. LOGIN</Text>
            </Paper>
          </Center>
        </>
    );
  }
  
  if (tournament.finished || tournament.name === 'suss_practice') {
    return (
        <>
          <Center h="100vh">
            <Paper h={150} w={300} bg="gray.3" shadow="md">
              <Text >NOT OK. LOGIN</Text>
            </Paper>
          </Center>
        </>
    )
  }
  return (
    <>
      <Title>Vote for Best Dressed for {tournament.name}</Title>
    </>
  );
}
