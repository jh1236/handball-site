'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Divider, Image, Paper, Select, Table, Tabs, Text } from '@mantine/core';
import classes from '@/app/games/[game]/gamesStyles.module.css';
import { AdminGamePanel } from '@/components/HandballComponenets/AdminGamePanel';
import { useUserData } from '@/components/HandballComponenets/ServerActions';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';
import { getGame } from '@/ServerActions/GameActions';
import {
  GameStructure,
  PersonStructure,
  PlayerGameStatsStructure,
} from '@/ServerActions/types';

interface GamePageProps {
  gameID: number;
}

export function GamePage({ gameID }: GamePageProps) {
  const [game, setGame] = React.useState<GameStructure>();
  const [playerSelect, setPlayerSelect] = React.useState('');
  const [activeTab, setActiveTab] = useState<string | null>('teamStats');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOfficial } = useUserData();
  useEffect(() => {
    getGame({
      gameID,
      includeStats: true,
      includeGameEvents: true,
    }).then((g) => {
      setGame(g);
      setPlayerSelect(g.teamOne.captain.name);
    });
  }, [gameID]);
  useEffect(() => {
    if (activeTab !== 'teamStats') {
      router.replace(`${window.location.href.split('?')[0]}?tab=${activeTab}`);
    } else {
      router.replace(`${window.location.href.split('?')[0]}`);
    }
  }, [activeTab, router]);
  useEffect(() => {
    const tab = searchParams.get('tab') === null ? 'teamStats' : searchParams.get('tab');
    setActiveTab(tab);
  }, [searchParams]);
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
    if (!game) {
      return <p>error</p>;
    }
    const allPlayers: PlayerGameStatsStructure[] = [
      game.teamOne.captain,
      game.teamOne.nonCaptain,
      game.teamOne.substitute,
      game.teamTwo.captain,
      game.teamTwo.nonCaptain,
      game.teamTwo.substitute,
    ].filter((a) => typeof a !== 'undefined' && a !== null);
    const player: PersonStructure = allPlayers.find(
      (p: PlayerGameStatsStructure) => p.name === playerName
    )!;
    if (!player) {
      return <p> Select a player to see their stats :)</p>;
    }
    const statsTable = [];
    if (!player.stats) {
      return <p> could not find {playerName}&#39;s stats</p>;
    }
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
    ));
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
      <Table striped="odd" withColumnBorders>
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
  function generateScoreGraphic(): any {
    if (!game) {
      return <p> error! </p>;
    }
    return (
      <Box
        className={classes.teamGradient}
        style={{
          '--team-one-col': game.teamOne.teamColor || '#5c9865',
          '--team-two-col': game.teamTwo.teamColor || '#5c9865',
          left: 0,
        }}
      >
        <div className={`${classes.teamNames} ${classes.team1Name}`}><p>{game.teamOne.name}</p> </div>
        <div className={`${classes.dash} ${classes.verse}`}>VS</div>
        <div className={`${classes.teamNames} ${classes.team2Name}`}>{game.teamTwo.name}</div>
        <div className={`${classes.teamLogos} ${classes.logo1}`} style={{ justifyItems: 'flex-end' }}>
          <Image src={game.teamOne.imageUrl} />
        </div>
        <p className={`${classes.teamInfo} ${classes.info1}`}>
          <p> {game.teamOne.captain.name} </p>
          { game.teamOne.nonCaptain ? <p>{game.teamOne.nonCaptain.name}</p> : ''}
          { game.teamOne.substitute ? <p>{game.teamOne.substitute.name}</p> : ''}
        </p>
        <div className={`${classes.teamScores} ${classes.score1}`}>{game.teamOneScore}</div>
        <div className={`${classes.dash}`}>-</div>
        <div className={`${classes.teamScores} ${classes.score2}`}>{game.teamTwoScore}</div>
        <p className={`${classes.teamInfo} ${classes.info2}`}>
          <p> {game.teamTwo.captain.name} </p>
          {game.teamTwo.nonCaptain ? <p>{game.teamTwo.nonCaptain.name}</p> : ''}
          {game.teamTwo.substitute ? <p>{game.teamTwo.substitute.name}</p> : ''}
        </p>
        <div className={`${classes.teamLogos} ${classes.logo2}`}>
          <Image src={game.teamTwo.imageUrl} />
        </div>
        <div className={`${classes.gameOfficial}`}><p>Officiated by {game.official.name}</p></div>
      </Box>
    );
  }

  return (
    <SidebarLayout tournamentName={game.tournament.searchableName}>
      <Box ta="center" w="100%">
        {generateScoreGraphic()}
        <Divider></Divider>
        <Box pos="relative">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Paper component={Tabs.List} grow shadow="xs" justify="space-between">
              <Tabs.Tab value="teamStats">Team Stats</Tabs.Tab>
              <Tabs.Tab value="playerStats">Player Stats</Tabs.Tab>
              {isOfficial && <Tabs.Tab value="admin"> Management </Tabs.Tab>}
            </Paper>
            <Tabs.Panel value="teamStats">{generateTeamStatsTable()}</Tabs.Panel>
            <Tabs.Panel value="playerStats">
              <Select
                label="Select Player"
                placeholder="Select Player"
                data={[
                  game.teamOne.captain.name,
                  game.teamOne.nonCaptain?.name,
                  game.teamTwo.captain.name,
                  game.teamTwo.nonCaptain?.name,
                ].filter((a) => typeof a === 'string')}
                onSearchChange={setPlayerSelect}
                allowDeselect={false}
                searchValue={playerSelect}
              ></Select>
              <p>{playerSelect}</p>
              <div>{generatePlayerStats(playerSelect)}</div>
            </Tabs.Panel>
            {isOfficial && (
              <Tabs.Panel value="admin">
                <AdminGamePanel game={game}></AdminGamePanel>
              </Tabs.Panel>
            )}
          </Tabs>
          <Box></Box>
        </Box>
      </Box>
    </SidebarLayout>
  );
}
