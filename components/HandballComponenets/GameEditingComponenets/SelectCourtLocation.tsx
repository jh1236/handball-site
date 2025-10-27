import React, { useMemo, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Box, Center, Flex, FloatingIndicator, UnstyledButton } from '@mantine/core';
import { useScreenVertical } from '@/components/hooks/useScreenVertical';
import classes from './SelectCourtLocation.module.css';

interface SelectCourtLocationParams {
  location: string[];
  setLocation: React.Dispatch<React.SetStateAction<string[]>>;
  isAce?: boolean;
  leftSide: boolean;
  reverse?: boolean;
}

/**
 * Programmatic version of the original hard-coded layout.
 *
 * - Rows and columns are defined in simple arrays and mapped to UI.
 * - Uses a stable setControlRef that copies state instead of mutating.
 * - Separator boxes (lineThickness) are inserted automatically and can
 *   have different colors depending on row/col.
 */
export default function SelectCourtLocation({
  location,
  setLocation,
  isAce = false,
  leftSide,
  reverse = false,
}: SelectCourtLocationParams) {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

  const isVertical = useScreenVertical();

  const setControlRef = (name: string) => (node: HTMLButtonElement) => {
    controlsRefs[name] = node;
    setControlsRefs(controlsRefs);
  };
  const W = 50;
  const H = 50;
  const lineThickness = 3;
  const edgeFactor = 2;

  const columns = [
    { key: 'wide-left', width: W / edgeFactor },
    { key: 'left', width: W },
    { key: 'center-left', width: W },
    { key: 'center-right', width: W },
    { key: 'right', width: W },
    { key: 'wide-right', width: W / edgeFactor },
  ];

  const stringLocation = useMemo(() => location.join('-'), [location]);

  const active = useMemo(
    () => controlsRefs[stringLocation] ?? null,
    [controlsRefs, stringLocation]
  );

  const isDisabled = (row: string, col: string) => {
    if (row !== 'deep') return isAce;

    const leftCols = ['wide-left', 'left', 'center-left'];
    const rightCols = ['center-right', 'right', 'wide-right'];
    if (leftCols.includes(col)) return isAce && leftSide;
    if (rightCols.includes(col)) return isAce && !leftSide;

    return isAce;
  };

  const separatorColor = (rowIndex: number, afterColIndex: number) => {
    if (afterColIndex === 2) return 'green';
    if ([0, 4].includes(afterColIndex)) return 'pink';
    return undefined;
  };

  const renderRow = (row: string, rowIndex: number) => (
    <Flex
      key={row}
      direction={`${isVertical ? 'row' : 'column'}${isVertical === reverse ? '-reverse' : ''}`}
    >
      {columns.map((col, colIndex) => {
        const id = `${row}-${col.key}`;
        const disabled = isDisabled(row, col.key);
        const className = disabled ? classes.evilcontrol : classes.control;
        const activeProp = { mod: { active: stringLocation === id } } as any;
        let lw = lineThickness;
        let lh = row === 'deep' ? H / edgeFactor : H;
        let h = row === 'deep' ? H / edgeFactor : H;
        let w = col.width;
        if (!isVertical) {
          [lw, lh] = [lh, lw]; //oneliner to swap variables
          [h, w] = [w, h];
        }
        const c = separatorColor(rowIndex, colIndex);
        return (
          <React.Fragment key={id}>
            <UnstyledButton
              disabled={!!disabled}
              className={className}
              h={h}
              w={w}
              onClick={() => setLocation([row, col.key])}
              ref={setControlRef(id)}
              {...activeProp}
            >
              {isAce && (disabled ? <IconX /> : null)}
              {/*{row[0]}:{col.key[0]}*/}
              {/*{col.key.split('-')[1]?.[0]}*/}
            </UnstyledButton>

            {colIndex < columns.length - 1 && [0, 2, 4].includes(colIndex) && (
              <Box
                key={`${id}-sep`}
                w={lw}
                bg={colIndex === 2 || rowIndex !== 0 ? c : undefined}
                h={lh}
              />
            )}
          </React.Fragment>
        );
      })}
    </Flex>
  );
  let left = W / edgeFactor;
  let top = 0;
  let lh = lineThickness;
  let lw = 4 * W + 3 * lh;
  if (!isVertical) {
    [lw, lh] = [lh, lw];
    [left, top] = [top, left];
  }
  return (
    <Flex className={classes.root} dir="ltr" ref={setRootRef}>
      <FloatingIndicator
        target={active}
        style={{ opacity: 0.5, backgroundColor: '#6666ff' }}
        parent={rootRef}
        className={classes.indicator}
      />
      <Flex direction={`${isVertical ? 'column' : 'row'}${reverse ? '-reverse' : ''}`}>
        <Center m={15}>
          <i>Back Court</i>
        </Center>

        <FloatingIndicator
          target={active}
          style={{ opacity: 0.5, backgroundColor: '#6666ff' }}
          parent={rootRef}
          className={classes.indicator}
        />

        {renderRow('deep', 0)}

        <Box pos="relative" left={left} top={top} w={lw} bg="purple" h={lh} />

        {renderRow('back', 1)}
        {renderRow('mid', 2)}

        <Box pos="relative" left={left} top={top} w={lw} bg="red" h={lh} />

        {renderRow('front', 3)}

        <Box pos="relative" left={left} top={top} w={lw} bg="white" h={lh} />

        <Center m={15}>
          <i>Center Line</i>
        </Center>
      </Flex>
    </Flex>
  );
}
