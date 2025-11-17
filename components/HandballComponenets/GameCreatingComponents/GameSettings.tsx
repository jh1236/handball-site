import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Center, Checkbox, Group, Popover, Select, Stack } from '@mantine/core';
import { useUserData } from '@/components/hooks/userData';
import { createGameWithPlayers } from '@/ServerActions/GameActions';
import { getOfficials } from '@/ServerActions/OfficialActions';
import { getTournaments } from '@/ServerActions/TournamentActions';
import { OfficialStructure, TournamentStructure } from '@/ServerActions/types';

interface GameSettingsArgs {
  playersOne: string[];
  playersTwo: string[];
  teamNameOne?: string;
  teamNameTwo?: string;
  blitzGame: boolean;
  setBlitzGame: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GameSettings({
  playersOne,
  playersTwo,
  teamNameOne,
  teamNameTwo,
  blitzGame,
  setBlitzGame,
}: GameSettingsArgs) {
  const [officials, setOfficials] = useState<OfficialStructure[]>([]);
  const [tournament, setTournament] = useState<TournamentStructure>();
  const [tournaments, setTournaments] = useState<TournamentStructure[]>([]);
  const [scorer, setScorer] = useState<OfficialStructure>();
  const [creating, setCreating] = useState<boolean>(false);
  const [official, setOfficial] = useState<OfficialStructure>();
  const { username } = useUserData();
  const router = useRouter();

  useEffect(() => {
    getOfficials({}).then((o) => setOfficials(o.officials));
    getTournaments({}).then((t) => setTournaments(t.filter((t2) => t2.editable)));
  }, []);

  useEffect(() => {
    setOfficial(officials.find((o) => o.name === username));
  }, [username, officials]);

  return (
    <Group w="100%">
      <Center w="33%">
        <Popover width={300} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button size="sm" color="player-color">
              Officials
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Center>
              <Stack>
                <Select
                  label="Official"
                  searchable
                  allowDeselect={false}
                  placeholder="Pick value"
                  data={officials.map((a) => ({ value: a.searchableName, label: a.name }))}
                  value={official?.searchableName}
                  onChange={(v) => {
                    setOfficial(officials.find((a) => a.searchableName === v)!);
                  }}
                  comboboxProps={{ withinPortal: false }}
                />

                <Select
                  label="Scorer"
                  allowDeselect={false}
                  placeholder="Pick value"
                  data={officials.map((a) => ({ value: a.searchableName, label: a.name }))}
                  value={scorer?.searchableName}
                  onChange={(v) => {
                    setScorer(officials.find((a) => a.searchableName === v)!);
                  }}
                  comboboxProps={{ withinPortal: false }}
                />
              </Stack>
            </Center>
          </Popover.Dropdown>
        </Popover>
      </Center>
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
          color="player-color"
          disabled={creating}
          onClick={() => {
            setCreating(true);
            createGameWithPlayers(
              'suss_practice',
              playersOne,
              playersTwo,
              blitzGame,
              official?.searchableName,
              scorer?.searchableName,
              teamNameOne,
              teamNameTwo
            )
              .then((id) => {
                router.push(`/games/${id}/edit`);
              })
              // TODO: We don't have proper error handling yet- maybe another one for Digby 🥺👉👈
              .catch(() => {
                setCreating(false);
                // eslint-disable-next-line no-alert
                alert('Learn to use a basic ui!');
              });
          }}
        >
          Create
        </Button>
      </Box>
      <Center w="33%">
        <Popover width={300} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button size="sm" color="player-color">
              Details
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Center>
              <Stack>
                <Select
                  label="Tournament"
                  allowDeselect={false}
                  placeholder="Pick value"
                  data={tournaments.map((a) => ({ value: a.searchableName, label: a.name }))}
                  value={tournament?.searchableName ?? 'suss_practice'}
                  onChange={(v) => {
                    setTournament(tournaments.find((a) => a.searchableName === v)!);
                  }}
                  comboboxProps={{ withinPortal: false }}
                />
                <Checkbox
                  checked={blitzGame}
                  onChange={(e) => setBlitzGame(e.currentTarget.checked)}
                  label="Blitz Game"
                  size="sm"
                />
              </Stack>
            </Center>
          </Popover.Dropdown>
        </Popover>
      </Center>
    </Group>
  );
}
