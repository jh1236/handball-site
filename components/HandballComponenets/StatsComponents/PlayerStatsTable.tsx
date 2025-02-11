'use client';

import React, { Fragment, useEffect } from 'react';
import { Table } from '@mantine/core';
import { getAveragePlayerStats } from '@/ServerActions/PlayerActions';
import {
  PersonStructure,
  PlayerGameStatsStructure,
  TeamStructure,
  TournamentStructure,
} from '@/ServerActions/types';

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

export default function PlayerStatsTable({
  team,
  teamPlayers,
  persons,
  tournament,
}: {
  team?: TeamStructure;
  teamPlayers?: boolean;
  persons?: PersonStructure[];
  tournament?: string;
}) {
  const [averageStats, setAverageStats] = React.useState<
    { stats: { [p: string]: any } } | undefined
  >(undefined);
  useEffect(() => {
    getAveragePlayerStats({
      tournament,
      formatData: true,
    }).then((o) => {
      setAverageStats(o);
    });
  }, [tournament]);
  if (!team && !teamPlayers && !persons) {
    return <p>error!</p>;
  }
  if (team && !team.stats) {
    return <p>no stats found for {team.name}</p>;
  }
  let rows: any[] = [];
  let headers: any[] = [];
  let players: (PersonStructure | PlayerGameStatsStructure)[] = [];
  const TA: string = 'Center';
  const statsTable = [];

  if (team && !teamPlayers) {
    for (const k of Object.keys(team.stats)) {
      statsTable.push({
        stat: k,
        teamStat: team.stats[k],
      });
    }
    rows = statsTable.map((s) => (
      <Table.Tr key={s.stat}>
        <Table.Td ta={TA}>{s.stat}</Table.Td>
        <Table.Td ta={TA}>{s.teamStat}</Table.Td>
      </Table.Tr>
    ));
    headers = [
      <Table.Th w="80%" ta={TA}>
        Team Stats
      </Table.Th>,
    ];
  }
  if (team && teamPlayers) {
    players = [team.captain, team.nonCaptain, team.substitute].filter((p) => p != null);
  } else if (persons) {
    players = persons;
  }
  if (players.length > 0) {
    rows = Object.entries(CATEGORIES).map(([title, stats]) => (
      <Fragment key={title}>
        <Table.Tr ta={TA}>
          <Table.Th ta={TA} colSpan={4}>
            {title}
          </Table.Th>
        </Table.Tr>
        {stats
          .filter((stat) => Object.keys(players[0].stats).includes(stat))
          .map((stat) => (
            <Table.Tr key={stat}>
              <Table.Td ta={TA}>{stat}</Table.Td>
              {players.map((p) => (
                <Table.Td ta={TA}>{p.stats[stat]}</Table.Td>
              ))}
              <Table.Td ta={TA}>{averageStats?.stats[stat]}</Table.Td>
            </Table.Tr>
          ))}
      </Fragment>
    ));
    headers = [
      players.map((p) => (
        <Table.Th ta={TA} w={`${80 / (players.length + 1)}%`}>
          <a href={`../players/${p.searchableName}`} className="hideLink">
            {p.name}
          </a>
        </Table.Th>
      )),
    ];
    headers.push(<Table.Th ta={TA}>Average Stats</Table.Th>);
  }
  const table = (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="20%" ta={TA}>
            Statistic
          </Table.Th>
          {headers}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
  return <>{table}</>;
}
