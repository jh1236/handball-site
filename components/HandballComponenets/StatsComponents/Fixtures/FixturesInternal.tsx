'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Skeleton, Table, Text, Title } from '@mantine/core';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import { getFixtures } from '@/ServerActions/GameActions';
import { GameStructure, TournamentStructure } from '@/ServerActions/types';

interface FixturesProps {
  maxRounds?: number;
  tournament: string;
  expanded?: boolean;
  setExpanded?: (value: boolean) => void;
  expandable?: boolean;
}

export default function FixturesInternal({
  maxRounds = -1,
  tournament,
  expanded,
  setExpanded,
  expandable,
}: FixturesProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  const [finals, setFinals] = React.useState<{ games: GameStructure[]; final: boolean }[]>();
  const [fixtures, setFixtures] = React.useState<{ games: GameStructure[]; final: boolean }[]>();
  const [tournamentState, setTournamentState] = React.useState<TournamentStructure>();
  const { isUmpireManager } = useUserData();
  useEffect(() => {
    getFixtures({
      tournament,
      returnTournament: true,
      separateFinals: true,
      maxRounds: maxRounds > 0 ? maxRounds : undefined,
    }).then((data) => {
      if (maxRounds > 0) {
        if ((data?.finals?.length ?? 0) > maxRounds) {
          setFixtures([]);
          if (maxRounds === 1) {
            setFinals([{ games: data.finals!.map((a) => a.games).flat(), final: true }]);
          } else {
            const temp = data.finals!.toReversed();
            temp.length = maxRounds;
            setFinals(temp.toReversed());
          }
        } else {
          setFinals(data?.finals ?? []);
          const temp = (data.fixtures ?? []).toReversed();
          temp.length = Math.min(
            maxRounds - (data?.finals?.length ?? 0),
            data?.finals?.length ?? 0
          );
          setFixtures(temp.toReversed());
        }
      } else {
        setFixtures(data?.fixtures ?? []);
        setFinals(data?.finals ?? []);
      }
      setTournamentState(data.tournament!);
    });
  }, [maxRounds, tournament]);

  if (!fixtures) {
    return (
      <div>
        <Table stickyHeader>
          <Table.Thead style={{ color: 'var(--mantine-color-green-8)' }}>
            <Table.Tr>
              {maxRounds !== 1 && <Table.Th visibleFrom="md" style={{ width: '10px' }}></Table.Th>}
              <Table.Th style={{ width: '50px', textAlign: 'center' }}>
                <Text size="sm" visibleFrom="md">
                  Team One
                </Text>
                <Text size="sm" hiddenFrom="md">
                  Fixture
                </Text>
              </Table.Th>
              <Table.Th
                visibleFrom="md"
                style={{ width: '2px', maxWidth: '2px', textAlign: 'center' }}
              ></Table.Th>
              <Table.Th visibleFrom="md" style={{ width: '50px', textAlign: 'center' }}>
                <Text size="sm">Team Two</Text>
              </Table.Th>
              <Table.Th style={{ width: '20px', textAlign: 'center', alignItems: 'center' }}>
                <Text size="sm">Score</Text>
              </Table.Th>
              {expandable && (
                <Table.Th
                  visibleFrom="md"
                  style={{
                    maxWidth: '2px',
                    width: '2px',
                    textAlign: 'center',
                    alignItems: 'center',
                  }}
                >
                  <IconChevronRight onClick={() => setExpanded!(true)}></IconChevronRight>
                </Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Array.from({ length: maxRounds < 0 ? 6 : Math.max(maxRounds - 2, 0) }).map(
              (_, index) => (
                <>
                  {maxRounds !== 1 && (
                    <Table.Tr key={100 * index - 1}>
                      <Table.Th hiddenFrom="md" colSpan={10} style={{ textAlign: 'center' }}>
                        <Text size="sm">
                          <b>Round {index + 1}</b>
                        </Text>
                      </Table.Th>
                      <Table.Th visibleFrom="md" style={{ textAlign: 'center' }} rowSpan={5}>
                        <Text size="sm">
                          <b>Round {index + 1}</b>
                        </Text>
                      </Table.Th>
                    </Table.Tr>
                  )}
                  {Array.from({ length: 4 }).map((__, index2) => (
                    <Table.Tr key={100 * index + index2} style={{ textAlign: 'center' }}>
                      <Table.Td>
                        <Skeleton h={8} mt={6}></Skeleton>
                      </Table.Td>
                      <Table.Td visibleFrom="md">
                        <Text size="sm">VS</Text>
                      </Table.Td>
                      <Table.Td visibleFrom="md">
                        <Skeleton h={8} mt={6}></Skeleton>
                      </Table.Td>
                      <Table.Td>
                        <Skeleton h={8} mt={6}></Skeleton>
                      </Table.Td>
                      {expandable && (
                        <Table.Td
                          visibleFrom="md"
                          style={{ maxWidth: '15px', width: '15px' }}
                        ></Table.Td>
                      )}
                    </Table.Tr>
                  ))}
                </>
              )
            )}

            <Table.Tr>
              <Table.Th colSpan={99999} style={{ textAlign: 'center' }}>
                <Title>Finals</Title>
              </Table.Th>
            </Table.Tr>
            {Array.from({ length: maxRounds < 0 ? 2 : Math.min(maxRounds, 2) }).map((_, index) => {
              if (index > maxRounds && maxRounds > 0) return null;
              return (
                <>
                  {maxRounds !== 1 && (
                    <Table.Tr key={100 * index - 1}>
                      <Table.Th hiddenFrom="md" colSpan={10} style={{ textAlign: 'center' }}>
                        <Text size="sm">
                          <b>Round {index + 1}</b>
                        </Text>
                      </Table.Th>
                      <Table.Th
                        visibleFrom="md"
                        style={{ textAlign: 'center' }}
                        rowSpan={4 / (index + 1) + 1}
                      >
                        <Text size="sm">
                          <b>Round {index + 1}</b>
                        </Text>
                      </Table.Th>
                    </Table.Tr>
                  )}
                  {Array.from({ length: 4 / (index + 1) }).map((__, index2) => (
                    <Table.Tr key={100 * index + index2} style={{ textAlign: 'center' }}>
                      <Table.Td>
                        <Skeleton h={8} mt={6}></Skeleton>
                      </Table.Td>
                      <Table.Td visibleFrom="md">
                        <Text size="sm">VS</Text>
                      </Table.Td>
                      <Table.Td visibleFrom="md">
                        <Skeleton h={8} mt={6}></Skeleton>
                      </Table.Td>
                      <Table.Td>
                        <Skeleton h={8} mt={6}></Skeleton>
                      </Table.Td>
                      {expandable && (
                        <Table.Td
                          visibleFrom="md"
                          style={{ maxWidth: '15px', width: '15px' }}
                        ></Table.Td>
                      )}
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

  return (
    <div>
      <Table stickyHeader>
        <Table.Thead style={{ color: 'var(--mantine-color-green-8)' }}>
          <Table.Tr>
            {maxRounds !== 1 && <Table.Th visibleFrom="md" style={{ width: '10px' }}></Table.Th>}
            <Table.Th style={{ width: '50px', textAlign: 'center' }}>
              <Text size="sm" visibleFrom="md">
                Team One
              </Text>
              <Text size="sm" hiddenFrom="md">
                Fixture
              </Text>
            </Table.Th>
            <Table.Th
              visibleFrom="md"
              style={{ width: '2px', maxWidth: '2px', textAlign: 'center' }}
            ></Table.Th>
            <Table.Th visibleFrom="md" style={{ width: '50px', textAlign: 'center' }}>
              <Text size="sm">Team Two</Text>
            </Table.Th>
            <Table.Th style={{ width: '20px', textAlign: 'center', alignItems: 'center' }}>
              <Text size="sm">Score</Text>
            </Table.Th>
            {!expanded && expandable && (
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
                {isUmpireManager && (
                  <Table.Th style={{ width: '20px', textAlign: 'center' }}>
                    <Text size="sm">Status</Text>
                  </Table.Th>
                )}
                {expandable && (
                  <Table.Th
                    style={{ maxWidth: '2px', width: '2px', textAlign: 'center' }}
                    visibleFrom="md"
                  >
                    <IconChevronLeft onClick={() => setExpanded!(false)}></IconChevronLeft>
                  </Table.Th>
                )}
              </>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {fixtures.map((value, index) => (
            <>
              {maxRounds !== 1 && (
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
              )}
              {value.games.map((game, index2) => (
                <Table.Tr key={100 * index + index2} style={{ textAlign: 'center' }}>
                  <Table.Td>
                    <Link className="hideLink" href={!game.isBye ? `/games/${game.id}` : '#'}>
                      <Text size="sm">{game.teamOne.name}</Text>
                      <Text hiddenFrom="md"> vs {game.teamTwo.name}</Text>
                    </Link>
                  </Table.Td>
                  <Table.Td visibleFrom="md">
                    <Link className="hideLink" href={!game.isBye ? `/games/${game.id}` : '#'}>
                      <Text size="sm">VS</Text>
                    </Link>
                  </Table.Td>
                  <Table.Td visibleFrom="md">
                    <Link className="hideLink" href={!game.isBye ? `/games/${game.id}` : '#'}>
                      <Text size="sm">{game.teamTwo.name}</Text>
                    </Link>
                  </Table.Td>

                  <Table.Td>
                    <Link className="hideLink" href={!game.isBye ? `/games/${game.id}` : '#'}>
                      <Text size="sm">
                        {game.started ? `${game.teamOneScore} - ${game.teamTwoScore}` : '-'}
                      </Text>
                    </Link>
                  </Table.Td>

                  {expanded && (
                    <>
                      <Table.Td>
                        <Link className="hideLink" href={!game.isBye ? `/games/${game.id}` : '#'}>
                          <Text size="sm">{game.official?.name ?? '-'}</Text>
                        </Link>
                      </Table.Td>
                      {(tournamentState?.hasScorer ?? false) && (
                        <Table.Td>
                          <Link className="hideLink" href={!game.isBye ? `/games/${game.id}` : '#'}>
                            <Text size="sm">{game.scorer?.name ?? '-'}</Text>
                          </Link>
                        </Table.Td>
                      )}
                      {(tournamentState?.twoCourts ?? false) && (
                        <Table.Td>
                          <Link className="hideLink" href={!game.isBye ? `/games/${game.id}` : '#'}>
                            <Text size="sm">{game.court + 1 > 0 ? game.court + 1 : '-'}</Text>
                          </Link>
                        </Table.Td>
                      )}
                      {isUmpireManager && (
                        <Table.Th style={{ width: '20px', textAlign: 'center' }}>
                          <Link
                            className="hideLink"
                            href={!game.isBye ? `/games/${game.id}?tab=admin` : '#'}
                          >
                            <Text size="sm">{game.status}</Text>
                          </Link>
                        </Table.Th>
                      )}
                    </>
                  )}
                  {expandable && (
                    <Table.Td
                      visibleFrom="md"
                      style={{ maxWidth: '15px', width: '15px' }}
                    ></Table.Td>
                  )}
                </Table.Tr>
              ))}
            </>
          ))}
          {finals!.length !== 0 && (
            <>
              {fixtures.length !== 0 && (
                <Table.Tr>
                  <Table.Th colSpan={99999} style={{ textAlign: 'center' }}>
                    <Title>Finals</Title>
                  </Table.Th>
                </Table.Tr>
              )}
              {finals!.map((value, index) => {
                if (index > maxRounds && maxRounds > 0) return null;
                return (
                  <>
                    {maxRounds !== 1 && (
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
                    )}
                    {value.games.map((game, index2) => (
                      <Table.Tr key={100 * index + index2} style={{ textAlign: 'center' }}>
                        <Table.Td>
                          <Link className="hideLink" href={`/games/${game.id}`}>
                            <Text size="sm">{game.teamOne.name}</Text>
                            <Text hiddenFrom="md"> vs {game.teamTwo.name}</Text>
                          </Link>
                        </Table.Td>
                        <Table.Td visibleFrom="md">
                          <Link className="hideLink" href={`/games/${game.id}`}>
                            <Text size="sm">VS</Text>
                          </Link>
                        </Table.Td>
                        <Table.Td visibleFrom="md">
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
                        {expandable && (
                          <Table.Td
                            visibleFrom="md"
                            style={{ maxWidth: '15px', width: '15px' }}
                          ></Table.Td>
                        )}
                      </Table.Tr>
                    ))}
                  </>
                );
              })}
            </>
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
}
