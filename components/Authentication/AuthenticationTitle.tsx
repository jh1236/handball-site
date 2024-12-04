'use client';

import React from 'react';
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
import { tokenFetch } from '@/components/HandballComponenets/ServerActions';
import classes from './AuthenticationTitle.module.css';

async function authenticate(id: string, pwd: string): Promise<void> {
  return tokenFetch('/api/login/', {
    method: 'POST',
    body: JSON.stringify({
      userId: id,
      password: pwd,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      Error('Invalid login credential');
    }
    response.json().then((data) => {
      localStorage.setItem('token', data.token);
    });
  });
}

export function AuthenticationTitle() {
  const id = React.useRef<HTMLInputElement>(null);
  const pwd = React.useRef<HTMLInputElement>(null);
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
          onClick={() => authenticate(id.current!.value, pwd.current!.value)}
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
