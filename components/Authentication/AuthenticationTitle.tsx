'use client';

import React, { useEffect } from 'react';
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

export function AuthenticationTitle() {
  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem('username')) {
      router.push(`/players/${searchableOf(localStorage.getItem('username')!)}`);
    }
  }, [router]);

  function authenticate(id: string, pwd: string, remember: boolean): Promise<void> {
    return loginAction(id, pwd, remember)
      .then(() => {
        router.push(`/players/${searchableOf(localStorage.getItem('username')!)}`);
      })
      .catch((passwordError: string) => {
        setError(passwordError);
      });
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
        <TextInput
          value={userId}
          onChange={(v) => setUserId(v.target.value)}
          label="Id"
          placeholder="0"
          required
        />
        <PasswordInput
          error={error || undefined}
          value={password}
          onChange={(v) => setPassword(v.target.value)}
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <Group justify="space-between" mt="lg">
          <Checkbox
            label="Remember me"
            defaultChecked={rememberMe}
            onChange={(v) => setRememberMe(v.target.checked)}
          />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" onClick={() => authenticate(userId, password, rememberMe)}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
