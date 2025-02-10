'use client';

import React, { Fragment, useEffect } from 'react';
import { IconAlertTriangle, IconClock2, IconTable } from '@tabler/icons-react';
import {
    Box,
} from '@mantine/core';
import { eventIcon } from '@/components/HandballComponenets/AdminGamePanel';
import { getGames } from '@/ServerActions/GameActions';
import { getAveragePlayerStats, getPlayer } from '@/ServerActions/PlayerActions';
import {
    GameStructure,
    GameTeamStructure,
    PersonStructure,
    PlayerGameStatsStructure, TeamStructure,
} from '@/ServerActions/types';

export default function playerStatsTable({ team, person } : { team?: TeamStructure, person?: PersonStructure }) {
    if (person) {
 return (<p>I am a person :3 my name is {person.name }</p>);
    } if (team) {
        return (<p>hi. my name is {team.name}</p>);
    }
        return (<p>theres nothing here tt</p>);
}

/*
const CATEGORIES = {
  'Ace and Serve Metrics': [
    'Aces Scored',
    'Serve Ace Rate',
    'Aces per Game',
    'Average Ace Streak',
    'Max Ace Streak',
    'Serves per Ace',
    'Serves per Fault',
    'Serves per Game',
    'Serves Received',
    'Serves Returned',
    'Serve Return Rate',
    'Max Serve Streak',
    'Average Serve Streak',
  ],
  'Fault and Error Metrics': ['Faults', 'Double Faults', 'Faults per Game', 'Serve Fault Rate'],
  'Points and Scoring Metrics': [
    'Points Scored',
    'Points Served',
    'Percentage of Points Scored',
    'Percentage of Points Scored For Team',
    'Percentage of Points Served Won',
    'Points per Game',
    'Points per Loss',
  ],
  'Game and Match Metrics': [
    'Games Played',
    'Rounds on Court',
    'Percentage of Games Starting Left',
    'Games Won',
    'Games Lost',
    'Percentage',
  ],
  'Card and Penalty Metrics': [
    'Cards',
    'Warnings',
    'Green Cards',
    'Yellow Cards',
    'Red Cards',
    'Rounds Carded',
    'Cards per Game',
    'Penalty Points',
    'Points per Card',
  ],
  'Rating and Voting Metrics': [
    'Elo',
    'Net Elo Delta',
    'Average Elo Delta',
    'Average Rating',
    'B&F Votes',
    'Votes per 100 Games',
  ],
};
*/


// {Object.entries(CATEGORIES).map(([title, stats], index) => (
//             <Fragment key={index}>
//               <Title ta="center">{title}</Title>
//               <Table>
//                 <Table.Thead>
//                   <Table.Tr>
//                     <Table.Th w="33%" ta="center">
//                       Stat
//                     </Table.Th>
//                     <Table.Th w="33%" ta="center">
//                       Player Value
//                     </Table.Th>
//                     <Table.Th w="33%" ta="center">
//                       Average Value
//                     </Table.Th>
//                   </Table.Tr>
//                 </Table.Thead>
//                 <Table.Tbody>
//                   {stats
//                     .filter((a) => Object.keys(playerObj?.stats ?? []).includes(a))
//                     .map((stat, key) => (
//                       <Table.Tr key={key}>
//                         <Table.Th ta="center">{stat}</Table.Th>
//                         <Table.Td ta="center">{playerObj?.stats[stat] ?? '-'}</Table.Td>
//                         <Table.Td ta="center">{averageStats?.stats[stat] ?? '-'}</Table.Td>
//                       </Table.Tr>
//                     ))}
//                 </Table.Tbody>
//               </Table>
//             </Fragment>
//           ))}