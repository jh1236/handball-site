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
  Title,
  useMantineColorScheme,
  useMatches,
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
  sidebarVisible?: boolean;
  tournamentName?: string;
  setSidebarVisible: (prevState: boolean) => void;
  mobile?: boolean;
}

export function NavbarNested({
  sidebarVisible,
  tournamentName,
  setSidebarVisible,
  mobile = false,
}: NavbarNestedProps) {
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
  const ref = React.createRef<HTMLElement>();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.transition = '0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    }
  }, [ref.current]);
  useEffect(() => {
    IconColorScheme = colorScheme === 'light' ? IconMoon : IconSun;
  }, [colorScheme]);

  const w = mobile ? '100vw' : '300px';

  return (
    <div style={{ float: 'left', marginRight: '5px' }}>
      <nav
        className={classes.navbar}
        ref={ref}
        style={{ width: w, marginLeft: sidebarVisible !== mobile ? 0 : `-${w}`, float: 'left' }}
      >
        {mobile && (
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
              style={{
                float: 'right',
              }}
            >
              {sidebarVisible !== mobile ? (
                <IconLayoutSidebarLeftCollapse style={{ width: rem(18), height: rem(18) }} />
              ) : (
                <IconLayoutSidebarLeftExpand
                  style={{ width: rem(18), height: rem(18) }}
                ></IconLayoutSidebarLeftExpand>
              )}
            </ThemeIcon>
          </Box>
        )}
        <div className={classes.header}>
          <Link href="/" className="hideLink">
            <Group justify="space-between">
              <Image
                width={40}
                height={40}
                style={{ width: '40px', margin: 0 }}
                src={myTournament?.imageUrl || `${SERVER_ADDRESS}/api/image?name=SUSS`}
              />
              <Box style={{ overflowWrap: 'break-word', width: '70%', margin: 0 }}>
                <Title order={4}>
                  {myTournament?.name || 'Squarers United Sporting Syndicate'}
                </Title>
              </Box>
            </Group>
          </Link>
        </div>

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner} style={{ overflowY: 'scroll' }}>
            {links}
          </div>
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
    </div>
  );
}
