'use client';

import React, { useEffect } from 'react';
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';
import useSWR from 'swr';
import { Image, Table } from '@mantine/core';
import { fetcher, SERVER_ADDRESS } from '@/components/HandballComponenets/ServerActions';
import { toTitleCase } from '@/tools/tools';

interface LadderResults {
  pooled: boolean;
  ladder?: TeamStructure[];
  pool_one?: TeamStructure[];
  pool_two?: TeamStructure[];
}

const numberToSize = ['', 'xs', 'sm', 'md', 'lg', 'xl'];

interface LadderProps {
  maxRows?: number;
  tournament?: string;
}

export default function Ladder({ maxRows = -1, tournament }: LadderProps) {
  // const [sort, setSort] = React.useState<number>(-1);
  let url = `${SERVER_ADDRESS}/api/teams/ladder/?includeStats=true&formatData=true`;
  if (tournament) {
    url = `${url}&tournament=${tournament}`;
  }
  const { data, error, isLoading } = useSWR<LadderResults>(url, fetcher);
  const [chartData, setChartData] = React.useState<TeamStructure[]>([]);
  const [sortIndex, setSortIndex] = React.useState<number>(0);
  useEffect(() => {
    setChartData((data?.pooled ?? false) ? (data?.ladder ?? []) : (data?.ladder ?? []));
  }, [data]);
  if (error) return `An error has occurred: ${error.message}`;
  if (isLoading) return 'Loading...';

  const headers = [
    { title: 'name', rank: 0, width: 20 },
    { title: 'Games Won', rank: 0, width: 10 },
    { title: 'Percentage', rank: 1, width: 10 },
    { title: 'Games Played', rank: 2, width: 10 },
    { title: 'Games Lost', rank: 3, width: 10 },
    { title: 'Green Cards', rank: 5, width: 10 },
    { title: 'Yellow Cards', rank: 4, width: 10 },
    { title: 'Red Cards', rank: 4, width: 10 },
    { title: 'Faults', rank: 5, width: 10 },
    { title: 'Timeouts Called', rank: 5, width: 10 },
    { title: 'Points Scored', rank: 2, width: 10 },
    { title: 'Points Against', rank: 3, width: 10 },
    { title: 'Point Difference', rank: 2, width: 10 },
    { title: 'Elo', rank: 0, width: 10 },
  ];

  const getHeader = (d: TeamStructure, name: string): number | string =>
    d![name] || d!.stats![name];

  const sortData = (idx: number) => {
    if ((-idx === sortIndex && sortIndex !== -1) || (idx === sortIndex && idx === 1)) {
      setChartData(data?.ladder ?? []);
      setSortIndex(0);
      return;
    }
    let factor = idx === sortIndex ? -1 : 1;
    if (idx === 1 && idx !== Math.abs(sortIndex)) {
      factor *= -1;
    }
    const sort = data!.ladder!.toSorted((a, b) => {
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
      <Table striped stickyHeader>
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
                  <Image
                    style={{ width: '50px', height: '50px' }}
                    src={value.imageUrl}
                    alt={`The team logo for ${value.name}`}
                  ></Image>
                </Table.Td>
                {headers.map((value2, idx) => (
                  <Table.Td visibleFrom={numberToSize[value2.rank]} key={idx}>
                    {getHeader(value, value2.title)}
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
