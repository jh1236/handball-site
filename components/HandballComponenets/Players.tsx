'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';
import useSWR from 'swr';
import { Image, Table } from '@mantine/core';
import { fetcher, SERVER_ADDRESS } from '@/components/HandballComponenets/ServerActions';
import { toTitleCase } from '@/tools/tools';

interface PlayersResults {
  pooled: boolean;
  players: PersonStructure[];
}

const numberToSize = ['', 'xs', 'sm', 'md', 'lg', 'xl'];

interface LadderProps {
  maxRows?: number;
  tournament?: string;
}

function linkTo(player: PersonStructure, tournament?: string): string {
  if (tournament) {
    return `/${tournament}/players/${player.searchableName}`;
  }
  return `/players/${player.searchableName}`;
}

export default function Players({ maxRows = -1, tournament }: LadderProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  let url = `${SERVER_ADDRESS}/api/players?includeStats=true&formatData=true`;
  if (tournament) {
    url = `${url}&tournament=${tournament}`;
  }
  const { data, error, isLoading } = useSWR<PlayersResults>(url, fetcher);
  const [chartData, setChartData] = React.useState<PersonStructure[]>([]);
  const [sortIndex, setSortIndex] = React.useState<number>(0);
  useEffect(() => {
    setChartData(data?.players ?? []);
  }, [data]);
  if (error) return `An error has occurred: ${error.message}`;
  if (isLoading) return 'Loading...';

  const headers = [
    { title: 'name', rank: 0, width: 20 },
    { title: 'B&F Votes', rank: 0, width: 10 },
    { title: 'Elo', rank: 1, width: 10 },
    { title: 'Games Won', rank: 1, width: 10 },
    { title: 'Games Played', rank: 3, width: 10 },
    { title: 'Points Scored', rank: 1, width: 10 },
    { title: 'Aces Scored', rank: 2, width: 10 },
    { title: 'Faults', rank: 4, width: 10 },
    { title: 'Double Faults', rank: 5, width: 10 },
    { title: 'Green Cards', rank: 4, width: 10 },
    { title: 'Yellow Cards', rank: 4, width: 10 },
    { title: 'Red Cards', rank: 5, width: 10 },
    { title: 'Rounds on Court', rank: 2, width: 10 },
    { title: 'Rounds Carded', rank: 3, width: 10 },
    { title: 'Points Served', rank: 3, width: 10 },
  ];

  const getHeader = (d: PersonStructure, name: string): number | string =>
    d![name] || d!.stats![name];

  const sortData = (idx: number) => {
    if ((-idx === sortIndex && sortIndex !== -1) || (idx === sortIndex && idx === 1)) {
      setChartData(data?.players ?? []);
      setSortIndex(0);
      return;
    }
    let factor = idx === sortIndex ? -1 : 1;
    if (idx === 1 && idx !== Math.abs(sortIndex)) {
      factor *= -1;
    }
    const sort = data!.players!.toSorted((a, b) => {
      const valueA = getHeader(a, headers[idx - 1].title);
      const valueB = getHeader(b, headers[idx - 1].title);
      switch (typeof valueA) {
        case 'number':
          return factor * ((valueB as number) - valueA);
        case 'string':
          if (valueA.endsWith('%')) {
            return (
              factor *
              (Number((valueB as string).replace('%', '')) - Number(valueA.replace('%', '')))
            );
          }
          return factor * (valueB as string).localeCompare(valueA);
        default:
          return 0;
      }
    });
    setSortIndex(factor * idx);
    setChartData(sort);
  };
  const SortDirection = sortIndex > 0 ? IconCaretDown : IconCaretUp;
  return (
    <div>
      <Table highlightOnHover striped stickyHeader>
        <Table.Thead style={{ color: 'var(--mantine-color-green-8)' }}>
          <Table.Tr>
            <Table.Th style={{ width: '20px' }}></Table.Th>
            {headers.map((value, index) => (
              <Table.Th
                visibleFrom={numberToSize[value.rank]}
                key={index}
                style={{ width: value.width, textAlign: 'center' }}
                onClick={() => sortData(index + 1)}
              >
                {index + 1 === Math.abs(sortIndex) ? (
                  <>
                    <i>{toTitleCase(value.title)}</i> <br></br>
                    <SortDirection></SortDirection>
                  </>
                ) : (
                  toTitleCase(value.title)
                )}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {chartData.map((value, index) => {
            if (index > maxRows && maxRows > 0) return null;
            return (
              <Table.Tr key={index} style={{ textAlign: 'center' }}>
                <Table.Td>
                  <Link className="hideLink" href={linkTo(value, tournament)}>
                    <Image
                      style={{ width: '50px', height: '50px' }}
                      src={value.imageUrl}
                      alt={`The team logo for ${value.name}`}
                    ></Image>
                  </Link>
                </Table.Td>
                {headers.map((value2, idx) => (
                  <Table.Td visibleFrom={numberToSize[value2.rank]} key={idx}>
                    <Link className="hideLink" href={linkTo(value, tournament)}>
                      {getHeader(value, value2.title)}
                    </Link>
                  </Table.Td>
                ))}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
}
