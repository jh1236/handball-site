'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, rem, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from '@/components/Sidebar/NavbarLinksGroup.module.css';

interface LinksGroupProps {
  icon: React.JSX.ElementType;
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
    <Text<'a'> component="a" className={classes.link} href={l.link} key={l.label}>
      {l.label}
    </Text>
  ));
  useEffect(() => {
    if (opened && action) {
      action();
      setOpened(false);
    }
  }, [action, opened]);
  const out = (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ThemeIcon color="tournament" variant="light" size={30}>
              <Icon
                style={{
                  width: rem(18),
                  height: rem(18),
                }}
              />
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
