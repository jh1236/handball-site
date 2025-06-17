'use client';

import { Button, Stack } from '@mantine/core';
import { tokenFetch } from '@/components/HandballComponenets/ServerActions';

export default function FuckedUpEvilPage() {
  return (
    <Stack style={{ textAlign: 'center' }}>
      <Button size="xl" onClick={() => tokenFetch('https://api.squarers.club/api/stop?exit_code=2')}>
        Restart Backend with Pull
      </Button>
      <br />
      <br />
      <Button size="xl" onClick={() => tokenFetch('https://api.squarers.club/api/stop?exit_code=1')}>
        Restart Backend without Pull
      </Button>
      <br />
      <br />
      <Button size="xl" onClick={() => tokenFetch('https://api.squarers.club/api/stop?exit_code=3')}>
        Restart Backend and run test
      </Button>
      <br />
      <br />
      <Button size="xl" onClick={() => tokenFetch('https://api.squarers.club/api/stop?exit_code=4')}>
        Restart and Force Backend Commit
      </Button>
      <br />
      <br />
    </Stack>
  );
}
