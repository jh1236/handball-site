import { useViewportSize } from '@mantine/hooks';
import { GameState } from '@/components/HandballComponenets/GameState';

export function useScreenVertical() {
  const { height, width } = useViewportSize();
  return !(height < width);
}
