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
import { getPlayer } from '@/ServerActions/PlayerActions';
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
  useEffect(() => {
    getPlayer({ player, tournament, game: undefined, formatData: true }).then((o) =>
      setChartData(o.player)
    );
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
      <Tabs defaultValue="gallery">
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
              <Title>{title}</Title>
              <Table>
                <Table.Tbody>
                  {stats.map((stat, key) => (
                    <Table.Tr key={key}>
                      <Table.Th w="20%">{stat}</Table.Th>
                      <Table.Td w="25%" ta="center">
                        {chartData?.stats[stat]}
                      </Table.Td>
                      <Table.Td w="25%" ta="center">
                        {chartData?.stats[stat]}
                      </Table.Td>
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
