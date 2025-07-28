'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Button, LoadingOverlay } from '@mantine/core';
import { CreatePlayerButton } from '@/components/HandballComponenets/GameCreatingComponents/CreatePlayerButton';
import { CreateTeamButton } from '@/components/HandballComponenets/GameCreatingComponents/CreateTeamButton';
import { GameSettings } from '@/components/HandballComponenets/GameCreatingComponents/GameSettings';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { getPlayers } from '@/ServerActions/PlayerActions';
import { getTeams } from '@/ServerActions/TeamActions';
import { PersonStructure, TeamStructure } from '@/ServerActions/types';

export default function CreateGamePage() {
  const [teams, setTeams] = React.useState<TeamStructure[]>([]);
  const [players, setPlayers] = React.useState<PersonStructure[]>([]);
  const [teamOneRight, setTeamOneRight] = useState<string | undefined>(undefined);
  const [teamOneLeft, setTeamOneLeft] = useState<string | undefined>(undefined);
  const [teamOneName, setTeamOneName] = useState<string | undefined>('');
  const [teamTwoRight, setTeamTwoRight] = useState<string | undefined>(undefined);
  const [teamTwoLeft, setTeamTwoLeft] = useState<string | undefined>(undefined);
  const [teamTwoName, setTeamTwoName] = useState<string | undefined>('');
  const { isOfficial } = useUserData();
  useEffect(() => {
    getPlayers({}).then((t) => setPlayers(t.players));
    getTeams({}).then((t) => setTeams(t.teams.filter((a) => !a.substitute)));
  }, []);

  const loginProps = (
    <>
      To use this page you must be logged in
      <br />
      <br />
      <Link href="/login">
        <Button size="lg">To Login page</Button>
      </Link>
    </>
  );

  return (
    <Box style={{ width: '100%', height: '100vh' }}>
      <LoadingOverlay
        overlayProps={{
          color: '#222',
          blur: 15,
        }}
        visible={!isOfficial('suss_practice')}
        loaderProps={{ children: loginProps }}
      />
      <Box style={{ width: '100%', height: '40%' }}>
        <Box style={{ width: '50%', height: '90%', float: 'left' }}>
          <CreatePlayerButton
            players={players}
            player={teamOneRight}
            setPlayer={(a) => {
              setTeamOneRight(a);
            }}
            leftSide={false}
          ></CreatePlayerButton>
        </Box>
        <Box style={{ width: '50%', height: '90%', float: 'right' }}>
          <CreatePlayerButton
            players={players}
            player={teamOneLeft}
            setPlayer={setTeamOneLeft}
            leftSide={true}
          ></CreatePlayerButton>
        </Box>
        <Box style={{ width: '100%', height: '10%', float: 'right' }}>
          <CreateTeamButton
            teams={teams}
            leftPlayer={teamOneLeft}
            rightPlayer={teamOneRight}
            setLeftPlayer={setTeamOneLeft}
            setRightPlayer={setTeamOneRight}
            teamName={teamOneName}
            setTeamName={setTeamOneName}
          ></CreateTeamButton>
        </Box>
      </Box>
      <Box
        style={{
          width: '100%',
          height: '20%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <GameSettings
          playersOne={[teamOneLeft, teamOneRight].filter((a) => typeof a === 'string')}
          playersTwo={[teamTwoLeft, teamTwoRight].filter((a) => typeof a === 'string')}
          teamNameOne={teamOneName}
          teamNameTwo={teamTwoName}
        ></GameSettings>
      </Box>
      <Box style={{ width: '100%', height: '40%' }}>
        <Box style={{ width: '100%', height: '10%', float: 'right' }}>
          <CreateTeamButton
            teams={teams}
            leftPlayer={teamTwoLeft}
            rightPlayer={teamTwoRight}
            setLeftPlayer={setTeamTwoLeft}
            setRightPlayer={setTeamTwoRight}
            setTeamName={setTeamTwoName}
            teamName={teamTwoName}
          ></CreateTeamButton>
        </Box>
        <Box style={{ width: '50%', height: '90%', float: 'left' }}>
          <CreatePlayerButton
            players={players}
            player={teamTwoLeft}
            setPlayer={setTeamTwoLeft}
            leftSide={true}
          ></CreatePlayerButton>
        </Box>
        <Box style={{ width: '50%', height: '90%', float: 'right' }}>
          <CreatePlayerButton
            players={players}
            player={teamTwoRight}
            setPlayer={setTeamTwoRight}
            leftSide={false}
          ></CreatePlayerButton>
        </Box>
      </Box>
    </Box>
  );
}
