import { Box, Center, Image } from '@mantine/core';
import React from 'react';
import { GameStructure } from '@/ServerActions/types';
import classes from './CustomTournamentScoreboardEffects.module.css'

export function customTournamentScoreboardEffects(game: GameStructure) {
  return (
    <Box pos="absolute" w="100%" h="100%">
      {game.events.map((e) => e.eventType)}
      {game.tournament.name}
      {game.events.at(-2).eventType === 'Ace'
        ? <Image w={500} className={classes.sonicAce} src="https://preview.redd.it/is-super-sonic-getting-stale-v0-xhcczammw3yc1.png?auto=webp&s=14fc42600b19342703fefd81828bf83f81e736d6"></Image>
        : <p>no :(</p>}
    </Box>
);
}
