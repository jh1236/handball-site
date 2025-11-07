import React from 'react';
import {
  Box,
  Center,
  Checkbox,
  Group,
  HoverCard,
  Image,
  Paper,
  Rating,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { eventIcon } from '@/components/HandballComponenets/AdminGamePanel';
import { GameStructure, TournamentStructure } from '@/ServerActions/types';
import classes from './TeamBlock.module.css';

interface GameBlockComfyParams {
  game: GameStructure;
  showCards?: boolean;
  tournament?: TournamentStructure;
}

export default function GameBlockComfy({ game, tournament }: GameBlockComfyParams) {
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
          {(game.tournament || tournament) && (
            <Box h={30} m="auto" style={{ justifySelf: 'center' }}>
              <Center h={60}>
                <HoverCard disabled={!game.admin}>
                  <HoverCard.Target>
                    <Image
                      style={{
                        filter: game.admin?.markedForReview
                          ? 'drop-shadow(0 0 10px red)'
                          : undefined,
                        overflow: 'visible',
                      }}
                      src={(game.tournament || tournament).imageUrl}
                      h="100%"
                      w="auto"
                    ></Image>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Checkbox
                      label="Marked For Review"
                      readOnly
                      checked={game.admin?.markedForReview}
                    ></Checkbox>
                    <b>Notes: </b> <i>{game.admin?.notes?.trim() ? game.admin.notes : 'Unset'}</i>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Center>
            </Box>
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
            <HoverCard disabled={!game.admin}>
              <HoverCard.Target>
                <Image
                  src={game.teamOne.imageUrl}
                  style={{
                    filter:
                      game.admin?.teamOneProtest || game.admin?.teamOneRating === 1
                        ? 'drop-shadow(0 0 10px red)'
                        : undefined,
                    overflow: 'visible',
                  }}
                  h="100%"
                  w="auto"
                  p={10}
                  fit="cover"
                />
              </HoverCard.Target>
              <HoverCard.Dropdown maw={300}>
                <Rating value={game.admin?.teamOneRating} count={4} size="lg" readOnly></Rating>
                <b>Notes: </b>
                <i>{game.admin?.teamOneNotes?.trim() ? game.admin?.teamOneNotes : 'Unset'}</i>
                <br />
                <b>Protest: </b>
                <i>{game.admin?.teamOneProtest ?? 'Unset'}</i>
              </HoverCard.Dropdown>
            </HoverCard>
            <Text fz={50} w="30%">
              {game.teamOneScore}
            </Text>
            <Text fz={50} style={{ textAlign: 'center' }} w="20%">
              -
            </Text>
            <Text fz={50} style={{ textAlign: 'right' }} w="30%">
              {game.teamTwoScore}
            </Text>
            <HoverCard disabled={!game.admin}>
              <HoverCard.Target>
                <Image
                  src={game.teamTwo.imageUrl}
                  style={{
                    filter:
                      game.admin?.teamTwoProtest || game.admin?.teamTwoRating === 1
                        ? 'drop-shadow(0 0 10px red)'
                        : undefined,
                    overflow: 'visible',
                  }}
                  h="100%"
                  w="auto"
                  p={10}
                  fit="cover"
                />
              </HoverCard.Target>
              <HoverCard.Dropdown maw={300}>
                <Rating value={game.admin?.teamTwoRating} count={4} size="lg" readOnly></Rating>
                <b>Notes: </b>
                <i>{game.admin?.teamTwoNotes?.trim() ? game.admin?.teamTwoNotes : 'Unset'}</i>
                <br />
                <b>Protest: </b>
                <i>{game.admin?.teamTwoProtest ?? 'Unset'}</i>
              </HoverCard.Dropdown>
            </HoverCard>
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
                .map((e) => (
                  <HoverCard width={280} shadow="md">
                    <HoverCard.Target>{eventIcon(e)}</HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text>
                        <strong>{e.player?.name}</strong> received a <strong>{e.eventType}</strong>{' '}
                        for <i>{e.notes}</i>
                      </Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                ))}
            </Group>
            <Group justify="right">
              {game.admin?.cards
                ?.filter((e) => !e.firstTeam)
                .filter((e) => e.eventType !== 'Warning')
                .map((e) => (
                  <HoverCard width={280} shadow="md">
                    <HoverCard.Target>{eventIcon(e)}</HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text>
                        <strong>{e.player?.name}</strong> received a <strong>{e.eventType}</strong>{' '}
                        for <i>{e.notes}</i>
                      </Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                ))}
            </Group>
          </Group>
        </Paper>
      </Center>
    </Box>
  );
}
