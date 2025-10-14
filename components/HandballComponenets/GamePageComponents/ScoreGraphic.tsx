import React from 'react';
import { Box, Image } from '@mantine/core';
import classes from '@/components/HandballComponenets/GamePageComponents/gamesStyles.module.css';
import { GameStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

interface ScoreGraphicParams {
  game: GameStructure;
}

interface PlayerNameParams {
  player: PlayerGameStatsStructure;
}

function PlayerName({ player }: PlayerNameParams) {
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
    <p>
      {player.name}
      {'  '}
      <span style={{ color }}>
        {prefix}
        {eloDelta.toFixed(2)}
      </span>
    </p>
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
      <div className={`${classes.teamNames} ${classes.team1Name}`}>
        <p>{game.teamOne.name}</p>
      </div>
      <div className={`${classes.dash} ${classes.verse}`}>VS</div>
      <div className={`${classes.teamNames} ${classes.team2Name}`}>{game.teamTwo.name}</div>
      <div className={`${classes.teamLogos} ${classes.logo1}`} style={{ justifyItems: 'flex-end' }}>
        <Image src={game.teamOne.imageUrl} />
      </div>
      <div className={`${classes.teamInfo} ${classes.info1}`}>
        {game.teamOne.captain ? <PlayerName player={game.teamOne.captain} /> : ''}
        {game.teamOne.nonCaptain ? <PlayerName player={game.teamOne.nonCaptain} /> : ''}
        {game.teamOne.substitute ? <PlayerName player={game.teamOne.substitute} /> : ''}
      </div>
      <div className={`${classes.teamScores} ${classes.score1}`}>{game.teamOneScore}</div>
      <div className={`${classes.dash}`}>-</div>
      <div className={`${classes.teamScores} ${classes.score2}`}>{game.teamTwoScore}</div>
      <div className={`${classes.teamInfo} ${classes.info2}`}>
        {game.teamTwo.captain ? <PlayerName player={game.teamTwo.captain} /> : ''}
        {game.teamTwo.nonCaptain ? <PlayerName player={game.teamTwo.nonCaptain} /> : ''}
        {game.teamTwo.substitute ? <PlayerName player={game.teamTwo.substitute} /> : ''}
      </div>
      <div className={`${classes.teamLogos} ${classes.logo2}`}>
        <Image src={game.teamTwo.imageUrl} />
      </div>
      <div className={`${classes.gameOfficial}`}>
        <p>Officiated by {game.official?.name ?? 'No Official'}</p>
      </div>
    </Box>
  );
}
