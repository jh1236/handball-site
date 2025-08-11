'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text } from '@mantine/core';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getTournaments } from '@/ServerActions/TournamentActions';

export default function LatestSubPage({ params }: { params: { route: string[] } }) {
  const { route } = params;
  const router = useRouter();
  useEffect(() => {
    getTournaments().then((tournaments) => {
      router.push(`/${tournaments.toReversed()[0].searchableName}/${route?.join('/') ?? ''}`);
    });
  }, [route, router]);
  return (
    <SidebarLayout>
      <Text>Redirecting...</Text>
    </SidebarLayout>
  );
}
