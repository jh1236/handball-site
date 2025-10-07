'use client';

import { createTheme, DEFAULT_THEME } from '@mantine/core';

export const theme = createTheme({
  colors: {
    tournament: DEFAULT_THEME.colors.green,
    'serving-color': DEFAULT_THEME.colors.teal,
    'player-color': DEFAULT_THEME.colors.blue,
    'blitz-serving-color': DEFAULT_THEME.colors.green,
    'blitz-player-color': DEFAULT_THEME.colors.teal,
  },
});
