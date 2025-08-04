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
      setTeamName(t.name);
      return;
    }
    setTeamName('');
  }, [leftPlayer, rightPlayer, setTeamName, teams]);

  useEffect(() => {
    if (!teamName || teamName === '') return;
    const t = teams.find((t2) => t2.name === teamName);
    if (!t) return;
    const namesFromTeam = getPlayersFromTeam(t).toSorted();
    const namesFromForm = [leftPlayer, rightPlayer].filter((a) => a !== undefined).toSorted();
    if (JSON.stringify(namesFromTeam) === JSON.stringify(namesFromForm)) return;
    setTeamName(t.name);
    setLeftPlayer(namesFromTeam[0]);
    setRightPlayer(namesFromTeam[1]);
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [close, setLeftPlayer, setRightPlayer, setTeamName, teamName, teams]);

  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title>{teamName ? 'Select Team' : 'Choose Team Name'}</Title>
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
        color="player-color.5"
        style={{
          width: '100%',
          height: '100%',
        }}
        onClick={open}
      >
        <b>{teamName !== '' ? teamName : <i>New Team</i>}</b>
      </Button>
    </>
  );
}
