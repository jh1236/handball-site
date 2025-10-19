import { useMemo } from 'react';
import { Box, Group } from '@mantine/core';
import { useMove } from '@mantine/hooks';

interface VerticalSliderProps {
  value: number;
  setValue: (value: number) => void;
  maxValue?: number;
  minValue?: number;
}

export function VerticalSlider({
  value: trueValue,
  setValue,
  maxValue = 0,
  minValue = 0,
}: VerticalSliderProps) {
  const { ref } = useMove(({ y }) =>
    setValue(Math.round((1 - y) * (maxValue - minValue)) + minValue)
  );

  const value = useMemo(
    () => (trueValue - minValue) / (maxValue - minValue),
    [maxValue, minValue, trueValue]
  );

  return (
    <Box>
      <Group justify="center">
        <div
          ref={ref}
          style={{
            width: 16,
            height: 120,
            backgroundColor: 'var(--mantine-color-blue-light)',
            position: 'relative',
          }}
        >
          {/* Filled bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              height: `${value * 100}%`,
              width: 16,
              backgroundColor: 'var(--mantine-color-blue-filled)',
              opacity: 0.7,
            }}
          />

          {/* Thumb */}
          <div
            style={{
              position: 'absolute',
              bottom: `calc(${value * 100}% - 8px)`,
              left: 0,
              width: 16,
              height: 16,
              backgroundColor: 'var(--mantine-color-blue-7)',
            }}
          />
        </div>
      </Group>
    </Box>
  );
}
