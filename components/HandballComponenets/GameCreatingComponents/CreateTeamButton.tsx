import React, { useEffect } from 'react';
import { Autocomplete, Button, Modal, Select, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TeamStructure } from '@/ServerActions/types';

interface CreateTeamButtonProps {
  teams: TeamStructure[];
  leftPlayer?: string;
  rightPlayer?: string;
  setLeftPlayer: (v: string) => void;
  setRightPlayer: (v: string) => void;
  teamName: string | undefined;
  setTeamName: (v: string) => void;
}

function getPlayersFromTeam(team: TeamStructure) {
  return [team.captain, team.nonCaptain].map((a) => (a ? a.name : undefined));
}

export function CreateTeamButton({
  teams,
  leftPlayer,
  rightPlayer,
  setLeftPlayer,
  setRightPlayer,
  teamName,
  setTeamName,
}: CreateTeamButtonProps) {
  const [team, setTeam] = React.useState<TeamStructure | undefined>(undefined);

  useEffect(() => {
    for (const t of teams) {
      const players = getPlayersFromTeam(t);
      if (!players.includes(leftPlayer)) continue;
      if (!players.includes(rightPlayer)) continue;
      let fail = false;
      for (const p of players) {
        fail ||= ![leftPlayer, rightPlayer].includes(p);
      }
      if (fail) continue;
      setTeam(t);
      setTeamName(t.name);
      return;
    }
    if (team) {
      setTeamName('');
    }
    setTeam(undefined);
  }, [leftPlayer, rightPlayer, teams]);

  useEffect(() => {
    if (!teamName || teamName === 'New Team') return;
    const t = teams.find((t) => t.name === teamName);
    if (!t) return;
    setLeftPlayer(t!.captain.name);
    setRightPlayer(t!.nonCaptain?.name);
    close();
  }, [teamName]);

  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title>{team ? 'Select Team' : 'Choose Team Name'}</Title>
        <Autocomplete
          label="Player"
          placeholder="New Team"
          data={[...new Set(teams.map((a) => a.name))]}
          value={teamName}
          onChange={setTeamName}
        />
      </Modal>
      <Button
        radius={0}
        size="lg"
        color="blue.5"
        style={{
          width: '100%',
          height: '100%',
        }}
        onClick={open}
      >
        <b>{team?.name ?? (teamName !== '' ? teamName : <i>New Team</i>)}</b>
      </Button>
    </>
  );
}
