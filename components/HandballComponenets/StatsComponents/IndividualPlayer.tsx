'use client';

import React, { Fragment, useEffect } from 'react';
import {
  IconAlertTriangle,
  IconChartScatter,
  IconClock2,
  IconSettings,
  IconTable,
} from '@tabler/icons-react';
import { Container, Image, Table, Tabs, Text, Title } from '@mantine/core';
import { isUmpireManager } from '@/components/HandballComponenets/ServerActions';
import { getAveragePlayerStats, getPlayer } from '@/ServerActions/PlayerActions';
import { PersonStructure } from '@/ServerActions/types';

interface PlayersProps {
  tournament?: string;
  player: string;
}

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
    'Green Cards',
    'Yellow Cards',
    'Red Cards',
    'Warnings',
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

export default function IndividualPlayer({ tournament, player }: PlayersProps) {
  // const [sort, setSort] = React.useState<number>(-1);

  const [chartData, setChartData] = React.useState<PersonStructure | undefined>(undefined);
  const [averageStats, setAverageStats] = React.useState<
    { stats: { [p: string]: any } } | undefined
  >(undefined);
  useEffect(() => {
    getPlayer({ player, tournament, formatData: true, includeStats: true }).then((o) => {
      console.log(Object.keys(o.player.stats));
      setChartData(o.player);
    });
    getAveragePlayerStats({ tournament, formatData: true }).then((o) => {
      setAverageStats(o);
      console.log(Object.keys(o.stats));
    });
  }, [player, tournament]);
  return (
    <>
      <Container w="auto" p={20} mb={10} pos="relative" style={{ overflow: 'hidden' }}>
        <Image
          alt="The SUSS handball Logo"
          src={chartData?.imageUrl ?? 'https://api.squarers.club/image?name=blank'}
          h="100"
          w="auto"
          m="auto"
        ></Image>
        <Title ta="center">{chartData?.name}</Title>
      </Container>
      <Tabs defaultValue="stats">
        <Tabs.List grow>
          <Tabs.Tab value="stats" leftSection={<IconTable size={12} />}>
            Statistics
          </Tabs.Tab>
          <Tabs.Tab value="prevGames" leftSection={<IconClock2 size={12} />}>
            Previous Games
          </Tabs.Tab>
          <Tabs.Tab value="graphs" leftSection={<IconChartScatter size={12} />}>
            Graphs
          </Tabs.Tab>
          {isUmpireManager() && (
            <Tabs.Tab value="mgmt" leftSection={<IconAlertTriangle size={12} />}>
              Management
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="stats" w="100%">
          {Object.entries(CATEGORIES).map(([title, stats], index) => (
            <Fragment key={index}>
              <Title ta="center">{title}</Title>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w="33%" ta="center">
                      Stat
                    </Table.Th>
                    <Table.Th w="33%" ta="center">
                      Player Value
                    </Table.Th>
                    <Table.Th w="33%" ta="center">
                      Average Value
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {stats.map((stat, key) => (
                    <Table.Tr key={key}>
                      <Table.Th ta="center">{stat}</Table.Th>
                      <Table.Td ta="center">{chartData?.stats[stat]}</Table.Td>
                      <Table.Td ta="center">{averageStats?.stats[stat] ?? '-'}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Fragment>
          ))}
        </Tabs.Panel>

        <Tabs.Panel value="prevGames">Messages tab content</Tabs.Panel>

        <Tabs.Panel value="charts">Settings tab content</Tabs.Panel>

        <Tabs.Panel value="mgmt">Settings tab content</Tabs.Panel>
      </Tabs>
    </>
  );
}
