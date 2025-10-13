import React, { useMemo } from 'react';
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { GameStructure } from '@/ServerActions/types';

export function GamePointsMethodGraph({ game }: { game: GameStructure }): React.ReactElement {
  const RADIAN = Math.PI / 180;

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

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#fa4d56',
    '#6929c4',
    '#009d9a',
    '#9f1853',
    '#570408',
    '#198038',
    '#a56eff',
  ];

  const pointsData = useMemo(
    () =>
      game &&
      Array.from(
        new Set(
          game.events
            ?.filter((gE) => gE.eventType === 'Score')
            .map((e) => e.notes ?? 'Not Provided')
        )
      ).map((a) => ({
        name: a,
        value: game.events
          ?.filter((gE) => gE.eventType === 'Score')
          .map((e) => e.notes ?? 'Not Provided')
          .filter((f) => f === a).length,
      })),
    [game]
  );
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={pointsData} fill="#8884d8" dataKey="value" label={renderPercentage}>
          <LabelList dataKey="name" position="outside" offset={50} fill="#888" />
          {pointsData?.map((entry, i) => <Cell key={`cell-${entry.name}`} fill={COLORS[i]} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
