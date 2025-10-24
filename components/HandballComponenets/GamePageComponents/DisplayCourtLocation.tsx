import { Box, Center, Flex, MantineStyleProp } from '@mantine/core';
import { GameStructure } from '@/ServerActions/types';
import classes from './DisplayCourtLocation.module.css';

interface SelectCourtLocationParams {
  game: GameStructure;
}

function HeatmapBox({
  scores,
  location,
  w,
  h,
  style,
}: {
  scores: { [_: number]: number };
  location: number;
  w: number;
  h: number;
  style?: MantineStyleProp;
}) {
  const maxScore = Math.max(...Object.values(scores));
  const myScores = scores[location];
  const COLORS = [
    '#ff0000',
    '#f00d20',
    '#df1d30',
    '#cd293c',
    '#b93345',
    '#a43b4b',
    '#8e404e',
    '#77444f',
    '#60464c',
    '#474747',
  ];
  return (
    <Center
      style={style}
      h={h}
      w={w}
      bg={COLORS[10 - Math.round((10 * myScores) / maxScore)]}
      c="white"
    >
      <i>{myScores}</i>
    </Center>
  );
}

export function DisplayCourtLocation({ game }: SelectCourtLocationParams) {
  const W = 100;
  const H = 100;
  const lineThickness = 3;
  const edgeFactor = 2;
  const counts = game.events
    ?.filter((gE) => gE.eventType === 'Score')
    .reduce(
      (acc, item) => {
        acc[item.details ?? 0] = (acc[item.details ?? 0] || 0) + 1;
        return acc;
      },
      {} as { [key: number]: number }
    )!;

  return (
    <>
      <div className={classes.root} dir="ltr">
        <Center>
          <i>Back Court</i>
        </Center>

        <Flex>
          <HeatmapBox
            scores={counts}
            h={H / edgeFactor}
            w={W / edgeFactor}
            location={11}
          ></HeatmapBox>
          <Box w={lineThickness} h={H / edgeFactor} />
          <HeatmapBox scores={counts} h={H / edgeFactor} w={W} location={12}></HeatmapBox>
          <HeatmapBox scores={counts} h={H / edgeFactor} w={W} location={13}></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H / edgeFactor} />
          <HeatmapBox scores={counts} h={H / edgeFactor} w={W} location={14}></HeatmapBox>
          <HeatmapBox scores={counts} h={H / edgeFactor} w={W} location={15}></HeatmapBox>
          <HeatmapBox
            scores={counts}
            h={H / edgeFactor}
            w={W / edgeFactor}
            location={16}
          ></HeatmapBox>
        </Flex>

        <Box
          pos="relative"
          left={W / edgeFactor}
          w={4 * W + 3 * lineThickness}
          bg="purple"
          h={lineThickness}
        />

        <Flex>
          <HeatmapBox scores={counts} h={H} w={W / edgeFactor} location={21}></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox scores={counts} h={H} w={W} location={22}></HeatmapBox>
          <HeatmapBox scores={counts} h={H} w={W} location={23}></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H} />
          <HeatmapBox scores={counts} h={H} w={W} location={24}></HeatmapBox>
          <HeatmapBox scores={counts} h={H} w={W} location={25}></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox scores={counts} h={H} w={W / edgeFactor} location={26}></HeatmapBox>
        </Flex>
        <Flex>
          <HeatmapBox scores={counts} h={H} w={W / edgeFactor} location={31}></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H}></Box>
          <HeatmapBox scores={counts} h={H} w={W} location={32}></HeatmapBox>
          <HeatmapBox scores={counts} h={H} w={W} location={33}></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H} />
          <HeatmapBox scores={counts} h={H} w={W} location={34}></HeatmapBox>
          <HeatmapBox scores={counts} h={H} w={W} location={35}></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox scores={counts} h={H} w={W / edgeFactor} location={36}></HeatmapBox>
        </Flex>

        <Box
          pos="relative"
          left={W / edgeFactor}
          w={4 * W + 3 * lineThickness}
          bg="red"
          h={lineThickness}
        />

        <Flex>
          <HeatmapBox scores={counts} h={H} w={W / edgeFactor} location={41}></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox scores={counts} h={H} w={W} location={42}></HeatmapBox>
          <HeatmapBox scores={counts} h={H} w={W} location={43}></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H} />
          <HeatmapBox scores={counts} h={H} w={W} location={44}></HeatmapBox>
          <HeatmapBox scores={counts} h={H} w={W} location={45}></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox scores={counts} h={H} w={W / edgeFactor} location={46}></HeatmapBox>
        </Flex>

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
    </>
  );
}
