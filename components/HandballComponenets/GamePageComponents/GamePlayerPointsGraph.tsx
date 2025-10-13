import React, { useMemo } from 'react';
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { generateColors } from '@mantine/colors-generator';
import { useMantineTheme, useMatches } from '@mantine/core';
import { playersOf } from '@/components/HandballComponenets/StatsComponents/IndividualPlayer';
import { GameStructure, TeamStructure } from '@/ServerActions/types';

export function GamePlayerPointsGraph({ game }: { game: GameStructure }): React.ReactElement {
  const RADIAN = Math.PI / 180;
  const theme = useMantineTheme();

  const renderPercentage = ({ cx, cy, midAngle, innerRadius, outerRadius, key, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {key} {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  const colors = (team?: TeamStructure) =>
    (!team
      ? undefined
      : team?.teamColor
        ? generateColors(team.teamColor)
        : theme.colors.tournament) ?? '#737373';
  const indexes = [3, 7];

  const pointsData = useMemo(
    () =>
      game &&
      Array.from(
        new Set(game.events?.filter((gE) => gE.eventType === 'Score').map((e) => e.player?.name))
      )
        .map((a) => ({
          name: a ?? 'Penalty',
          value: game.events
            ?.filter((gE) => gE.eventType === 'Score')
            .map((e) => e.player?.name)
            .filter((f) => f === a).length,
          teamOne: playersOf(game.teamOne)
            .map((pgs) => pgs.name)
            .includes(a ?? 'Penalty'),
          index: Math.max(
            playersOf(game.teamOne).findIndex((pgs) => pgs.name === a),
            playersOf(game.teamTwo).findIndex((pgs) => pgs.name === a)
          ),
        }))
        .toSorted((a, b) => +(!a.teamOne && b.teamOne)),
    [game]
  );
  const size = useMatches({
    base: 90,
    md: undefined,
  });
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          outerRadius={size}
          data={pointsData}
          fill="#8884d8"
          dataKey="value"
          label={renderPercentage}
        >
          <LabelList dataKey="name" position="outside" offset={25} fill="#888" />
          {pointsData?.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={
                colors(entry.teamOne ? game.teamOne : game.teamTwo)[indexes[(entry.index + 1) % 2]]
              }
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
