'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCheck, IconMoodSad } from '@tabler/icons-react';
import {
  Box,
  Button,
  Code,
  ColorPicker,
  Group,
  Loader,
  Modal,
  Popover,
  Select,
  TextInput,
  Title,
} from '@mantine/core';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import {
  getLog,
  requestBackup,
  requestClearLog,
  requestServerUpdate,
} from '@/ServerActions/AdminActions';
import { createTournament, getFixtureTypes } from '@/ServerActions/TournamentActions';

export default function UniversalManagementPage() {
  const { isAdmin, loading } = useUserData();
  const router = useRouter();
  const [name, setName] = useState<string>();
  const [fixturesType, setFixturesType] = useState<string>();
  const [finalsType, setFinalsType] = useState<string>();
  const [color, setColor] = useState<string>('#5c9865');
  const [validTournamentColor, setValidTournamentColor] = useState<boolean>(false);
  const [openCreateTournament, setOpenCreateTournament] = useState<boolean>(false);
  const [openBackup, setOpenBackup] = useState<boolean>(false);
  const [fixturesTypes, setFixturesTypes] = useState<string[]>([]);
  const [finalsTypes, setFinalsTypes] = useState<string[]>([]);
  const [openRestart, setOpenRestart] = useState<boolean>(false);
  const [log, _setLog] = useState<string>('\n'.repeat(30));
  const [response, setResponse] = useState<string | null>(null);
  const setLog = (val: string): void => {
    let a = val;
    while (a.split('\n').length < 31) {
      a = `\n${a}`;
    }
    const split = a.split('\n');
    if (split.length > 31) {
      a = split.slice(split.length - 30, split.length).join('\n');
    }
    _setLog(a);
  };
  useEffect(() => {
    getFixtureTypes().then((f) => {
      setFixturesTypes(f.fixturesTypes);
      setFinalsTypes(f.finalsTypes);
    });
  }, []);
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    } else {
      getLog().then(setLog);
    }
  }, [isAdmin, loading, router]);
  useEffect(() => {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      /*checks that the string fits within hex format*/
      setValidTournamentColor(true);
    } else {
      setValidTournamentColor(false);
    }
  }, [color]);
  return (
    <SidebarLayout>
      <Title>Admin Page</Title>
      <Modal
        opened={openCreateTournament}
        onClose={() => {
          setOpenCreateTournament(false);
        }}
      >
        <Title>Create Tournament</Title>
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        ></TextInput>
        <Select
          label="Fixtures Type"
          placeholder="Pick value"
          data={fixturesTypes}
          value={fixturesType}
          onChange={(v) => setFixturesType(v!)}
          allowDeselect={false}
        />
        <Select
          label="Finals Type"
          placeholder="Pick value"
          data={finalsTypes}
          value={finalsType}
          onChange={(v) => setFinalsType(v!)}
          allowDeselect={false}
        />
        <Box>
          <TextInput
            label="Tournament Color"
            value={color}
            onChange={(e) => setColor(e.currentTarget.value)}
            error={!validTournamentColor}
          ></TextInput>
          <ColorPicker
            mt={5}
            format="hex"
            onChange={setColor}
            value={color}
            fullWidth
          ></ColorPicker>
        </Box>
        <br />
        <Button
          data-disabled={!validTournamentColor || !name || !finalsType || !fixturesType}
          onClick={() => {
            if (!name || !fixturesType || !finalsType || !color) {
              return;
            }
            createTournament({
              name,
              color,
              fixturesType,
              finalsType,
            }).then(() => setOpenCreateTournament(false));
          }}
        >
          Create
        </Button>
      </Modal>
      <Group>
        <Popover opened={openBackup} onClose={() => setOpenBackup(false)}>
          <Popover.Target>
            <Button
              onClick={() => {
                setResponse(null);
                setOpenBackup(true);
                requestBackup()
                  .then(() => setResponse('All good!'))
                  .catch(() => setResponse('Bad :('));
              }}
            >
              Request Database Backup
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            {response === null && <Loader color="blue" />}
            {response === 'All good!' && <IconCheck></IconCheck>}
            {response === 'Bad :(' && <IconMoodSad></IconMoodSad>}
          </Popover.Dropdown>
        </Popover>
        <Popover opened={openRestart} onClose={() => setOpenRestart(false)}>
          <Popover.Target>
            <Button
              onClick={() => {
                setResponse(null);
                setOpenRestart(true);
                requestServerUpdate()
                  .then(() => setResponse('All good!'))
                  .catch(() => setResponse('Bad :('));
              }}
            >
              Request Server Update
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            {response === null && <Loader color="blue" />}
            {response === 'All good!' && <IconCheck></IconCheck>}
            {response === 'Bad :(' && <IconMoodSad></IconMoodSad>}
          </Popover.Dropdown>
        </Popover>
        <Button
          onClick={() => {
            setOpenCreateTournament(true);
          }}
        >
          Create Tournament
        </Button>
      </Group>
      <br />
      <Code block h="100%">
        {log}
      </Code>
      <br />
      <Button onClick={() => requestClearLog().then(() => setLog(''))}>Clear Log</Button>
    </SidebarLayout>
  );
}
