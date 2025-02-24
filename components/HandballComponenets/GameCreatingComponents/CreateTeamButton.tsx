import React, { useEffect } from 'react';
import { Autocomplete, Button, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TeamStructure } from '@/ServerActions/types';

interface CreateTeamButtonProps {
  teams: TeamStructure[];
  leftPlayer?: string;
  rightPlayer?: string;
  setLeftPlayer: (v: string | undefined) => void;
  setRightPlayer: (v: string | undefined) => void;
  teamName: string | undefined;
  setTeamName: (v: string) => void;
}

export function makeUnique<T>(list: T[]) {
  return list.filter((value: T, index: number, array: T[]) => array.indexOf(value) === index);
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
  const [opened, { open, close }] = useDisclosure(false);

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
  }, [leftPlayer, rightPlayer, setTeamName, team, teams]);

  useEffect(() => {
    if (!teamName || teamName === 'New Team') return;
    const t = teams.find((t2) => t2.name === teamName);
    if (!t) return;
    if (rightPlayer === t.captain.name) {
      setRightPlayer(t!.captain.name);
      setLeftPlayer(t!.nonCaptain?.name);
    } else {
      setLeftPlayer(t!.captain.name);
      setRightPlayer(t!.nonCaptain?.name);
    }
    close();
  }, [close, rightPlayer, setLeftPlayer, setRightPlayer, teamName, teams]);

  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title>{team ? 'Select Team' : 'Choose Team Name'}</Title>
        <Autocomplete
          label="Team Name"
          placeholder="New Team"
          data={makeUnique(
            teams
              .toSorted((a, b) => a.searchableName.localeCompare(b.searchableName))
              .map((a) => a.name)
          )}
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
