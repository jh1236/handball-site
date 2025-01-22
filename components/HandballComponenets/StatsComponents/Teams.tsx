'use client';

import React, { useEffect } from 'react';
import { Table, Text } from '@mantine/core';
import { TeamStructure } from '@/components/HandballComponenets/StatsComponents/types';
import { getTeams } from '@/ServerActions/TeamActions';

interface TeamsProps {
  tournament?: string;
}

export default function Teams({ tournament }: TeamsProps) {
  // const [sort, setSort] = React.useState<number>(-1);

  const [chartData, setchartData] = React.useState<TeamStructure[]>([]);
  getTeams(tournament).then((o) => setchartData(o.teams));


  return (
    <div>
      <Table stickyHeader striped>
        <Table.Thead style={{ color: 'var(--mantine-color-green-8)' }}>
          <Table.Tr>
            <Table.Th visibleFrom="md" style={{ width: '10px' }}></Table.Th>
            <Table.Th style={{ width: '50px', textAlign: 'center' }}>
              <Text>Team One</Text>
            </Table.Th>
            <Table.Th style={{ width: '10px', textAlign: 'center' }}></Table.Th>
            <Table.Th style={{ width: '50px', textAlign: 'center' }}>
              <Text>Team One</Text>
            </Table.Th>
            {expanded && (
              <>
                <Table.Th style={{ width: '20px', textAlign: 'center' }}>
                  <Text>Official</Text>
                </Table.Th>
                {(data?.tournament.hasScorer ?? false) && (
                  <Table.Th style={{ width: '20px', textAlign: 'center' }}>
                    <Text>Scorer</Text>
                  </Table.Th>
                )}
                <Table.Th style={{ width: '20px', textAlign: 'center' }}>
                  <Text>Court</Text>
                </Table.Th>
              </>
            )}
            <Table.Th style={{ width: '20px', textAlign: 'center' }}>
              <Text>Score</Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {chartData.map((value, index) => {
            if (index > maxRounds && maxRounds > 0) return null;
            return (
              <>
                <Table.Tr key={100 * index - 1}>
                  <Table.Th hiddenFrom="md" colSpan={10} style={{ textAlign: 'center' }}>
                    <Text>
                      <b>Round {index + 1}</b>
                    </Text>
                  </Table.Th>
                  <Table.Th
                    visibleFrom="md"
                    style={{ textAlign: 'center' }}
                    rowSpan={value.length + 1}
                  >
                    <Text>
                      <b>Round {index + 1}</b>
                    </Text>
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
                    {expanded && (
                      <>
                        <Table.Td>
                          <Text>Official</Text>
                        </Table.Td>
                        {(data?.tournament.hasScorer ?? false) && (
                          <Table.Td>
                            <Text>Scorer</Text>
                          </Table.Td>
                        )}
                        <Table.Td>
                          <Text>Court</Text>
                        </Table.Td>
                      </>
                    )}
                    <Table.Td>
                      <Text>
                        {game.started ? `${game.teamOneScore} - ${game.teamTwoScore}` : '-'}
                      </Text>
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
