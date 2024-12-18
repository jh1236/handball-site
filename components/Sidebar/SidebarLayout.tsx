'use client';

import '@mantine/core/styles.css';

import React from 'react';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { Box, rem, ThemeIcon, useMantineColorScheme } from '@mantine/core';
import { NavbarNested } from '@/components/Sidebar/NavbarNested';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function SidebarLayout({
  children,
  tournamentName,
}: {
  children: any;
  tournamentName?: string;
}) {
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(true);
  const { colorScheme } = useMantineColorScheme();
  return (
    <div>
      <Box hiddenFrom="md">
        <NavbarNested
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          tournamentName={tournamentName}
          mobile
        >
        </NavbarNested>
      </Box>
      <Box visibleFrom="md">
        <NavbarNested
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          tournamentName={tournamentName}
        >
        </NavbarNested>
      </Box>
      <div
        style={{
          overflowY: 'scroll',
          height: '100vh',
          marginLeft: '20px',
          transition: '0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <Box
          style={{
            alignItems: 'center',
            margin: '5px',
          }}
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          <ThemeIcon
            color="green"
            variant={colorScheme ? 'light' : undefined}
            size={30}
            style={{ marginTop: '20px' }}
          >
            {sidebarVisible ? (
              <IconLayoutSidebarLeftCollapse style={{ width: rem(18), height: rem(18) }} />
            ) : (
              <IconLayoutSidebarLeftExpand
                style={{ width: rem(18), height: rem(18) }}
              >
              </IconLayoutSidebarLeftExpand>
            )}
          </ThemeIcon>
        </Box>
        {children}
      </div>
    </div>
  );
}
