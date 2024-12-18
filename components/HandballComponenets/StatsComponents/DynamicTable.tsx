import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';
import { Image, MultiSelect, Table } from '@mantine/core';
import { toTitleCase } from '@/tools/tools';

function selectedToNumber(all: string[], selected: string[]): number {
  let out = 0;
  for (let i = 0; i < all.length; i += 1) {
    if (selected.includes(all[i])) {
      out += 2 ** i;
    }
  }
  return out;
}

function numberToSelected(all: string[], selected: number): string[] {
  const out = [];
  let tempSelected = selected;
  for (let i = all.length; i > 0; i -= 1) {
    if (tempSelected >= 2 ** i) {
      tempSelected -= 2 ** i;
      out.push(all[i]);
    }
  }
  return out;
}

type InputType = {
  imageUrl: string;
  name: string;
  stats: { [key: string]: any };
  [key: string]: any;
};

interface TableProps<T extends InputType> {
  maxRows?: number;
  columns: string[];
  editable?: boolean;
  data?: T[];
  objToLink: (t: T) => string;
}

export function DynamicTable<T extends InputType>({
  editable,
  columns,
  data,
  maxRows = -1,
  objToLink,
}: TableProps<T>) {
  const [chartData, setChartData] = React.useState<T[]>([]);
  const [sortIndex, setSortIndex] = React.useState<number>(0);
  const [selectedHeaders, setSelectedHeaders] = React.useState<string[]>(columns);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setChartData(data ?? []);
  }, [data]);
  useEffect(() => {
    const count = Number(searchParams.get('cols') ?? -1);
    if (
      count > 0 &&
      editable &&
      chartData.length > 0 &&
      count !== selectedToNumber(Object.keys(chartData[0]?.stats! ?? {}), selectedHeaders)
    ) {
      setSelectedHeaders(numberToSelected(Object.keys(chartData[0]?.stats! ?? {}), count));
    }
  }, [searchParams, chartData]);
  useEffect(() => {
    if (selectedHeaders.length === 0) {
      setSelectedHeaders(columns);
    }
    if (editable && JSON.stringify(selectedHeaders) !== JSON.stringify(columns)) {
      router.replace(
        `${window.location.href.split('?')[0]}?cols=${selectedToNumber(Object.keys(chartData[0]?.stats! ?? {}), selectedHeaders)}`
      );
    }
  }, [selectedHeaders]);

  const getHeader = (d: T, name: string): number | string => d![name] || d!.stats![name];

  const sortData = (idx: number) => {
    if ((-idx === sortIndex && sortIndex !== -1) || (idx === sortIndex && idx === 1)) {
      setChartData(data ?? []);
      setSortIndex(0);
      return;
    }
    let factor = idx === sortIndex ? -1 : 1;
    if (idx === 1 && idx !== Math.abs(sortIndex)) {
      factor *= -1;
    }
    const sort = data!.toSorted((a, b) => {
      const valueA = getHeader(a, ['name'].concat(selectedHeaders)[idx - 1]);
      const valueB = getHeader(b, ['name'].concat(selectedHeaders)[idx - 1]);
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
      {editable && (
        <>
          <MultiSelect
            label="Select Columns"
            placeholder="Pick value"
            data={Object.keys(chartData[0]?.stats! ?? {})}
            value={selectedHeaders}
            onChange={setSelectedHeaders}
            clearable
            searchable
            nothingFoundMessage="No Such Statistic!"
            checkIconPosition="right"
            style={{ width: '30%', float: 'right' }}
            visibleFrom="md"
          />
          <MultiSelect
            label="Select Columns"
            placeholder="Pick value"
            data={Object.keys(chartData[0]?.stats! ?? {})}
            value={selectedHeaders}
            onChange={setSelectedHeaders}
            clearable
            searchable
            nothingFoundMessage="No Such Statistic!"
            checkIconPosition="right"
            style={{ width: '100%', float: 'right' }}
            hiddenFrom="md"
          />
        </>
      )}
      <Table striped stickyHeader>
        <Table.Thead style={{ color: 'var(--mantine-color-green-8)' }}>
          <Table.Tr>
            <Table.Th style={{ width: '20px' }}></Table.Th>
            {['name'].concat(selectedHeaders).map((value, index) => (
              <Table.Th
                key={index}
                style={{ width: '200px', textAlign: 'center' }}
                onClick={() => sortData(index + 1)}
              >
                {index + 1 === Math.abs(sortIndex) ? (
                  <>
                    <i>{toTitleCase(value)}</i> <br></br>
                    <SortDirection></SortDirection>
                  </>
                ) : (
                  toTitleCase(value)
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
                  <Link className="hideLink" href={objToLink(value)}>
                    <Image
                      style={{ width: '50px', height: '50px' }}
                      src={value.imageUrl}
                      alt={`The team logo for ${value.name}`}
                    >
                    </Image>
                  </Link>
                </Table.Td>
                {['name'].concat(selectedHeaders).map((value2, idx) => (
                  <Table.Td key={idx}>
                    <Link className="hideLink" href={objToLink(value)}>
                      {getHeader(value, value2)}
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
