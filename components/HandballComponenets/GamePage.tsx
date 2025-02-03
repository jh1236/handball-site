'use client';

import React, { useEffect } from 'react';
import { Box, Divider, Grid, Image, Paper, Table, Tabs, Text, Title } from '@mantine/core';
import { Box, Center, Divider, Grid, Paper, Select, Table, Tabs, Text, Title } from '@mantine/core';
import classes from '@/app/games/[game]/gamesStyles.module.css';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getGame } from '@/ServerActions/GameActions';
import {GameStructure, PersonStructure, PlayerGameStatsStructure} from '@/ServerActions/types';
import {isAdmin} from "@/components/HandballComponenets/ServerActions";

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
    console.log(`${allPlayers}`);
    const player: PersonStructure = allPlayers.find((p: PlayerGameStatsStructure) =>
        (p.name === playerName)
    )!;
    if (!player) { return (<p>could not find {playerName} </p>); }
    const statsTable = [];
    for (const k of Object.keys(player)) {
      statsTable.push({
        stat: k,
        playerStat: player[k],
      });
    }
    const rows = statsTable.map((s) =>(
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
      <Table stripedColor="#f0fff0" striped="odd" withColumnBorders>
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
        {/* does the Gradient area*/}
        <Box
          className={
            game.teamOneScore > game.teamTwoScore ? classes.teamOneWin : classes.teamTwoWin
          }
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
              <Title lineClamp={2}>{game.teamOne.name}</Title>
            </Grid.Col>
            <Grid.Col span={2} style={{ fontSize: 30 }}>
              vs
            </Grid.Col>
            <Grid.Col span={5}>
              <Title lineClamp={2}>{game.teamTwo.name}</Title>
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
            style={{ fontSize: '80px' }}
            pos="relative"
            top={-50}
            columns={13}
            overflow="hidden"
            h="150px"
          >
            <Grid.Col span={3}>
              <Image
                src={game.teamOne.imageUrl}
                alt="the team logo for team one"
                style={{
                  margin: 'auto',
                  width: '100%',
                }}
              ></Image>
            </Grid.Col>
            <Grid.Col span={3}>{game.teamOneScore}</Grid.Col>
            <Grid.Col span={1}>-</Grid.Col>
            <Grid.Col span={3}>{game.teamTwoScore}</Grid.Col>
            <Grid.Col span={3}>
              <Image
                src={game.teamTwo.imageUrl}
                alt="The team logo for team two"
                style={{
                  margin: 'auto',
                  width: '90%',
                }}
              ></Image>
            </Grid.Col>
          </Grid>
          <Text pos="relative" bottom={50}>
            Scored by {game.official.name}
          </Text>
        </Box>
        <Divider></Divider>
        <Box pos="relative">
          <Tabs defaultValue="teamStats" color="#B2F2BB">
            <Paper component={Tabs.List} grow bg="#fcfffc" shadow="xs" justify="center">
              <Tabs.Tab value="teamStats">Team Stats</Tabs.Tab>
              <Tabs.Tab value="playerStats">Player Stats</Tabs.Tab>
              <Tabs.Tab value="3">Test 3</Tabs.Tab>
              {true && <Tabs.Tab value="admin"></Tabs.Tab>}
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
            <Tabs.Panel value="3">this is 3</Tabs.Panel>
          </Tabs>
          <Box></Box>
        </Box>
      </Box>
    </SidebarLayout>
  );
}
