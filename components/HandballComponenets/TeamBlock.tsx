import { Box, Center, Group, Image, Paper, Text, useMantineColorScheme } from '@mantine/core';
import { eventIcon } from '@/components/HandballComponenets/AdminGamePanel';
import { GameStructure } from '@/ServerActions/types';
import classes from './TeamBlock.module.css';

interface GameBlockComfyParams {
  game: GameStructure;
  showCards?: boolean;
}

export default function GameBlockComfy({ game }: GameBlockComfyParams) {
  const default_color = '#5555';
  const { colorScheme } = useMantineColorScheme();
  return (
    <Box>
      <Paper
        className={`hideLink ${classes.TeamGradient}`}
        h="100%"
        w="100%"
        component="a"
        href={`/games/${game.id}`}
        style={{
          '--team-one-col': game.teamOne.teamColor ?? default_color,
          '--team-two-col': game.teamTwo.teamColor ?? default_color,
        }}
      >
        <Group justify="center" align="end" grow mr={10} ml={10}>
          <Text
            style={{
              textWrap: 'balance',
              lineHeight: '1.2em',
              height: '2.4em',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              textAlign: 'left',
            }}
            lineClamp={2}
            pb={6}
            c="white"
          >
            {game.teamOne.name}
          </Text>
          {game.tournament ? (
            <Box h={30} m="auto" style={{ justifySelf: 'center' }}>
              <Center h={60}>
                <Image src={game.tournament.imageUrl} h="100%" w="auto"></Image>
              </Center>
            </Box>
          ) : (
            <></>
          )}
          <Text
            style={{
              textWrap: 'balance',
              lineHeight: '1.2em',
              height: '2.4em',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              textAlign: 'right',
            }}
            lineClamp={2}
            mb={2}
            c="white"
          >
            {game.teamTwo.name}
          </Text>
        </Group>
        <Paper
          w="100%"
          h="90px"
          className={classes.TeamGradient}
          style={{
            '--team-one-col': game.teamOne.teamColor ?? default_color,
            '--team-two-col': game.teamTwo.teamColor ?? default_color,
          }}
        >
          <Group justify="space-between" wrap="nowrap" h="100%" style={{ overflow: 'visible' }}>
            <Image
              src={game.teamOne.imageUrl}
              h="100%"
              w="auto"
              p={10}
              fit="cover"
              style={{ overflow: 'visible' }}
            />
            <Text fz={50} w="20%">
              {game.teamOneScore}
            </Text>
            <Text fz={50} style={{ textAlign: 'center' }} w="20%">
              -
            </Text>
            <Text fz={50} style={{ textAlign: 'right' }} w="20%">
              {game.teamTwoScore}
            </Text>
            <Image src={game.teamTwo.imageUrl} h="100%" w="auto" p={10} />
          </Group>
        </Paper>
      </Paper>
      <Center w="100%">
        <Paper
          shadow="xl"
          w="90%"
          h={30}
          pl={10}
          pr={10}
          style={{
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            alignContent: 'center',
          }}
          bg={colorScheme === 'dark' ? '#1a1a1a' : '#fffa'}
        >
          <Group justify="space-between">
            <Group justify="left">
              {game.admin?.cards
                ?.filter((e) => !!e.firstTeam)
                .filter((e) => e.eventType !== 'Warning')
                .map((e) => eventIcon(e))}
            </Group>
            <Group justify="right">
              {game.admin?.cards
                ?.filter((e) => !e.firstTeam)
                .filter((e) => e.eventType !== 'Warning')
                .map((e) => eventIcon(e))}
            </Group>
          </Group>
        </Paper>
      </Center>
    </Box>
  );
}
