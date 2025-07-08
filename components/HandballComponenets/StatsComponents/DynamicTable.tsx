import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';
import { Image, MultiSelect, Paper, Skeleton, Table } from '@mantine/core';
import { toTitleCase } from '@/tools/tools';

function stringToNumber(str: string | number) {
  if (typeof str === 'number') {
    return str;
  }
  if (str.endsWith('%')) {
    return Number(str.substring(0, str.length - 2));
  }
  if (str === '-') {
    return -1;
  }
  if (str === '\u221e') {
    return Infinity;
  }
  return str;
}

type InputType = {
  imageUrl: string;
  name: string;
  stats?: { [key: string]: any };
  [key: string]: any;
};

interface TableProps<T extends InputType> {
  maxRows?: number;
  columnsIn: string[];
  setColumnsIn?: (value: React.SetStateAction<string[]>) => void;
  editable?: boolean;
  data?: T[];
  objToLink: (t: T) => string;
  sortIndexIn?: number;
  setSortIndexIn?: (v: React.SetStateAction<number>) => void;
}

export function DynamicTable<T extends InputType>(props: TableProps<T>) {
  return (
    <Suspense fallback={null}>
      <InternalDynamicTable {...props} />
    </Suspense>
  );
}

export function InternalDynamicTable<T extends InputType>({
  editable,
  columnsIn,
  data,
  maxRows = -1,
  objToLink,
  sortIndexIn,
  setColumnsIn,
  setSortIndexIn,
}: TableProps<T>) {
  const [sortIndex, _setSortIndex] = useState<number>(sortIndexIn ?? 0);
  const getHeader = (d: T, name: string): number | string => d![name] || d!.stats![name];
  const [columns, _setColumns] = useState<string[]>(columnsIn);
  const setColumns = (a: React.SetStateAction<string[]>) => {
    _setColumns(a);
    if (setColumnsIn) setColumnsIn(a);
  };
  const setSortIndex = (a: number) => {
    _setSortIndex(a);
    if (setSortIndexIn) setSortIndexIn(a);
  };

  useEffect(() => {
    _setColumns(columnsIn);
  }, [columnsIn]);

  useEffect(() => {
    if (sortIndexIn !== undefined) {
      _setSortIndex(sortIndexIn);
    }
  }, [sortIndexIn]);

  const sortedData = useMemo(() => {
    if (sortIndex === 0) return data;
    const idx = Math.abs(sortIndex);
    const factor = Math.sign(sortIndex);
    return data?.toSorted((a, b) => {
      const valueA = stringToNumber(getHeader(a, ['searchableName'].concat(columns)[idx - 1]));
      const valueB = stringToNumber(getHeader(b, ['searchableName'].concat(columns)[idx - 1]));
      switch (typeof valueA) {
        case 'number':
          return factor * ((valueB as number) - valueA);
        case 'string': {
          return -factor * (valueB as string).localeCompare(valueA);
        }
        default:
          return 0;
      }
    });
    // This is actually a proper time to disable this error, if we add
    // getHeader to the deps, the useMemo will re-calc on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortIndex, data, columns]);

  const SortDirection = useMemo(() => (sortIndex > 0 ? IconCaretDown : IconCaretUp), [sortIndex]);

  function cycleSortIndex(newIndex: number) {
    if (newIndex !== Math.abs(sortIndex) && newIndex !== 0) {
      setSortIndex(newIndex);
      return;
    }
    //we know that we are clicking the same column again
    if (sortIndex > 0) {
      setSortIndex(-sortIndex);
    } else {
      setSortIndex(0);
    }
  }

  return (
    <div>
      {editable && (
        <>
          <MultiSelect
            label="Select Columns"
            placeholder="Pick value"
            data={Object.keys(sortedData?.[0]?.stats! ?? {})}
            value={columns}
            onChange={setColumns}
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
            data={Object.keys(sortedData?.[0]?.stats! ?? {})}
            value={columns}
            onChange={setColumns}
            clearable
            searchable
            nothingFoundMessage="No Such Statistic!"
            checkIconPosition="right"
            style={{ width: '100%', float: 'right' }}
            hiddenFrom="md"
          />
        </>
      )}
      {sortedData && sortedData.length > 0 ? (
        <Table striped stickyHeader>
          <Table.Thead style={{ color: 'var(--mantine-color-green-8)' }}>
            <Table.Tr>
              <Table.Th style={{ width: '20px' }}></Table.Th>
              {['name'].concat(columns).map((value, index) => (
                <Table.Th
                  key={index}
                  style={{ width: '200px', textAlign: 'center' }}
                  onClick={() => cycleSortIndex(index + 1)}
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
            {sortedData.map((value, index) => {
              if (index > maxRows && maxRows > 0) return null;
              return (
                <Table.Tr key={index} style={{ textAlign: 'center' }}>
                  <Table.Td>
                    <Link className="hideLink" href={objToLink(value)}>
                      <Image
                        style={{ width: '50px', height: '50px' }}
                        src={value.imageUrl}
                        alt={`The team logo for ${value.name}`}
                      ></Image>
                    </Link>
                  </Table.Td>
                  {['name'].concat(columns).map((value2, idx) => (
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
      ) : data === undefined ? (
        <>
          <Table striped stickyHeader>
            <Table.Thead style={{ color: 'var(--mantine-color-green-8)' }}>
              <Table.Tr>
                <Table.Th style={{ width: '20px' }}></Table.Th>
                {['name'].concat(columns).map((value, index) => (
                  <Table.Th
                    key={index}
                    style={{ width: '200px', textAlign: 'center' }}
                    onClick={() => cycleSortIndex(index + 1)}
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
              {Array.from({ length: maxRows > 0 ? maxRows : 20 }, (v, k) => k + 1).map((_, i) => (
                <Table.Tr key={i}>
                  <Table.Th style={{ width: '20px' }}>
                    <Skeleton circle height={50}></Skeleton>
                  </Table.Th>
                  <Table.Td colSpan={999}>
                    <Skeleton height={8} mt={6} radius="xl"></Skeleton>
                    <Skeleton height={8} mt={6} radius="xl" w="70%"></Skeleton>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      ) : (
        <Paper shadow="lg" radius="md" p="xl" ta="center" ml={30} mr={30} mih={300}>
          {' '}
          There is no data to show
        </Paper>
      )}
    </div>
  );
}
