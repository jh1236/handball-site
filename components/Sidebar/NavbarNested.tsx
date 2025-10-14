import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconAddressBook,
  IconAdjustments,
  IconChartPie,
  IconFileAnalytics,
  IconHome,
  IconLadder,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMoon,
  IconNote,
  IconSun,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import { GiWhistle } from 'react-icons/gi';
import {
  Box,
  Button,
  Group,
  Image,
  Popover,
  rem,
  ScrollArea,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { SERVER_ADDRESS } from '@/app/config';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { LinksGroup } from '@/components/Sidebar/NavbarLinksGroup';
import buttonClasses from '@/components/Sidebar/NavbarLinksGroup.module.css';
import classes from '@/components/Sidebar/NavbarNested.module.css';
import { logoutAction } from '@/ServerActions/LoginActions';
import { TournamentStructure } from '@/ServerActions/types';

interface NavbarNestedProps {
  sidebarVisible?: boolean;
  currentTournament?: TournamentStructure;
  tournaments: TournamentStructure[];
  setSidebarVisible: (prevState: React.SetStateAction<boolean>) => void;
  mobile?: boolean;
}

export function NavbarNested({
  sidebarVisible,
  currentTournament,
  tournaments = [],
  setSidebarVisible,
  mobile = false,
}: NavbarNestedProps) {
  const [openUserActions, setOpenUserActions] = React.useState<boolean>(false);
  const { isOfficial, isAdmin, username, isUmpireManager } = useUserData();
  const [mounted, setMounted] = React.useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function makeSidebarLayout() {
    const out: {
      label: string;
      icon: React.ElementType;
      links?: { label: string; link: string; color?: string }[];
      link?: string;
    }[] = [
      { label: 'Home', icon: IconHome, link: '/' },
      {
        label: 'Tournaments',
        icon: IconAddressBook,
        links: tournaments.map((t) => ({
          link: `/${t.searchableName}`,
          label: t.name,
          color: t.color,
        })),
      },
    ];
    if (currentTournament) {
      out.push({
        label: 'Current Tournament',
        icon: IconChartPie,
        links: [
          { label: 'Home', link: `/${tournamentName}` },
          { label: 'Fixtures', link: `/${tournamentName}/fixtures` },
          { label: 'Ladder', link: `/${tournamentName}/ladder` },
          { label: 'Players', link: `/${tournamentName}/players` },
          { label: 'Officials', link: `/${tournamentName}/officials` },
          { label: 'Teams', link: `/${tournamentName}/teams` },
        ],
      });
      if (isUmpireManager(currentTournament?.searchableName)) {
        if (currentTournament?.started) {
          out[out.length - 1].links!.push({
            label: 'Manage',
            link: `/${currentTournament.searchableName}/manage`,
          });
        } else {
          out[out.length - 1].links!.push({
            label: 'Setup',
            link: `/${currentTournament.searchableName}/setup`,
          });
        }
      }
    }
    out.push(
      { label: 'Lifetime Ladder', icon: IconLadder, link: '/ladder' },
      { label: 'Lifetime Players', icon: IconUser, link: '/players' },
      { label: 'Lifetime Officials', icon: GiWhistle, link: '/officials' },
      { label: 'Lifetime Teams', icon: IconUsersGroup, link: '/teams' }
    );
    if (isOfficial('suss_practice')) {
      out.push({ label: 'Create Game', icon: IconNote, link: '/games/create' });
    }
    out.push({ label: 'Documents', icon: IconFileAnalytics, link: '/documents' });
    if (isAdmin) {
      out.push({ label: 'Admin', icon: IconAdjustments, link: '/admin' });
    }
    out.push({ label: 'About us', icon: IconUsers, link: '/about' });
    return out;
  }

  const links = makeSidebarLayout().map((item) => <LinksGroup {...item} key={item.label} />);

  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const flipColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };
  const ref = React.createRef<HTMLElement>();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.transition = '0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    }
  }, [ref]);

  const router = useRouter();

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
              color="tournament"
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
                src={
                  currentTournament?.imageUrl ||
                  `${SERVER_ADDRESS}/api/image?name=SUSS${colorScheme === 'dark' ? '' : '_light'}`
                }
              />
              <Box style={{ overflowWrap: 'break-word', width: '70%', margin: 0 }}>
                <Title order={4}>
                  {currentTournament?.name || 'Squarers United Sporting Syndicate'}
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
            <Popover opened={openUserActions} onClose={() => setOpenUserActions(false)}>
              <Popover.Target>
                <UnstyledButton
                  className={buttonClasses.control}
                  onClick={
                    username === null
                      ? () => {
                          router.push('/login');
                        }
                      : () => setOpenUserActions(true)
                  }
                >
                  <Group justify="space-between" gap={0}>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ThemeIcon
                        color="tournament"
                        variant={colorScheme ? 'light' : undefined}
                        size={30}
                      >
                        <IconUser
                          style={{
                            width: rem(18),
                            height: rem(18),
                          }}
                        />
                      </ThemeIcon>
                      <Box ml="md">{username ?? 'Login'}</Box>
                    </Box>
                  </Group>
                </UnstyledButton>
              </Popover.Target>
              <Popover.Dropdown>
                <Button onClick={() => logoutAction().then(() => window.location.reload())}>
                  Logout
                </Button>
              </Popover.Dropdown>
            </Popover>
          </div>
          <div style={{ width: '40%', float: 'right' }}>
            <LinksGroup
              label="Theme"
              icon={mounted && colorScheme === 'light' ? IconMoon : IconSun}
              key="Theme"
              action={flipColorScheme}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}
