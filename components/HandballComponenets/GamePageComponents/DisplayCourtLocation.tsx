import {
  Box,
  Center,
  Flex,
  HoverCard,
  MantineStyleProp,
  Text,
  Title,
  useMatches,
} from '@mantine/core';
import { GameStructure } from '@/ServerActions/types';
import classes from './DisplayCourtLocation.module.css';

interface SelectCourtLocationParams {
  game: GameStructure;
}

const COLUMN_NAME = ['Deep-Court', 'Back-Court', 'Mid-Court', 'Front-Court'] as const;

const ROW_NAME = [
  'Wide Left',
  'Left',
  'Center-Left',
  'Center-Right',
  'Right',
  'Wide Right',
] as const;

function HeatmapBox({
  maxScore,
  game,
  location,
  w,
  h,
  style,
  firstTeam,
}: {
  maxScore: number;
  location: number;
  w: number;
  game: GameStructure;
  h: number;
  style?: MantineStyleProp;
  firstTeam: boolean;
}) {
  const myScoreEvents =
    game.events?.filter(
      (gE) => gE.eventType === 'Score' && gE.details === location && gE.firstTeam === firstTeam
    ) ?? [];
  const myScore = myScoreEvents.length;

  const types = myScoreEvents.reduce(
    (acc, item) => {
      acc[item.notes ?? 'Not Provided'] = (acc[item.notes ?? 'Not Provided'] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  )!;

  return (
    <HoverCard openDelay={200}>
      <HoverCard.Target>
        <Center style={style} h={h} w={w} bg="#ff0000" opacity={myScore / maxScore} c="white">
          {myScore >= 1 && <i>{myScore}</i>}
        </Center>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Title order={3}>
          {ROW_NAME[(location % 10) - 1]} {COLUMN_NAME[Math.floor(location / 10) - 1]}
        </Title>
        {Object.keys(types).length ? (
          Object.keys(types).map((k, i) => (
            <Text key={i}>
              {' '}
              {k}: {types[k]}
            </Text>
          ))
        ) : (
          <i>No points were scored here</i>
        )}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

export function DisplayCourtLocation({ game }: SelectCourtLocationParams) {
  const W = useMatches({ base: 30, md: 50 });
  const H = useMatches({ base: 30, md: 50 });
  const lineThickness = 3;
  const edgeFactor = 2;
  const counts = game.events
    ?.filter((gE) => gE.eventType === 'Score')
    .reduce(
      (acc, item) => {
        acc[(item.firstTeam ? -1 : 1) * (item.details ?? 0)] =
          (acc[(item.firstTeam ? -1 : 1) * (item.details ?? 0)] || 0) + 1;
        return acc;
      },
      {} as { [key: number]: number }
    )!;

  const maxScore = Math.max(...Object.values(counts));

  return (
    <>
      <div className={classes.root} dir="ltr">
        <Center>
          <i>{game.teamOne.name}</i>
        </Center>

        <Flex>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W / edgeFactor}
            location={11}
          ></HeatmapBox>
          <Box w={lineThickness} h={H / edgeFactor} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W}
            location={12}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W}
            location={13}
          ></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H / edgeFactor} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W}
            location={14}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W}
            location={15}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
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
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={21}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={22}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={23}
          ></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={24}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={25}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={26}
          ></HeatmapBox>
        </Flex>
        <Flex>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={31}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H}></Box>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={32}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={33}
          ></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={34}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={35}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={36}
          ></HeatmapBox>
        </Flex>

        <Box
          pos="relative"
          left={W / edgeFactor}
          w={4 * W + 3 * lineThickness}
          bg="red"
          h={lineThickness}
        />

        <Flex>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={41}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={42}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={43}
          ></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={44}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={45}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={46}
          ></HeatmapBox>
        </Flex>

        <Box
          pos="relative"
          left={W / edgeFactor}
          w={4 * W + 3 * lineThickness}
          bg="white"
          h={lineThickness}
        />
        <Flex>
          <HeatmapBox
            firstTeam={true}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={41}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={46}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={44}
          ></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={43}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={42}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={41}
          ></HeatmapBox>
        </Flex>
        <Box
          pos="relative"
          left={W / edgeFactor}
          w={4 * W + 3 * lineThickness}
          bg="red"
          h={lineThickness}
        />
        <Flex>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={36}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H}></Box>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={35}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={34}
          ></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={33}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={32}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={31}
          ></HeatmapBox>
        </Flex>

        <Flex>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={26}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={25}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={24}
          ></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={23}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W}
            location={22}
          ></HeatmapBox>
          <Box w={lineThickness} bg="pink" h={H} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H}
            w={W / edgeFactor}
            location={21}
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
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W / edgeFactor}
            location={16}
          ></HeatmapBox>
          <Box w={lineThickness} h={H / edgeFactor} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W}
            location={15}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W}
            location={14}
          ></HeatmapBox>
          <Box w={lineThickness} bg="green" h={H / edgeFactor} />
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W}
            location={13}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W}
            location={12}
          ></HeatmapBox>
          <HeatmapBox
            firstTeam={false}
            game={game}
            maxScore={maxScore}
            h={H / edgeFactor}
            w={W / edgeFactor}
            location={11}
          ></HeatmapBox>
        </Flex>
        <Center>
          <i>{game.teamTwo.name}</i>
        </Center>
      </div>
    </>
  );
}
