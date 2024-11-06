'use client';

import React, { useEffect } from 'react';
import useSWR from 'swr';
import { Table, Text } from '@mantine/core';
import { fetcher, SERVER_ADDRESS } from '@/components/HandballComponenets/ServerActions';
import { toTitleCase } from '@/tools/tools';

interface FixturesResults {
  fixtures: GameStructure[][];
}

const numberToSize = ['', 'xs', 'sm', 'md', 'lg', 'xl'];

interface FixturesProps {
  maxRounds?: number;
  tournament: string;
}

export default function Fixtures({ maxRounds = -1, tournament }: FixturesProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  const url = `${SERVER_ADDRESS}/api/games/fixtures?tournament=${tournament}`;
  console.log(url);
  const { data, error, isLoading } = useSWR<FixturesResults>(url, fetcher);
  const [chartData, setChartData] = React.useState<GameStructure[][]>([]);
  useEffect(() => {
    setChartData(data?.fixtures ?? []);
  }, [data]);
  if (error) return `An error has occurred: ${error.message}`;
  if (isLoading) return 'Loading...';

  return (
    <div>
      <Table stickyHeader>
        <Table.Thead style={{ color: 'var(--mantine-color-green-8)' }}>
          <Table.Tr>
            <Table.Th style={{ width: '50px', textAlign: 'center' }}>
              <Text>Team One</Text>
            </Table.Th>
            <Table.Th style={{ width: '10px', textAlign: 'center' }}></Table.Th>
            <Table.Th style={{ width: '50px', textAlign: 'center' }}>
              <Text>Team One</Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {chartData.map((value, index) => {
            if (index > maxRounds && maxRounds > 0) return null;
            return (
              <>
                <Table.Tr key={100 * index - 1}>
                  <Table.Th colSpan={10} style={{ textAlign: 'center' }}>
                    <Text><b>Round {index + 1}</b></Text>
                  </Table.Th>
                </Table.Tr>
                {value.map((game, index2) => (
                  <Table.Tr key={100 * index + index2} style={{ textAlign: 'center' }}>
                    <Table.Td>
                      <Text>{game.teamOne.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>VS</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{game.teamTwo.name}</Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
}
