import React from 'react';
import { Box, Image } from '@mantine/core';
import { GameStructure } from '@/ServerActions/types';
import classes from './CustomTournamentScoreboardEffects.module.css';

function fakeRandom(seed: number) {
  //used so that we can have a seeded rng
  const x = Math.sin(Math.floor(seed)) * 10000;
  return x - Math.floor(x);
}

export function customTournamentScoreboardEffects(game?: GameStructure) {
  if (!game) return null;
  const events = (game?.events ?? []).filter((a) => a.notes !== 'Penalty');
  if (!events.length) {
    return null;
  }
  if (game.tournament.name === 'eighth_suss_championship') return eighthTournamentScoreboard(game);
  return null;
}

function eighthTournamentScoreboard(game: GameStructure) {
  const events = (game.events ?? []).filter((a) => a.notes !== 'Penalty');
  const event = events.at(-1);
  if (!event) return null;
  switch (event.eventType) {
    case 'Score':
      switch (event.notes) {
        case 'Ace':
          return (
            <Box pos="absolute" w="100%" h="100%" style={{ overflow: 'hidden' }}>
              <Image
                m="auto"
                w={500}
                className={classes.sonicAce}
                src="https://preview.redd.it/is-super-sonic-getting-stale-v0-xhcczammw3yc1.png?auto=webp&s=14fc42600b19342703fefd81828bf83f81e736d6"
              ></Image>
            </Box>
          );
        default: {
          const maxPos = window.innerWidth / 2.5;
          const minPos = 0;
          const pos = `calc(50% ${event.firstTeam ? '-' : '+'} ${fakeRandom(game.changeCode) * (maxPos - minPos) + minPos}px)`;
          /*const pos = events.at(-1).firstTeam
            ? `calc(${Math.floor(Math.random() * (maxPos - minPos) + minPos)})`
            : `calc(100% - ${Math.floor(Math.random() * (maxPos - minPos) + minPos)}px)`;*/
          return (
            <Box pos="absolute" w="100vw" h="100vh" style={{ overflow: 'hidden' }}>
              <Image
                src="https://media.tenor.com/42FLUDoGy58AAAAj/sonic-ring-sonic.gif"
                w={50}
                key={game.changeCode}
                className={classes.ring}
                style={{ position: 'absolute', left: pos, top: '50%' }}
              ></Image>
            </Box>
          );
        }
      }
  }
  return null;
}
