import React from 'react';
import { Autocomplete, Button, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PersonStructure } from '@/ServerActions/types';

interface CreatePlayerButtonProps {
  players: PersonStructure[];
  player?: string;
  setPlayer: (v: string | undefined) => void;
  leftSide: boolean;
}

export function CreatePlayerButton({
  players,
  player,
  setPlayer,
  leftSide,
}: CreatePlayerButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const name = players.length ? (player ?? 'Choose Player') : 'Loading...';
  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title>Select Player</Title>
        <Autocomplete
          label="Player"
          placeholder="John Doe"
          data={players.map((a) => a.name)}
          value={player}
          onChange={(v) => setPlayer(v.trim() === '' ? undefined : v)}
        />
      </Modal>
      <Button
        size="lg"
        radius={0}
        color={`blue.${leftSide ? 7 : 9}`}
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
        }}
        onClick={open}
      >
        {name}
      </Button>
    </>
  );
}
