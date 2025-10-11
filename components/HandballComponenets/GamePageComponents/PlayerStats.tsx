import React from 'react';
import { generateColors } from '@mantine/colors-generator';
import { Box, Flex, HoverCard, Table, Text, useMantineTheme } from '@mantine/core';
import { playersOf } from '@/components/HandballComponenets/StatsComponents/IndividualPlayer';
import { GameStructure, GameTeamStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

const hiddenStats = [
  'Elo',
  'Elo Delta',
  'B&F Votes',
  'Games Won',
  'Games Lost',
  'Games Played',
  'Rounds on Court',
  'Cards',
];

interface PlayerStatsStructure {
  game: GameStructure;
}

interface PlayerBoxParams {
  player: PlayerGameStatsStructure;
  stat: string;
  total: number;
  color: string;
  teamOne: boolean;
}

function PlayerBox({ player, stat, total, color, teamOne }: PlayerBoxParams) {
  return (
    <Flex w="100%" h={20} align="center" justify={teamOne ? 'flex-end' : 'flex-start'}>
      {teamOne && <i>{player.stats[stat]}</i>}
      <HoverCard closeDelay={100}>
        <HoverCard.Target>
          <Box
            h="65%"
            miw={`${(player.stats[stat] / (total || 1)) * 70}%`}
            bg={color}
            m={5}
            style={{ borderRadius: teamOne ? '5px 0 0 5px' : '0 5px 5px 0' }}
          ></Box>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text fw="bold">{player.name}</Text>
          <Text>
            {stat}: {player.stats[stat]}
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
      {teamOne || <i>{player.stats[stat]}</i>}
    </Flex>
  );
}

interface TeamBoxesParams {
  team: GameTeamStructure;
  stat: string;
  total: number;
  teamOne: boolean;
}

function TeamBoxes({ team, stat, total, teamOne }: TeamBoxesParams) {
  const theme = useMantineTheme();
  let teamNumber = 2;
  const players = playersOf(team);
  const colors = team.teamColor ? generateColors(team.teamColor) : theme.colors.tournament;
  const indexes = [3, 7];
  return players.map((p) => {
    teamNumber += 1;
    return (
      <PlayerBox
        player={p}
        stat={stat}
        total={total}
        color={colors[indexes[teamNumber % 2]]}
        teamOne={teamOne}
      />
    );
  });
}

export function PlayerStats({ game }: PlayerStatsStructure) {
  if (!game) {
    return <p>error</p>;
  }
  const teamOnePlayers: PlayerGameStatsStructure[] = playersOf(game.teamOne);
  const teamTwoPlayers: PlayerGameStatsStructure[] = playersOf(game.teamTwo);
  const allPlayers = teamOnePlayers.concat(teamTwoPlayers);
  const statRows = Object.keys(allPlayers[0].stats)
    .filter((s) => !hiddenStats.includes(s))
    .map((s) => {
      let statTotal = 0;
      allPlayers.forEach((p: PlayerGameStatsStructure) => {
        statTotal += p.stats[s] as number;
      });
      return (
        <Table.Tr key={s}>
          <Table.Td pos="relative">
            <Flex align="flex-end" direction="column">
              <TeamBoxes team={game.teamOne} stat={s} total={statTotal} teamOne={true} />
            </Flex>
          </Table.Td>
          <Table.Td fw="bold">{s}</Table.Td>
          <Table.Td>
            <Flex align="flex-start" direction="column">
              <TeamBoxes team={game.teamTwo} stat={s} total={statTotal} teamOne={false} />
            </Flex>
          </Table.Td>
        </Table.Tr>
      );
    });

  return (
    <>
      <Table withColumnBorders>
        <Table.Tr>
          <Table.Th style={{ textAlign: 'right' }} w="37.5%">
            {game.teamOne.name}
          </Table.Th>
          <Table.Th style={{ textAlign: 'center' }} w="25%">
            Stat
          </Table.Th>
          <Table.Th style={{ textAlign: 'left' }} w="37.5%">
            {game.teamTwo.name}
          </Table.Th>
        </Table.Tr>
        {statRows}
      </Table>
    </>
  );
}
