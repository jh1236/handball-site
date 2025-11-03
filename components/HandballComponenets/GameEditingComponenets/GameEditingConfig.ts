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
  faultMethods: [
    'Served Early',
    "Didn't Go Diagonal",
    'Out through BRA',
    'Double Bounce',
    'Straight',
    'Foot Fault',
    'Incorrect Side',
    'Teammate in BRA',
  ],

  cards: {
    warning: cardReasons,
    green: cardReasons,
    yellow: cardReasons,
    red: cardReasons,
  },
};
