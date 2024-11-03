'use client';

import React, { useEffect } from 'react';
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';
import useSWR from 'swr';
import { Image, Table } from '@mantine/core';
import { SERVER_ADDRESS } from '@/components/HandballComponenets/ServerActions';
import { toTitleCase } from '@/tools/tools';

interface LadderResults {
  pooled: boolean;
  ladder?: TeamStructure[];
  pool_one?: TeamStructure[];
  pool_two?: TeamStructure[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Ladder() {
  // const [sort, setSort] = React.useState<number>(-1);
  const { data, error, isLoading } = useSWR<LadderResults>(
    `${SERVER_ADDRESS}/api/teams/ladder?includeStats=true&formatData=true/`,
    fetcher
  );
  const [chartData, setChartData] = React.useState<TeamStructure[]>([]);
  const [sortIndex, setSortIndex] = React.useState<number>(0);
  useEffect(() => {
    setChartData((data?.pooled ?? false) ? (data?.ladder ?? []) : (data?.ladder ?? []));
  }, [data]);
  if (error) return `An error has occurred: ${error.message}`;
  if (isLoading) return 'Loading...';

  const headers = [
    { title: 'name', rank: 1, width: 20 },
    { title: 'Percentage', rank: 2, width: 10 },
    { title: 'Games Won', rank: 1, width: 10 },
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
    { title: 'Elo', rank: 1, width: 10 },
  ];

  const getHeader = (d: TeamStructure, name: string): number | string =>
    (d![name] as string) || d!.stats![name];

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
    const sort = chartData.toSorted((a, b) => {
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
      <Table>
        <thead style={{ color: 'var(--mantine-color-green-8)' }}>
          <tr>
            <th style={{ width: '30px' }}></th>
            {headers.map((value, index) => (
              <th key={index} style={{ width: value.width }} onClick={() => sortData(index + 1)}>
                {index + 1 === Math.abs(sortIndex) ? (
                  <>
                    <i>{toTitleCase(value.title)}</i> <br></br>
                    <SortDirection></SortDirection>
                  </>
                ) : (
                  toTitleCase(value.title)
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chartData.map((value, index) => (
            <tr key={index} style={{ textAlign: 'center' }}>
              <td>
                <Image
                  style={{ width: '50px', height: '50px' }}
                  src={value.imageUrl}
                  alt={`The team logo for ${value.name}`}
                ></Image>
              </td>
              {headers.map((value2, idx) => (
                <td key={idx}>{getHeader(value, value2.title)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
