'use client';

import '@mantine/core/styles.css';

import React, { useEffect, useMemo } from 'react';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { generateColors } from '@mantine/colors-generator';
import { Box, createTheme, DEFAULT_THEME, MantineProvider, rem, ThemeIcon } from '@mantine/core';
import { NavbarNested } from '@/components/Sidebar/NavbarNested';
import { getTournaments } from '@/ServerActions/TournamentActions';
import { TournamentStructure } from '@/ServerActions/types';

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
  const [tournaments, setTournaments] = React.useState<TournamentStructure[]>([]);
  const currentTournament = useMemo(
    () => tournaments.find((t) => t.searchableName === tournamentName),
    [tournamentName, tournaments]
  );
  useEffect(() => {
    getTournaments({}).then(setTournaments);
  }, []);
  const theme = useMemo(
    () =>
      createTheme({
        colors: {
          tournament: currentTournament
            ? generateColors(currentTournament.color)
            : DEFAULT_THEME.colors.green,
        },
      }),
    [currentTournament]
  );

  return (
    <div>
      <MantineProvider theme={theme}>
        <Box hiddenFrom="md">
          <NavbarNested
            sidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
            tournaments={tournaments}
            currentTournament={currentTournament}
            mobile
          ></NavbarNested>
        </Box>
        <Box visibleFrom="md">
          <NavbarNested
            sidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
            tournaments={tournaments}
            currentTournament={currentTournament}
          ></NavbarNested>
        </Box>
        <Box
          style={{
            overflowY: 'scroll',
            height: '100vh',
            transition: '0.6s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          display={{
            base: !sidebarVisible ? 'none' : 'block',
            md: 'block',
          }}
          w={{
            base: !sidebarVisible ? '0' : 'auto',
            md: 'auto',
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
              color="tournament"
              variant="filled"
              size={30}
              style={{ marginTop: '10px', zIndex: 9999 }}
              pos="absolute"
            >
              {sidebarVisible ? (
                <IconLayoutSidebarLeftCollapse style={{ width: rem(18), height: rem(18) }} />
              ) : (
                <IconLayoutSidebarLeftExpand
                  style={{ width: rem(18), height: rem(18) }}
                ></IconLayoutSidebarLeftExpand>
              )}
            </ThemeIcon>
          </Box>
          <Box mt={40}>{children}</Box>
        </Box>
      </MantineProvider>
    </div>
  );
}
