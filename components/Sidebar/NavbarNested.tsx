import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconGauge,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLock,
  IconMoon,
  IconNotes,
  IconPresentationAnalytics,
  IconSun,
  IconUser,
} from '@tabler/icons-react';
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
import { SERVER_ADDRESS } from '@/components/HandballComponenets/ServerActions';
import { LinksGroup } from '@/components/Sidebar/NavbarLinksGroup';
import classes from '@/components/Sidebar/NavbarNested.module.css';

const mockdata = [
  { label: 'Dashboard', icon: IconGauge, link: '/home' },
  {
    label: 'Market news',
    icon: IconNotes,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
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
  },
];

interface NavbarNestedProps {
  sidebar?: boolean;
  setSidebar: (value: boolean) => void;
}

export function NavbarNested({ sidebar, setSidebar }: NavbarNestedProps) {
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

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
                width={40}
                height={40}
                style={{ width: '40px' }}
                src={`${SERVER_ADDRESS}/api/image?name=SUSS`}
              />
              <h1>This is a test</h1>
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
