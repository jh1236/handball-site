'use client';

import React, { useEffect } from 'react';
import { Autocomplete, Image, Paper, Title } from '@mantine/core';
import { getPlayers } from '@/ServerActions/PlayerActions';
import { PersonStructure, SearchableName } from '@/ServerActions/types';

interface TeamCreatorPageArgs {
  tournament?: SearchableName;
}

interface PlayerSelectorBoxArgs {
  foo: (arg: string) => void;
  player?: PersonStructure;
  players: PersonStructure[];
  title: string;
}

function PlayerSelectorBox({ foo, player, players, title }: PlayerSelectorBoxArgs) {
  return (
    <Paper shadow="sm" style={{ height: '80px', width: '400px', border: 'solid black 1px' }}>
      <div style={{ width: '300px', height: '100%', background: '#0001', alignItems: 'center' }}>
        <Autocomplete
          label={title}
          placeholder="John Doe"
          data={players.map((a) => a.name)}
          onChange={foo}
          style={{ width: '80%', margin: 'auto' }}
        />
      </div>
      <div style={{ height: '130px' }}>
        <Image src={player?.imageUrl} h="90%" fit="contain" />
      </div>
    </Paper>
  );
}

export function TeamCreatorPage({ tournament }: TeamCreatorPageArgs) {
  const [players, setPlayers] = React.useState<PersonStructure[]>([]);
  const [captain, setCaptain] = React.useState<PersonStructure>();
  useEffect(() => {
    getPlayers({ tournament }).then((t) => setPlayers(t.players));
  });
  return (
    <div>
      <Title> {tournament} </Title>
      <Paper shadow="xl" style={{ height: '250px', margin: 'auto', alignItems: 'center' }}>
        <PlayerSelectorBox
          foo={(a: string) => setCaptain(players.find((p) => p.name === a))}
          player={captain}
          players={players}
          title="Captain"
        />
      </Paper>
      <p>{captain?.name}</p>
    </div>
  );
}
