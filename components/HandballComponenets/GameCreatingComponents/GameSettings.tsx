import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Popover, Select } from '@mantine/core';
import { createGameWithPlayers } from '@/ServerActions/GameActions';
import { OfficialStructure, TournamentStructure } from '@/ServerActions/types';

interface GameSettingsArgs {
  officials: OfficialStructure[];
  official: OfficialStructure | undefined;
  setOfficial: (v: OfficialStructure) => void;
  tournament?: TournamentStructure;
  setTournament: (v: TournamentStructure) => void;
  tournaments: TournamentStructure[];
  playersOne: string[];
  playersTwo: string[];
  teamNameOne?: string;
  teamNameTwo?: string;
}

export function GameSettings({
  officials,
  official,
  setOfficial,
  setTournament,
  tournament,
  tournaments,
  playersOne,
  playersTwo,
  teamNameOne,
  teamNameTwo,
}: GameSettingsArgs) {
  const [openedTournaments, setOpenedTournaments] = useState(false);
  const [openedOfficials, setOpenedOfficials] = useState(false);
  const router = useRouter();
  return (
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
      <Box
        style={{
          display: 'flex',
          flex: 'auto',
          alignContent: 'center',
          justifyContent: 'center',
          width: 'fit-content',
        }}
      >
        <Popover
          opened={openedOfficials}
          onChange={setOpenedOfficials}
          width={300}
          position="bottom"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Button size="sm" onClick={() => setOpenedOfficials(true)}>
              {official?.name ?? 'Pick an official'}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Select
              label="Official"
              allowDeselect={false}
              placeholder="Pick value"
              data={officials.map((a) => ({ value: a.searchableName, label: a.name }))}
              value={official?.name ?? 'Pick official'}
              onChange={(v) => {
                setOfficial(officials.find((a) => a.searchableName === v)!);
                setOpenedOfficials(false);
              }}
              comboboxProps={{ withinPortal: false }}
            />
          </Popover.Dropdown>
        </Popover>
      </Box>
      <Box
        style={{
          margin: '0px auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flex: '5',
        }}
      >
        <Button
          size="sm"
          onClick={() => {
            createGameWithPlayers(
              tournament?.searchableName ?? 'suss_practice',
              playersOne,
              playersTwo,
              official?.searchableName,
              undefined,
              teamNameOne,
              teamNameTwo
            )
              .then((id) => {
                router.push(`/games/${id}/edit`);
              })
              .catch(() => alert('Learn to use a basic ui!'));
          }}
        >
          Create
        </Button>
      </Box>

      <Box
        style={{
          display: 'flex',
          flex: 'auto',
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        <Popover
          opened={openedTournaments}
          onChange={setOpenedTournaments}
          width={300}
          position="bottom"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Button size="sm" onClick={() => setOpenedTournaments(true)}>
              {tournament?.name ?? 'SUSS Practice'}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Select
              label="Tournament"
              allowDeselect={false}
              placeholder="Pick value"
              data={tournaments.map((a) => ({ value: a.searchableName, label: a.name }))}
              value={tournament?.name ?? 'SUSS Practice'}
              onChange={(v) => {
                setTournament(tournaments.find((a) => a.searchableName === v)!);
                setOpenedTournaments(false);
              }}
              comboboxProps={{ withinPortal: false }}
            />
          </Popover.Dropdown>
        </Popover>
      </Box>
    </Box>
  );
}
