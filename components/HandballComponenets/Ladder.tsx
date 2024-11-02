'use client';

import React from 'react';
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
  const { data, error, isLoading } = useSWR<LadderResults>(
    `${SERVER_ADDRESS}/api/teams/ladder?includeStats=true&formatData=true/`,
    fetcher
  );
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

  // let sum = Number.MAX_SAFE_INTEGER;
  // let rank = 5;
  //
  // while (sum > width) {
  //   sum = 0;
  //   for (let i = 0; i < headers.length; i += 1) {
  //     const item = headers[i];
  //     if (item.rank > rank) {
  //       headers.splice(i, 1);
  //     } else {
  //       sum += item.width;
  //     }
  //   }
  //   rank -= 1;
  // }

  return (
    <div>
      <Table>
        <thead style={{ color: 'var(--mantine-color-green-8)' }}>
          <tr>
            <th width="30px"></th>
            {headers.map((value, index) => (
              <th key={index} width={value.width}>
                {toTitleCase(value.title)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data!.ladder!.map((value, index) => (
            <tr key={index} style={{ textAlign: 'center' }}>
              <td>
                <Image
                  style={{ width: '50px', height: '50px' }}
                  src={value.imageUrl}
                  alt={`The team logo for ${value.name}`}
                ></Image>
              </td>
              {headers.map((value2, index) => (
                <td key={index}>{value![value2.title] || value!.stats![value2.title]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
