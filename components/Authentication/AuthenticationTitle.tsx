'use client';

import React from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { searchableOf } from '@/components/HandballComponenets/ServerActions';
import { loginAction } from '@/ServerActions/LoginActions';
import classes from './AuthenticationTitle.module.css';

function authenticate(id: string, pwd: string, router: AppRouterInstance): Promise<void> {
  return loginAction(id, pwd)
    .then((data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('permissionLevel', `${data.permissionLevel}`);
      router.push(`/players/${searchableOf(localStorage.getItem('username'))}`);
    })
    .catch((error) => {
      alert('wrong details!');
    });
}

export function AuthenticationTitle() {
  const id = React.useRef<HTMLInputElement>(null);
  const pwd = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const username = localStorage.getItem('username');

  if (username) {
    location.href = `/players/${searchableOf(username)}`;
    return <></>;
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput ref={id} label="Id" placeholder="0" required />
        <PasswordInput ref={pwd} label="Password" placeholder="Your password" required mt="md" />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button
          fullWidth
          mt="xl"
          onClick={() => authenticate(id.current!.value, pwd.current!.value, router)}
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
