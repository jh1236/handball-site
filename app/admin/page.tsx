'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCheck, IconMoodSad } from '@tabler/icons-react';
import {
  Button,
  Code,
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
import { createTournament } from '@/ServerActions/TournamentActions';

export default function UniversalManagementPage() {
  const { isAdmin, loading } = useUserData();
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [name, setName] = useState<string>();
  const [fixturesType, setFixturesType] = useState<string>();
  const [finalsType, setFinalsType] = useState<string>();
  const [openCreateTournament, setOpenCreateTournament] = useState<boolean>(false);
  const [openBackup, setOpenBackup] = useState<boolean>(false);
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
    if (!loading && !isAdmin) {
      router.push('/');
    } else {
      getLog().then(setLog);
    }
  }, [isAdmin, loading, router]);
  return (
    <SidebarLayout>
      <Title>Admin Page</Title>
      <Modal
        opened={openCreateTournament}
        onClose={() => {
          setOpenCreateTournament(false);
          setSubmitted(false);
        }}
      >
        <Title>Create Tournament</Title>
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          error={!name && submitted ? 'Value must be set for name' : undefined}
        ></TextInput>
        <Select
          label="Fixtures Type"
          placeholder="Pick value"
          data={[{ label: 'Round Robin', value: 'RoundRobin' }, 'Pooled', 'Swiss']}
          value={fixturesType}
          onChange={(v) => setFixturesType(v!)}
          allowDeselect={false}
          error={!fixturesType && submitted ? 'Value must be set for fixtures type' : undefined}
        />
        <Select
          label="Finals Type"
          placeholder="Pick value"
          data={[
            { value: 'BasicFinals', label: 'Basic Finals' },
            { value: 'PooledFinals', label: 'Pooled Finals' },
            { value: 'TopThreeFinals', label: 'Top Three Finals' },
          ]}
          value={finalsType}
          onChange={(v) => setFinalsType(v!)}
          allowDeselect={false}
          error={!finalsType && submitted ? 'Value must be set for finals type' : undefined}
        />
        <br />
        <Button
          onClick={() => {
            setSubmitted(true);
            if (!name || !fixturesType || !finalsType) {
              return;
            }
            createTournament({ name, fixturesType, finalsType }).then(() =>
              setOpenCreateTournament(false)
            );
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
