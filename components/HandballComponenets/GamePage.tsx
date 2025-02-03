'use client';

import React, { useEffect } from 'react';
import {
  Select,
  Box,
  Divider,
  Grid,
  Image,
  Paper,
  Table,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import classes from '@/app/games/[game]/gamesStyles.module.css';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getGame } from '@/ServerActions/GameActions';
import { GameStructure, PersonStructure, PlayerGameStatsStructure } from '@/ServerActions/types';
import { isAdmin } from '@/components/HandballComponenets/ServerActions';

interface GamePageProps {
  gameID: number;
}

export function GamePage({ gameID }: GamePageProps) {
  const [game, setGame] = React.useState<GameStructure>();
  const [playerSelect, setPlayerSelect] = React.useState('');
  localStorage.getItem('permissions');
  useEffect(() => {
    getGame({
      gameID,
      includeStats: true,
    }).then(setGame);
  }, [gameID]);
  if (!game) {
    return <SidebarLayout>Loading...</SidebarLayout>;
  }

  const date = new Date(0);
  if (game.startTime && game.startTime > 0) {
    date.setUTCMilliseconds(Math.floor(1000 * game.startTime));
  }
  const LocaleDateIndex: number = date.toLocaleDateString().indexOf(',');
  const localeDate: string[] = [];
  localeDate.push(date.toLocaleDateString().slice(0, LocaleDateIndex + 1));
  localeDate.push(date.toLocaleTimeString().slice(LocaleDateIndex + 1));
  const teamGradient = `linear-gradient(to right, rgba(${game.teamOne.teamColorAsRGBABecauseDigbyIsLazy ? game.teamOne.teamColorAsRGBABecauseDigbyIsLazy.toString() : '0,0,255,255'}), rgba(0,0,0,0), rgba(${game.teamTwo.teamColorAsRGBABecauseDigbyIsLazy ? game.teamTwo.teamColorAsRGBABecauseDigbyIsLazy.toString() : '0,0,255,255'})`;

  function generatePlayerStats(playerName: string) {
    if (!game) { return (<p>error</p>); }
    const allPlayers: PlayerGameStatsStructure[] = [
      game.teamOne.captain,
      game.teamOne.nonCaptain,
      game.teamOne.substitute,
      game.teamTwo.captain,
      game.teamTwo.nonCaptain,
      game.teamTwo.substitute,
    ].filter(a => typeof a !== 'undefined' && a !== null);
    const player: PersonStructure = allPlayers.find((p: PlayerGameStatsStructure) =>
        (p.name === playerName)
    )!;
    if (!player) { return (<p> Select a player to see their stats :)</p>); }
    const statsTable = [];
    if (!player.stats) { return (<p> could not find {playerName}&#39;s stats</p>); }
    for (const k of Object.keys(player.stats)) {
      statsTable.push({
        stat: k,
        playerStat: player.stats[k],
      });
    }
    const rows = statsTable.map((s) => (
        <Table.Tr key={s.stat}>
          <Table.Td>{s.stat}</Table.Td>
          <Table.Td>{s.playerStat}</Table.Td>
        </Table.Tr>
        )
    );
    return (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Statistic</Table.Th>
              <Table.Th>Player Stats (Game)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
  }

  function generateTeamStatsTable(): any {
    if (!game || !game.teamOne || !game.teamTwo || !game.teamOne.stats || !game.teamTwo.stats) {
      return <p> error </p>;
    }
    const statsTable: any[] = [];
    for (const k of Object.keys(game.teamOne.stats)) {
      if (k !== 'Elo Delta') {
        statsTable.push({
          teamOneStat: game.teamOne.stats[k],
          stat: k,
          teamTwoStat: game.teamTwo.stats[k],
        });
      }
    }
    const rows = statsTable.map((s) => (
      <Table.Tr key={s.stat}>
        <Table.Td>
          {s.teamOneStat} {/*handles the displaying the delta elo*/ ' '}
          {s.stat === 'Elo' && (
            <Text
              fz="sm"
              fw="bold"
              display="inline"
              c={Number(game.teamOne.stats!['Elo Delta']) < 0 ? 'red' : 'green'}
            >
              {game.teamOne.stats!['Elo Delta'] > 0
                ? `+${game.teamOne.stats!['Elo Delta']}`
                : game.teamOne.stats!['Elo Delta']}
            </Text>
          )}
        </Table.Td>
        <Table.Td>{s.stat}</Table.Td>
        <Table.Td>
          {s.teamTwoStat}{' '}
          {s.stat === 'Elo' && (
            <Text
              fw="bold"
              display="inline"
              c={Number(game.teamTwo.stats!['Elo Delta']) < 0 ? 'red' : 'green'}
            >
              {game.teamTwo.stats!['Elo Delta'] > 0
                ? `+${game.teamTwo.stats!['Elo Delta']}`
                : game.teamTwo.stats!['Elo Delta']}
            </Text>
          )}
        </Table.Td>
      </Table.Tr>
    ));
    return (
      <Table stripedColor="green" striped="odd" withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="37.5%" style={{ textAlign: 'center' }}>
              {game.teamOne.name}
            </Table.Th>
            <Table.Th w="25%" style={{ textAlign: 'center' }}>
              Statistic
            </Table.Th>
            <Table.Th w="37.5%" style={{ textAlign: 'center' }}>
              {game.teamTwo.name}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );
  }

  return (
    <SidebarLayout tournamentName={game.tournament.searchableName}>
      <Box ta="center" w="100%">
        <Box
          style={{ background: teamGradient }}
          w="100%"
          h="300px"
          pos="relative"
          left="0"
          top="100"
          pt="0"
        >
          <Grid
            top="0"
            pt="md"
            justify="center"
            align="center"
            mb={20}
            mah={250}
            w="100%"
            style={{
              verticalAlign: 'middle',
              fontWeight: 'bold',
              fontSize: 50,
              maxHeight: '1',
            }}
          >
            <Grid.Col span={5}>
              <Title
                order={2}
                lineClamp={2}
                component="a"
                className={classes.secretLink}
                href={`../teams/${game.teamOne.searchableName}`}
              >
                {game.teamOne.name}
              </Title>
            </Grid.Col>
            <Grid.Col span={2} style={{ fontSize: 30 }}>
              vs
            </Grid.Col>
            <Grid.Col span={5}>
              <Title
                component="a"
                className={classes.secretLink}
                order={2}
                lineClamp={2}
                href={`../teams/${game.teamTwo.searchableName}`}
              >
                {game.teamTwo.name}
              </Title>
            </Grid.Col>
          </Grid>
          <Grid columns={5} pos="relative" top={-25}>
            <Grid.Col span={2} style={{ textAlign: 'end' }}>
              {date.toLocaleDateString(undefined, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Grid.Col>
            <Grid.Col span={1}>
              {date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </Grid.Col>
            <Grid.Col span={2} style={{ textAlign: 'left' }}>
              {(game.length / 60).toFixed(0)} Minutes
            </Grid.Col>
          </Grid>
          <Grid
            style={{
              fontSize: '80px',
              overflow: 'hidden',
            }}
            pos="relative"
            top={-50}
            columns={13}
          >
            <Grid.Col span={3} pos="relative" h={150}>
              <Box
                w="150px"
                h="150px"
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start', // Align to the left
                  alignItems: 'center',
                  overflow: 'hidden', // Ensure overflow is hidden
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}
              >
                <Image
                  src={game.teamOne.imageUrl}
                  fit="cover"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover', // Ensure the image fills the container
                    position: 'absolute',
                  }}
                />
              </Box>
            </Grid.Col>
            <Grid.Col span={3}>{game.teamOneScore}</Grid.Col>
            <Grid.Col span={1}>-</Grid.Col>
            <Grid.Col span={3}>{game.teamTwoScore}</Grid.Col>
            <Grid.Col span={3}>
              <Box
                w="150px"
                h="150px"
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  src={game.teamTwo.imageUrl}
                  fit="fill"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                ></Image>
              </Box>
            </Grid.Col>
          </Grid>
          <Text pos="relative" bottom={20} style={{ background: 'rgba(100, 100, 100, 0.1)' }}> Status: {game.status} | Officiated by {game.official.name}</Text>
        </Box>
        <Divider></Divider>
        <Box pos="relative">
          <Tabs defaultValue="teamStats" color="#B2F2BB">
            <Paper component={Tabs.List} grow bg="#fcfffc" shadow="xs" justify="space-between">
              <Tabs.Tab value="teamStats">Team Stats</Tabs.Tab>
              <Tabs.Tab value="playerStats">Player Stats</Tabs.Tab>
              {isAdmin() && <Tabs.Tab value="admin"> ADMIN TAB </Tabs.Tab>}
            </Paper>
            <Tabs.Panel value="teamStats">{generateTeamStatsTable()}</Tabs.Panel>
            <Tabs.Panel value="playerStats">
              <Select
                label="Select Player"
                placeholder="Select Player"
                data={[
                  game.teamOne.captain.name,
                    game.teamOne.nonCaptain!.name,
                    game.teamTwo.captain.name,
                    game.teamTwo.nonCaptain!.name,
                ]}
                onSearchChange={setPlayerSelect}
                searchValue={playerSelect}
              ></Select>
              <p>{playerSelect}</p>
              <div>{generatePlayerStats(playerSelect)}</div>
            </Tabs.Panel>
          </Tabs>
          <Box></Box>
        </Box>
      </Box>
    </SidebarLayout>
  );
}
