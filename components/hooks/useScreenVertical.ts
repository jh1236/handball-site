import { useViewportSize } from '@mantine/hooks';

export function useScreenVertical() {
  const { height, width } = useViewportSize();
  return !(height < width);
}
