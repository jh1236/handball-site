'use client';

import React, { ElementType, Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { IconChevronRight } from '@tabler/icons-react';
import {
  Box,
  Collapse,
  Group,
  rem,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import classes from '@/components/Sidebar/NavbarLinksGroup.module.css';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  link?: string;
  action?: () => void;
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link,
  action,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((l) => (
    <Text<'a'>
      component="a"
      className={classes.link}
      href={l.link}
      key={l.label}
      onClick={(event) => event.preventDefault()}
    >
      {l.label}
    </Text>
  ));
  if (action) {
    useEffect(() => {
      if (opened) {
        action();
        setOpened(false);
      }
    }, [opened]);
  }
  const { colorScheme } = useMantineColorScheme();
  const out = (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon color="green" variant={colorScheme ? 'light' : undefined} size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
  if (link) {
    return (
      <Link href={link} className="hideLink">
        {out}
      </Link>
    );
  }
  return out;
}
