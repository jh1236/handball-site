'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Text, Title } from '@mantine/core';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { requestBackup } from '@/ServerActions/AdminActions';

export default function UniversalManagementPage() {
  const { isAdmin, loading } = useUserData();
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);
  useEffect(() => {
    if (!loading && !isAdmin()) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);
  return (
    <SidebarLayout>
      <Title>Admin Page</Title>
      <Button
        onClick={() =>
          requestBackup()
            .then(() => setResponse('All good!'))
            .catch(() => setResponse('Bad :('))
        }
      >
        Request Database Backup
      </Button>
      <Text>Response: {response ?? 'unset'}</Text>
    </SidebarLayout>
  );
}
