import React, { useMemo, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Box, Center, Flex, FloatingIndicator, UnstyledButton } from '@mantine/core';
import classes from './SelectCourtLocation.module.css';
import useScreenOrientation from 'react-hook-screen-orientation';

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
  const screenOrientation = useScreenOrientation();

  const setControlRef = (name: string) => (node: HTMLButtonElement) => {
    controlsRefs[name] = node;
    setControlsRefs(controlsRefs);
  };
  const W = 50;
  const H = 50;
  const lineThickness = 3;
  const edgeFactor = 2;

  const columns = useMemo(() => {
    const a = [
      { key: 'wide-left', width: W / edgeFactor },
      { key: 'left', width: W },
      { key: 'center-left', width: W },
      { key: 'center-right', width: W },
      { key: 'right', width: W },
      { key: 'wide-right', width: W / edgeFactor },
    ];
    if (reverse) return a.toReversed();
    return a;
  }, [W, reverse]);

  // produce the `stringLocation` used to match active button
  const stringLocation = useMemo(() => location.join('-'), [location]);

  // active DOM node for the FloatingIndicator
  const active = useMemo(
    () => controlsRefs[stringLocation] ?? null,
    [controlsRefs, stringLocation]
  );

  // convenience: should this cell be disabled (mirrors original logic)
  const isDisabled = (row: string, col: string) => {
    // deep row had special logic for left/right wide depending on ace & leftSide
    if (row === 'deep') {
      if (
        col.startsWith('wide-') ||
        col === 'left' ||
        col === 'right' ||
        col.startsWith('center-')
      ) {
        // original: deep-wide-left / deep-left / deep-center-left disabled when isAce && leftSide
        // and deep-center-right/deep-right/deep-wide-right disabled when isAce && !leftSide
        const leftCols = ['wide-left', 'left', 'center-left'];
        const rightCols = ['center-right', 'right', 'wide-right'];
        if (leftCols.includes(col)) return isAce && leftSide;
        if (rightCols.includes(col)) return isAce && !leftSide;
      }
    }

    // other rows were all disabled when isAce in original
    return isAce;
  };

  // separator color function — this reproduces the different colors used in each row
  const separatorColor = (rowIndex: number, afterColIndex: number) => {
    // original had pink separators at many spots and a green separator in the middle of each row
    // We'll make the "middle" separator (between the 3rd and 4th logical columns) green,
    // and the others pink. The top-most short row (deep) used no pink in some places but this
    // mirrors the general pattern.
    if (afterColIndex === 2) return 'green';
    if ([0, 4].includes(afterColIndex)) return 'pink';
    return undefined;
  };

  // when rendering we want to insert a thin Box between columns
  const renderRow = (row: string, rowIndex: number) => (
    <Flex key={row}>
      {columns.map((col, colIndex) => {
        const id = `${row}-${col.key}`;
        const disabled = isDisabled(row, col.key);
        const className = disabled ? classes.evilcontrol : classes.control;
        const activeProp = { mod: { active: stringLocation === id } } as any; // keep same `mod` prop used previously

        const c = separatorColor(rowIndex, colIndex);
        return (
          <React.Fragment key={id}>
            <UnstyledButton
              disabled={!!disabled}
              className={className}
              h={row === 'deep' ? H / edgeFactor : H}
              w={col.width}
              onClick={() => setLocation([row, col.key])}
              ref={setControlRef(id)}
              {...activeProp}
            >
              {isAce &&
                // original logic: show IconX on certain buttons depending on row/leftSide
                // simplify: show IconX when the button is disabled because of ace
                (disabled ? <IconX /> : null)}
            </UnstyledButton>

            {/* separator after the column unless it's the last column */}
            {colIndex < columns.length - 1 && [0, 2, 4].includes(colIndex) && (
              <Box
                key={`${id}-sep`}
                w={lineThickness}
                bg={colIndex === 2 || rowIndex !== 0 ? c : undefined}
                h={row === 'deep' ? H / edgeFactor : H}
              />
            )}
          </React.Fragment>
        );
      })}
    </Flex>
  );
  if (reverse) {
    return (
      <div className={classes.root} dir="ltr" ref={setRootRef}>
        <FloatingIndicator
          target={active}
          style={{ opacity: 0.5, backgroundColor: '#6666ff' }}
          parent={rootRef}
          className={classes.indicator}
        />

        <Center>
          <i>Center Line</i>
        </Center>

        <Box
          pos="relative"
          left={W / edgeFactor}
          w={4 * W + 3 * lineThickness}
          bg="white"
          h={lineThickness}
        />
        {renderRow('front', 3)}

        <Box
          pos="relative"
          left={W / edgeFactor}
          w={4 * W + 3 * lineThickness}
          bg="red"
          h={lineThickness}
        />
        {renderRow('mid', 2)}

        {renderRow('back', 1)}

        <Box
          pos="relative"
          left={W / edgeFactor}
          w={4 * W + 3 * lineThickness}
          bg="purple"
          h={lineThickness}
        />

        {renderRow('deep', 0)}
        <Center>
          <i>Back Court</i>
        </Center>
      </div>
    );
  }
  return (
    <div className={classes.root} dir="ltr" ref={setRootRef}>
      <Center>
        <i>Back Court</i>
      </Center>

      <FloatingIndicator
        target={active}
        style={{ opacity: 0.5, backgroundColor: '#6666ff' }}
        parent={rootRef}
        className={classes.indicator}
      />

      {renderRow('deep', 0)}

      <Box
        pos="relative"
        left={W / edgeFactor}
        w={4 * W + 3 * lineThickness}
        bg="purple"
        h={lineThickness}
      />

      {renderRow('back', 1)}
      {renderRow('mid', 2)}

      <Box
        pos="relative"
        left={W / edgeFactor}
        w={4 * W + 3 * lineThickness}
        bg="red"
        h={lineThickness}
      />

      {renderRow('front', 3)}

      <Box
        pos="relative"
        left={W / edgeFactor}
        w={4 * W + 3 * lineThickness}
        bg="white"
        h={lineThickness}
      />

      <Center>
        <i>Center Line</i>
      </Center>
    </div>
  );
}
