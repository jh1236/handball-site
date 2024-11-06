import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  IconAB,
  IconAddressBook,
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconHome,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLock,
  IconMoon,
  IconPresentationAnalytics,
  IconSun,
  IconUser,
} from '@tabler/icons-react';
import useSWR from 'swr';
import {
  Box,
  Code,
  Group,
  Image,
  rem,
  ScrollArea,
  ThemeIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { fetcher, SERVER_ADDRESS } from '@/components/HandballComponenets/ServerActions';
import { LinksGroup } from '@/components/Sidebar/NavbarLinksGroup';
import classes from '@/components/Sidebar/NavbarNested.module.css';

function makeSidebarLayout(tournaments: TournamentStructure[], currentTournament?: string) {
  const out: {
    label: string;
    icon: React.ForwardRefExoticComponent<any>;
    links?: { label: string; link: string }[];
    link?: string;
  }[] = [
    { label: 'Home', icon: IconHome, link: '/home' },
    {
      label: 'Tournaments',
      icon: IconAddressBook,
      links: tournaments.map((t) => ({ link: `/${t.searchableName}`, label: t.name })),
    },
  ];
  if (currentTournament) {
    out.push({
      label: 'Current Tournament',
      icon: IconAB,
      links: [
        { label: 'Fixtures', link: `/${currentTournament}/fixtures` },
        { label: 'Ladder', link: `/${currentTournament}/ladder` },
        { label: 'Players', link: `/${currentTournament}/players` },
        { label: 'Officials', link: `/${currentTournament}/officials` },
      ],
    });
  }
  out.push(
    {
      label: 'Releases',
      icon: IconCalendarStats,
      links: [
        { label: 'Upcoming releases', link: '/' },
        { label: 'Previous releases', link: '/' },
        { label: 'Releases schedule', link: '/' },
      ],
    },
    { label: 'Analytics', icon: IconPresentationAnalytics },
    { label: 'Contracts', icon: IconFileAnalytics },
    { label: 'Settings', icon: IconAdjustments },
    {
      label: 'Security',
      icon: IconLock,
      links: [
        { label: 'Enable 2FA', link: '/' },
        { label: 'Change password', link: '/' },
        { label: 'Recovery codes', link: '/' },
      ],
    }
  );
  return out;
}

interface NavbarNestedProps {
  sidebar?: boolean;
  setSidebar: (value: boolean) => void;
  tournamentName?: string;
}

export function NavbarNested({ sidebar, setSidebar, tournamentName }: NavbarNestedProps) {
  const [myTournament, setMyTournament] = React.useState<TournamentStructure | undefined>(
    undefined
  );
  const [tournaments, setTournaments] = React.useState<TournamentStructure[]>([]);
  const links = makeSidebarLayout(tournaments, tournamentName).map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  const url = `${SERVER_ADDRESS}/api/tournaments/`;
  const { data } = useSWR<{ tournaments: TournamentStructure[] }>(url, fetcher);

  useEffect(() => {
    if (data) {
      setTournaments(data.tournaments);
      if (tournamentName) {
        setMyTournament(data.tournaments.find((t) => t.searchableName === tournamentName));
      }
    }
  }, [data]);

  const { colorScheme, setColorScheme } = useMantineColorScheme();

  let IconColorScheme = IconSun;

  const flipColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };
  useEffect(() => {
    IconColorScheme = colorScheme === 'light' ? IconMoon : IconSun;
  }, [colorScheme]);

  return (
    <div style={{ float: 'left' }}>
      <nav className={classes.navbar} style={{ marginLeft: sidebar ? 0 : '-300px', float: 'left' }}>
        <div className={classes.header}>
          <Link href="/" className="hideLink">
            <Group justify="space-between">
              <Image
                width={60}
                height={60}
                style={{ width: '60px' }}
                src={myTournament?.imageUrl || `${SERVER_ADDRESS}/api/image?name=SUSS`}
              />
              <h1>{myTournament?.name || 'Squarers United Sporting Syndicate'}</h1>
              <Code fw={700}>v0.0.1</Code>
            </Group>
          </Link>
        </div>

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>

        <div className={classes.footer}>
          <div style={{ width: '60%', float: 'left' }}>
            <LinksGroup label="User" icon={IconUser} key="User" />
          </div>
          <div style={{ width: '40%', float: 'right' }}>
            <LinksGroup label="Theme" icon={IconColorScheme} key="Theme" action={flipColorScheme} />
          </div>
        </div>
      </nav>
      <div
        style={{
          display: 'flex',
        }}
      >
        <Box
          style={{
            alignItems: 'center',
            margin: '10px',
          }}
          onClick={() => setSidebar(!sidebar)}
        >
          <ThemeIcon color="green" variant={colorScheme ? 'light' : undefined} size={30}>
            {sidebar ? (
              <IconLayoutSidebarLeftCollapse style={{ width: rem(18), height: rem(18) }} />
            ) : (
              <IconLayoutSidebarLeftExpand
                style={{ width: rem(18), height: rem(18) }}
              ></IconLayoutSidebarLeftExpand>
            )}
          </ThemeIcon>
        </Box>
      </div>
    </div>
  );
}
