'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCheck, IconMoodSad } from '@tabler/icons-react';
import { Button, Code, Group, Loader, Popover, Title } from '@mantine/core';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import {
  getLog,
  requestBackup,
  requestClearLog,
  requestServerUpdate,
} from '@/ServerActions/AdminActions';

export default function UniversalManagementPage() {
  const { isAdmin, loading } = useUserData();
  const router = useRouter();
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
    if (!loading && !isAdmin()) {
      router.push('/');
    } else {
      getLog().then(setLog);
    }
  }, [isAdmin, loading, router]);
  return (
    <SidebarLayout>
      <Title>Admin Page</Title>
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
