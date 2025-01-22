'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Table, Text } from '@mantine/core';
import {
  GameStructure,
  TournamentStructure,
} from '@/components/HandballComponenets/StatsComponents/types';
import { getFixtures } from '@/ServerActions/GameActions';

interface FixturesProps {
  maxRounds?: number;
  tournament: string;
  expanded?: boolean;
  setExpanded?: (value: boolean) => void;
}

export default function FixturesInternal({
  maxRounds = -1,
  tournament,
  expanded,
  setExpanded,
}: FixturesProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  const [chartData, setChartData] = React.useState<{ games: GameStructure[]; final: boolean }[]>(
    []
  );
  const [tournamentState, setTournamentState] = React.useState<TournamentStructure>(undefined);
  useEffect(() => {
    getFixtures(
      tournament,
      undefined,
      undefined,
      undefined,
      undefined,
      false,
      false,
      true, //js is fucked up and has no keyword args
      true
    ).then((data) => {
      if (maxRounds > 0) {
        const t = data?.fixtures.toReversed() ?? [];
        t.length = Math.min(maxRounds, t.length);
        t.reverse();
        setChartData(t ?? []);
      } else {
        setChartData(data?.fixtures ?? []);
      }
      setTournamentState(data.tournament!);
    });
  }, [maxRounds, tournament]);

  return (
    <div>
      <Table stickyHeader>
        <Table.Thead style={{ color: 'var(--mantine-color-green-8)' }}>
          <Table.Tr>
            <Table.Th visibleFrom="md" style={{ width: '10px' }}></Table.Th>
            <Table.Th style={{ width: '50px', textAlign: 'center' }}>
              <Text size="sm">Team One</Text>
            </Table.Th>
            <Table.Th style={{ width: '2px', maxWidth: '2px', textAlign: 'center' }}></Table.Th>
            <Table.Th style={{ width: '50px', textAlign: 'center' }}>
              <Text size="sm">Team One</Text>
            </Table.Th>
            <Table.Th style={{ width: '20px', textAlign: 'center', alignItems: 'center' }}>
              <Text size="sm">Score</Text>
            </Table.Th>
            {!expanded && (
              <Table.Th
                visibleFrom="md"
                style={{ maxWidth: '2px', width: '2px', textAlign: 'center', alignItems: 'center' }}
              >
                <IconChevronRight onClick={() => setExpanded!(true)}></IconChevronRight>
              </Table.Th>
            )}
            {expanded && (
              <>
                <Table.Th style={{ width: '20px', textAlign: 'center' }}>
                  <Text size="sm">Official</Text>
                </Table.Th>
                {(tournamentState?.hasScorer ?? false) && (
                  <Table.Th style={{ width: '20px', textAlign: 'center' }}>
                    <Text size="sm">Scorer</Text>
                  </Table.Th>
                )}
                {(tournamentState?.twoCourts ?? false) && (
                  <Table.Th style={{ width: '20px', textAlign: 'center' }}>
                    <Text size="sm">Court</Text>
                  </Table.Th>
                )}
                <Table.Th
                  style={{ maxWidth: '2px', width: '2px', textAlign: 'center' }}
                  visibleFrom="md"
                >
                  <IconChevronLeft onClick={() => setExpanded!(false)}></IconChevronLeft>
                </Table.Th>
              </>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {chartData.map((value, index) => {
            if (index > maxRounds && maxRounds > 0) return null;
            return (
              <>
                <Table.Tr key={100 * index - 1}>
                  <Table.Th hiddenFrom="md" colSpan={10} style={{ textAlign: 'center' }}>
                    <Text size="sm">
                      <b>Round {index + 1}</b>
                    </Text>
                  </Table.Th>
                  <Table.Th
                    visibleFrom="md"
                    style={{ textAlign: 'center' }}
                    rowSpan={value.games.length + 1}
                  >
                    <Text size="sm">
                      <b>Round {index + 1}</b>
                    </Text>
                  </Table.Th>
                </Table.Tr>
                {value.games.map((game, index2) => (
                  <Table.Tr key={100 * index + index2} style={{ textAlign: 'center' }}>
                    <Table.Td>
                      <Link className="hideLink" href={`/games/${game.id}`}>
                        <Text size="sm">{game.teamOne.name}</Text>
                      </Link>
                    </Table.Td>
                    <Table.Td>
                      <Link className="hideLink" href={`/games/${game.id}`}>
                        <Text size="sm">VS</Text>
                      </Link>
                    </Table.Td>
                    <Table.Td>
                      <Link className="hideLink" href={`/games/${game.id}`}>
                        <Text size="sm">{game.teamTwo.name}</Text>
                      </Link>
                    </Table.Td>

                    <Table.Td>
                      <Link className="hideLink" href={`/games/${game.id}`}>
                        <Text size="sm">
                          {game.started ? `${game.teamOneScore} - ${game.teamTwoScore}` : '-'}
                        </Text>
                      </Link>
                    </Table.Td>

                    {expanded && (
                      <>
                        <Table.Td>
                          <Link className="hideLink" href={`/games/${game.id}`}>
                            <Text size="sm">{game.official?.name ?? '-'}</Text>
                          </Link>
                        </Table.Td>
                        {(tournamentState?.hasScorer ?? false) && (
                          <Table.Td>
                            <Link className="hideLink" href={`/games/${game.id}`}>
                              <Text size="sm">{game.scorer?.name ?? '-'}</Text>
                            </Link>
                          </Table.Td>
                        )}
                        {(tournamentState?.twoCourts ?? false) && (
                          <Table.Td>
                            <Link className="hideLink" href={`/games/${game.id}`}>
                              <Text size="sm">{game.court + 1 > 0 ? game.court + 1 : '-'}</Text>
                            </Link>
                          </Table.Td>
                        )}
                      </>
                    )}
                    <Table.Td
                      visibleFrom="md"
                      style={{ maxWidth: '15px', width: '15px' }}
                    ></Table.Td>
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
