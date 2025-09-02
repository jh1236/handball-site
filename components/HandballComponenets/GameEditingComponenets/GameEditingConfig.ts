const cardReasons = [
  'Delay of Game',
  'Dangerous Play',
  'Disrespectful Behaviour',
  'Disrespectful Language',
  'Equipment Abuse',
  'Inappropriate Uniform',
];

export const GAME_CONFIG = {
  scoreMethods: [
    'Double Bounce',
    'Straight',
    'Out of Court',
    'Double Touch',
    'Grabs',
    'Illegal Body Part',
    'Obstruction',
  ],

  cards: {
    warning: [
      'Audible Swearing',
      'Delay of Game',
      'Missed Post-game Handshake',
      'Unreasonable Carry',
    ],
    green: cardReasons,
    yellow: cardReasons,
    red: cardReasons,
  },
};
