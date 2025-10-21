import React from 'react';
import Link from 'next/link';
import { Box, Image } from '@mantine/core';
import classes from '@/components/HandballComponenets/GamePageComponents/gamesStyles.module.css';
import { GameStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

interface ScoreGraphicParams {
  game: GameStructure;
}

interface PlayerNameParams {
  player: PlayerGameStatsStructure;
  game: GameStructure;
}

function PlayerName({ player, game }: PlayerNameParams) {
  if (player === undefined) {
    return <p>ERROR!</p>;
  }
  const eloDelta = player.stats['Elo Delta'] as number;
  if (eloDelta === null) {
    return <p> {player.name} </p>;
  }
  let color;
  let prefix;
  if (eloDelta < 0) {
    color = 'red';
    prefix = '';
  } else if (eloDelta > 0) {
    color = 'green';
    prefix = '+';
  } else {
    color = 'lightgray';
    prefix = '±';
  }
  return (
    <Link
      href={`/${game.tournament.searchableName}/players/${player.searchableName}`}
      className="hideLink"
    >
      <p>
        {player.name}
        {'  '}
        <span style={{ color }}>
          {prefix}
          {eloDelta.toFixed(2)}
        </span>
      </p>
    </Link>
  );
}

export function ScoreGraphic({ game }: ScoreGraphicParams): any {
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
      <Box className={`${classes.teamNames} ${classes.team1Name}`}>
        <Link
          href={`/${game.tournament.searchableName}/teams/${game.teamOne.searchableName}`}
          className="hideLink"
        >
          <p>{game.teamOne.name}</p>
        </Link>
      </Box>
      <Box className={`${classes.dash} ${classes.verse}`}>VS</Box>
      <Box className={`${classes.teamNames} ${classes.team2Name}`}>
        <Link
          href={`/${game.tournament.searchableName}/teams/${game.teamTwo.searchableName}`}
          className="hideLink"
        >
          {game.teamTwo.name}
        </Link>
      </Box>
      <Box className={`${classes.teamLogos} ${classes.logo1}`} style={{ justifyItems: 'flex-end' }}>
        <Link
          href={`/${game.tournament.searchableName}/teams/${game.teamOne.searchableName}`}
          className="hideLink"
        >
          <Image src={game.teamOne.imageUrl} />
        </Link>
      </Box>
      <Box className={`${classes.teamInfo} ${classes.info1}`}>
        {game.teamOne.captain ? <PlayerName game={game} player={game.teamOne.captain} /> : ''}
        {game.teamOne.nonCaptain ? <PlayerName game={game} player={game.teamOne.nonCaptain} /> : ''}
        {game.teamOne.substitute ? <PlayerName game={game} player={game.teamOne.substitute} /> : ''}
      </Box>
      <Box className={`${classes.teamScores} ${classes.score1}`}>{game.teamOneScore}</Box>
      <Box className={`${classes.dash}`}>-</Box>
      <Box className={`${classes.teamScores} ${classes.score2}`}>{game.teamTwoScore}</Box>
      <Box className={`${classes.teamInfo} ${classes.info2}`}>
        {game.teamTwo.captain ? <PlayerName game={game} player={game.teamTwo.captain} /> : ''}
        {game.teamTwo.nonCaptain ? <PlayerName game={game} player={game.teamTwo.nonCaptain} /> : ''}
        {game.teamTwo.substitute ? <PlayerName game={game} player={game.teamTwo.substitute} /> : ''}
      </Box>
      <Box className={`${classes.teamLogos} ${classes.logo2}`}>
        <Link
          href={`/${game.tournament.searchableName}/teams/${game.teamTwo.searchableName}`}
          className="hideLink"
        >
          <Image src={game.teamTwo.imageUrl} />
        </Link>
      </Box>
      <Box className={`${classes.gameOfficial}`}>
        <Link
          href={
            game.official
              ? `/${game.tournament.searchableName}/officials/${game.official.searchableName}`
              : '#'
          }
          className="hideLink"
        >
          <p>Officiated by {game.official?.name ?? 'No Official'}</p>
        </Link>
      </Box>
    </Box>
  );
}
