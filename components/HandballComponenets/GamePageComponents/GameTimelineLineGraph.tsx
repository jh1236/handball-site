import React, { ReactElement, useMemo } from 'react';
import {
  IconCards,
  IconCircleFilled,
  IconSquareFilled,
  IconTriangleInverted,
} from '@tabler/icons-react';
import { Dot, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ActionIcon, Box, Paper, useMantineColorScheme } from '@mantine/core';
import { eventIcon } from '@/components/HandballComponenets/AdminGamePanel';
import { GameEventStructure, GameStructure } from '@/ServerActions/types';

interface GameTimelineLineGraphInterface {
  game: GameStructure;
}

type CustomDotArgs = {
  payload: {
    id: number;
    team1Score: number;
    team2Score: number;
    event: GameEventStructure;
  };
  [key: string]: any;
};

export function GameTimelineLineGraph({ game }: GameTimelineLineGraphInterface) {
  const isTimed = !!game?.events![0]?.time;
  const scheme = useMantineColorScheme();
  const [showCards, setShowCards] = React.useState<boolean>(true);
  const shownEvents = useMemo(() => {
    let out = ['Start', 'Score'];
    if (showCards) {
      out = out.concat(['Red Card', 'Yellow Card', 'Green Card']);
    }
    return out;
  }, [showCards]);
  function smallScreen() {
    return window.innerWidth < 800;
  }
  const CustomDot = (props: CustomDotArgs): ReactElement => {
    const { cx, cy, stroke, payload, fill, r, strokeWidth, dataKey } = props;
    const eventMatchesLine: boolean =
      (payload.event.firstTeam && dataKey === 'team1Score') ||
      (!payload.event.firstTeam && dataKey === 'team2Score');
    const size = smallScreen() ? 25 : 30;
    const iconProps = {
      x: cx - size / 2,
      y: cy - size / 2,
      size,
      key: `${cx}${cy}${payload.id}`,
    };
    if (eventMatchesLine) {
      if (payload.event.eventType === 'Score') {
        const icon = eventIcon(payload.event, {
          x: iconProps.x,
          y: iconProps.y,
          width: iconProps.size,
          height: iconProps.size,
          key: `${cx}${cy}${payload.id}`,
          color: payload.event.firstTeam ? game.teamOne.teamColor : game.teamTwo.teamColor,
          fill: scheme.colorScheme === 'dark' ? '#ddd' : '#fff',
          strokeWidth: 2,
        });
        return (
          icon ?? (
            <Dot
              cx={cx}
              cy={cy}
              r={r}
              stroke={stroke}
              fill={fill}
              strokeWidth={strokeWidth}
              key={`${cx}${cy}${payload.id}`}
            ></Dot>
          )
        );
      }
      if (payload.event.eventType === 'Yellow Card') {
        return (
          <IconSquareFilled
            x={iconProps.x}
            y={iconProps.y}
            width={iconProps.size}
            height={iconProps.size}
            key={iconProps.key}
            fill="yellow"
          />
        );
      }
      if (payload.event.eventType === 'Green Card') {
        return (
          <IconTriangleInverted
            x={iconProps.x}
            y={iconProps.y}
            width={iconProps.size}
            height={iconProps.size}
            key={iconProps.key}
            fill="green"
          />
        );
      }
      if (payload.event.eventType === 'Red Card') {
        return (
          <IconCircleFilled
            x={iconProps.x}
            y={iconProps.y}
            width={iconProps.size}
            height={iconProps.size}
            key={iconProps.key}
            fill="red"
          />
        );
      }
    }
    return <></>;
  };

  function customTooltip(props: any): ReactElement {
    const { payload }: { [key: string]: any } = props;
    const event: GameEventStructure | undefined =
      payload[0]?.payload.event || payload[1]?.payload.event;
    if (!event) {
      return <></>;
    }
    if (['Green Card', 'Yellow Card', 'Red Card'].includes(event.eventType)) {
      return (
        <Paper bg="#fff" w={200} shadow="md" style={{ padding: '5px' }}>
          {event.eventType} given to {event.player.name} for {event.notes}
        </Paper>
      );
    }
    return (
      <Paper
        bg={scheme.colorScheme === 'dark' ? '#333' : 'fff'}
        w={200}
        shadow="md"
        style={{ padding: '5px' }}
      >
        Point given to {event.player?.name} {event.notes ? `for ${event.notes}` : ''}
      </Paper>
    );
  }

  if (!game) {
    return <></>;
  }
  const data: {
    id: number;
    team1Score: number;
    team2Score: number;
    event: GameEventStructure;
  }[] = [];
  let team1Score: number = 0;
  let team2Score: number = 0;
  let count = 0;
  game.events!.forEach((e) => {
    if (e.eventType === 'Score') {
      if (e.firstTeam) {
        team1Score += 1;
      } else {
        team2Score += 1;
      }
    }
    if (shownEvents.includes(e.eventType)) {
      const id = isTimed ? e.time - game.startTime : count++;
      data.push({ id, team1Score, team2Score, event: e });
    }
  });

  const gameTime = data.length ? data[data.length - 1].event.time - game.startTime : 0;
  const tickSize = 30;
  let tickData: number[] = [];
  if (isTimed) {
    tickData = Array.from(Array(Math.ceil(gameTime / tickSize) + 1).keys()).map(
      (i) => i * tickSize
    );
    if (gameTime % tickSize !== 0) {
      tickData.push(gameTime);
    }
  }

  function tickFormatter(n: number) {
    if (isTimed) {
      return `${Math.floor(n / 60)}:${n % 60 <= 9 ? `0${n % 60}` : n % 60}`;
    }
    return '';
  }

  return (
    <Paper
      bg=""
      style={{
        padding: '20px',
        margin: 'auto',
      }}
    >
      <ActionIcon
        style={{
          pos: 'relative',
          left: '0',
          visibility: game?.events!.map((e) => e.eventType).some((i) => i.endsWith('Card'))
            ? 'visible'
            : 'hidden',
        }}
        onClick={() => setShowCards(!showCards)}
        bg={showCards ? 'blue' : 'gray'}
      >
        <IconCards></IconCards>
      </ActionIcon>
      <Box h={{ base: 300, md: 600 }}>
        <ResponsiveContainer width="95%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <Line
              dataKey="team1Score"
              type="stepAfter"
              stroke={game.teamOne.teamColor ?? '#000'}
              dot={CustomDot}
              name={game.teamOne.name}
              strokeWidth={5}
            />
            <Line
              dataKey="team2Score"
              type="stepAfter"
              stroke={game.teamTwo.teamColor ?? '#000'}
              dot={CustomDot}
              name={game.teamTwo.name}
              strokeWidth={5}
            />
            <YAxis />
            <Legend />
            <Tooltip content={customTooltip} />
            <XAxis
              dataKey="id"
              type="number"
              scale="time"
              domain={[0, gameTime]}
              tickFormatter={tickFormatter}
              ticks={isTimed ? tickData : undefined}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
