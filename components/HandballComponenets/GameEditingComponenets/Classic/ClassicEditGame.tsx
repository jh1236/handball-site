'use client';

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { IconButton } from '@storybook/core/components';
import { IconBallVolleyball, IconShoppingCartFilled, IconTransfer } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  ButtonProps,
  Center,
  Checkbox,
  Flex,
  Grid,
  Image,
  LoadingOverlay,
  Modal,
  Popover,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { VerticalSlider } from '@/components/basic/VerticalSlider';
import { PlacePlayersGameStart } from '@/components/HandballComponenets/GameEditingComponenets/Classic/PlacePlayers';
import { useEditGameActions } from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { GAME_CONFIG } from '@/components/HandballComponenets/GameEditingComponenets/GameEditingConfig';
import { GameActionList } from '@/components/HandballComponenets/GameEditingComponenets/GameScore/GameActionList';
import { playerCanReceiveCard } from '@/components/HandballComponenets/GameEditingComponenets/PlayerButton/PlayerActionList';
import SelectCourtLocation from '@/components/HandballComponenets/GameEditingComponenets/SelectCourtLocation';
import { GameState, TeamState, useGameState } from '@/components/HandballComponenets/GameState';
import { useUserData } from '@/components/hooks/userData';
import { useScreenVertical } from '@/components/hooks/useScreenVertical';
import { getGame } from '@/ServerActions/GameActions';
import { GameStructure, PlayerGameStatsStructure } from '@/ServerActions/types';

interface ClassicEditGameParams {
  game: number;
}
function PlayersPopover({
  teamOne,
  onClick,
  buttonProps,
  buttonText,
  gameState,
  setFirstTeam,
  setPlayerLeft,
}: {
  teamOne: boolean;
  onClick: (pgs: PlayerGameStatsStructure) => void;
  buttonProps?: ButtonProps;
  gameState: GameState;
  buttonText?: string;
  setFirstTeam: (teamOne: boolean) => void;
  setPlayerLeft: (teamOne: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const team = teamOne ? gameState.teamOne : gameState.teamTwo;
  if (!team.left.get || !team.right.get) {
    return (
      <Button
        size="compact-md"
        w={160}
        mih={50}
        {...buttonProps}
        onClick={() => {
          onClick((team.left.get || team.right.get)!);
        }}
      >
        <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
          {buttonText} for {team.name.get}
        </Text>
      </Button>
    );
  }
  return (
    <Popover opened={open} onChange={setOpen}>
      <Popover.Target>
        <Button
          size="compact-md"
          w={160}
          mih={50}
          {...buttonProps}
          onClick={(e) => {
            setOpen(true);
            e.stopPropagation();
          }}
        >
          <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
            {buttonText} for {team.name.get}
          </Text>
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          {!!team.left.get && (
            <Button
              size="compact-compact-md"
              onClick={() => {
                setFirstTeam(teamOne);
                setPlayerLeft(true);
                onClick(team.left.get!);
                setOpen(false);
              }}
            >
              <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>{team.left.get.name}</Text>
            </Button>
          )}
          {!!team.right.get && (
            <Button
              size="compact-compact-md"
              onClick={() => {
                setFirstTeam(teamOne);
                setPlayerLeft(false);
                onClick(team.right.get!);
                setOpen(false);
              }}
            >
              <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>{team.right.get.name}</Text>
            </Button>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

function getPlayerFromGame(gameState: GameState, firstTeam: boolean, leftPlayer: boolean) {
  const team = firstTeam ? gameState.teamOne : gameState.teamTwo;
  return leftPlayer ? team.left : team.right;
}

function getPlayerFromPositionRespectingCards(
  gameState: GameState,
  firstTeam: boolean,
  leftPlayer: boolean
) {
  const team = firstTeam ? gameState.teamOne : gameState.teamTwo;
  if (team.right.get === undefined) {
    return team.left.get;
  }
  if (team.left.get === undefined) {
    return team.right.get;
  }
  if (gameState.ended.get) {
    return leftPlayer ? team.left.get : team.right.get;
  }
  const cardedTeammates = [team.left.get, team.right.get].filter((a) => a?.cardTimeRemaining !== 0);
  const uncardedTeammates = [team.left.get, team.right.get].filter(
    (a) => a?.cardTimeRemaining === 0
  );
  if (cardedTeammates.length !== 0) {
    if (gameState.servingFromLeft === leftPlayer) {
      return uncardedTeammates[0];
    }
    return cardedTeammates[0];
  }
  return leftPlayer ? team.left.get : team.right.get;
}

function isPlayerServing(gameState: GameState, firstTeam: boolean, leftPlayer: boolean) {
  const team = firstTeam ? gameState.teamOne : gameState.teamTwo;
  return (
    gameState.started.get &&
    !gameState.ended.get &&
    (gameState.servingFromLeft === leftPlayer || !team.left.get || !team.right.get) &&
    gameState.firstTeamServes.get === firstTeam
  );
}

function cardTimeForTeam(team: TeamState): number {
  return [team.left.get, team.right.get, team.sub.get]
    .filter((a) => typeof a !== 'undefined')
    .reduce(
      (col, v) => (col === -1 ? col : v.cardTime === -1 ? v.cardTime : Math.max(v.cardTime, col)),
      0
    );
}

function cardTimeRemainingForTeam(team: TeamState): number {
  return [team.left.get, team.right.get, team.sub.get]
    .filter((a) => typeof a !== 'undefined')
    .reduce(
      (col, v) =>
        col === -1
          ? col
          : v.cardTimeRemaining === -1
            ? v.cardTimeRemaining
            : Math.max(v.cardTimeRemaining, col),
      0
    );
}

type CardColor = 'warning' | 'green' | 'yellow' | 'red';

export function ClassicEditGame({ game: gameID }: ClassicEditGameParams) {
  const { isOfficial } = useUserData();
  const [swapped, setSwapped] = useState(false);
  const [gameObj, setGameObj] = React.useState<GameStructure | null>(null);
  const { gameState, setGameForState } = useGameState(gameObj || undefined);
  const teamOne = useMemo(
    () => (!swapped ? gameState.teamOne : gameState.teamTwo),
    [gameState.teamOne, gameState.teamTwo, swapped]
  );
  const teamTwo = useMemo(
    () => (!swapped ? gameState.teamTwo : gameState.teamOne),
    [gameState.teamOne, gameState.teamTwo, swapped]
  );
  const [firstTeam, setFirstTeam] = useState(false);
  const [location, setLocation] = React.useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(false);
  const [faultOpen, setFaultOpen] = useState<boolean>(false);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [cardColor, setCardColor] = useState<string | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [scoreModalStage, setScoreModalStage] = useState(0);
  const [visibleTimeout, { open: openTimeout, close: closeTimeout }] = useDisclosure(false);
  const [currentTime, setCurrentTime] = React.useState<number>(300);
  const [cardTime, setCardTime] = useState<number>(gameState!.blitzGame.get ? 3 : 6);
  const edit = useEditGameActions(gameState);
  const isVertical = useScreenVertical();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getGame({ gameID }).then((gameIn) => {
      setGameObj(gameIn ?? null);
      setGameForState(gameIn ?? null);
    });
    // if you give this the deps it wants, it DDOS's the server
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameID]);

  useEffect(() => {
    if (!gameObj) return;
    setGameForState(gameObj);
    //disabled as including setGameForState will cause an infinite reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameObj]);

  useEffect(() => {
    if (gameState.timeoutExpirationTime.get > 0) {
      openTimeout();
    } else {
      closeTimeout();
    }
  }, [closeTimeout, openTimeout, gameState.timeoutExpirationTime.get]);
  if (!loading && !isOfficial(gameObj?.tournament.searchableName)) return <></>;

  const teamOneCardTime = cardTimeForTeam(teamOne);
  const teamOneCardTimeRemaining = cardTimeRemainingForTeam(teamOne);
  const teamTwoCardTime = cardTimeForTeam(teamTwo);
  const teamTwoCardTimeRemaining = cardTimeRemainingForTeam(teamTwo);
  if (!gameState.started.get) {
    return (
      <Box w="97vw" h="98lvh" m="auto" maw={800} pt={10}>
        <Grid>
          <Grid.Col ta="center" span={5}>
            <Title order={2}>{teamOne.name.get}</Title>
          </Grid.Col>
          <Grid.Col ta="center" span={2}>
            <Title order={2}>vs</Title>
          </Grid.Col>
          <Grid.Col ta="center" span={5}>
            <Title order={2}>{teamTwo.name.get}</Title>
          </Grid.Col>
          <Grid.Col ta="center" span={5}>
            <Image
              maw={250}
              m="auto"
              w="80%"
              src={swapped ? gameObj?.teamTwo.imageUrl : gameObj?.teamOne.imageUrl}
            ></Image>
          </Grid.Col>
          <Grid.Col ta="center" span={2}>
            <Center h="100%">
              <ActionIcon variant="outline" onClick={() => setSwapped(!swapped)}>
                <IconTransfer></IconTransfer>
              </ActionIcon>
            </Center>
          </Grid.Col>
          <Grid.Col ta="center" span={5}>
            <Image
              maw={250}
              m="auto"
              w="80%"
              src={swapped ? gameObj?.teamOne.imageUrl : gameObj?.teamTwo.imageUrl}
            ></Image>
          </Grid.Col>
          <Grid.Col ta="center" span={6}>
            <Center>
              <Checkbox
                size="md"
                icon={IconBallVolleyball as any}
                checked={gameState.firstTeamServes.get !== swapped}
                label={`Are ${teamOne.name.get} Serving?`}
                onChange={() => gameState.firstTeamServes.set(!gameState.firstTeamServes.get)}
              ></Checkbox>
            </Center>
          </Grid.Col>
          <Grid.Col ta="center" span={6}>
            <Center>
              <Checkbox
                size="md"
                icon={IconBallVolleyball as any}
                checked={gameState.firstTeamServes.get === swapped}
                label={`Are ${teamTwo.name.get} Serving?`}
                onChange={() => gameState.firstTeamServes.set(!gameState.firstTeamServes.get)}
              ></Checkbox>
            </Center>
          </Grid.Col>
          <Grid.Col ta="center" span={6}>
            <Center>
              <Checkbox
                size="md"
                //Im not sure why but It doesn't like this logo
                icon={IconShoppingCartFilled as any}
                checked={gameState.teamOneIGA.get !== swapped}
                label={`Are ${teamOne.name.get} On IGA Side?`}
                onChange={() => gameState.teamOneIGA.set(!gameState.teamOneIGA.get)}
              ></Checkbox>
            </Center>
          </Grid.Col>
          <Grid.Col ta="center" span={6}>
            <Center>
              <Checkbox
                size="md"
                //Im not sure why but It doesn't like this logo
                icon={IconShoppingCartFilled as any}
                checked={gameState.teamOneIGA.get === swapped}
                label={`Are ${teamTwo.name.get} On IGA Side?`}
                onChange={() => gameState.teamOneIGA.set(!gameState.teamOneIGA.get)}
              ></Checkbox>
            </Center>
          </Grid.Col>
          <Grid.Col ta="center" span={6}>
            {teamOne.left.get && teamOne.right.get && (
              <PlacePlayersGameStart team={teamOne}></PlacePlayersGameStart>
            )}
          </Grid.Col>
          <Grid.Col ta="center" span={6}>
            {teamTwo.left.get && teamTwo.right.get && (
              <PlacePlayersGameStart team={teamTwo}></PlacePlayersGameStart>
            )}
          </Grid.Col>
          <Grid.Col ta="center" span={12}>
            <Button onClick={() => edit.begin()}>Start</Button>
          </Grid.Col>
        </Grid>
      </Box>
    );
  }
  if (gameState.ended.get) {
    return (
      <Box w="97vw" h="98lvh" m="auto" maw={800} pt={10}>
        <Grid>
          <Grid.Col ta="center" span={5}>
            <Title order={2}>{teamOne.name.get}</Title>
          </Grid.Col>
          <Grid.Col ta="center" span={2}>
            <Title order={2}>vs</Title>
          </Grid.Col>
          <Grid.Col ta="center" span={5}>
            <Title order={2}>{teamTwo.name.get}</Title>
          </Grid.Col>
          <Grid.Col ta="center" span={5}>
            <Image
              maw={250}
              m="auto"
              w="80%"
              src={swapped ? gameObj?.teamTwo.imageUrl : gameObj?.teamOne.imageUrl}
            ></Image>
          </Grid.Col>
          <Grid.Col ta="center" span={2}>
            <Center h="100%">
              <ActionIcon variant="outline" onClick={() => setSwapped(!swapped)}>
                <IconTransfer></IconTransfer>
              </ActionIcon>
            </Center>
          </Grid.Col>
          <Grid.Col ta="center" span={5}>
            <Image
              maw={250}
              m="auto"
              w="80%"
              src={swapped ? gameObj?.teamOne.imageUrl : gameObj?.teamTwo.imageUrl}
            ></Image>
          </Grid.Col>
        </Grid>
        <Box p={20}>
          <GameActionList
            game={gameState}
            setIndex={setEndIndex}
            index={endIndex}
            close={edit.undo}
          />
        </Box>
      </Box>
    );
  }
  const timeoutKids = (
    <>
      <Title
        style={{ color: gameState.timeoutExpirationTime.get > currentTime ? '' : 'red' }}
        order={2}
      >
        {(Math.floor((gameState.timeoutExpirationTime.get - currentTime) / 100) / 10).toFixed(1)}{' '}
        Seconds
      </Title>
      <br />
      <br />
      <Button size="lg" onClick={() => edit.endTimeout()}>
        End Timeout
      </Button>
    </>
  );
  const colorOfCard = (cardColor ?? 'Warning').toLowerCase().replace(' card', '') as CardColor;
  return (
    <Box w="97vw" h="98lvh" m="auto" maw={800} pt={10}>
      <LoadingOverlay visible={visibleTimeout} loaderProps={{ children: timeoutKids }} />
      <LoadingOverlay
        visible={loading}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'pink', type: 'bars' }}
      />
      <Modal
        opened={scoreModalStage > 0}
        onClose={() => setScoreModalStage(0)}
        title={<Title>Score</Title>}
      >
        {scoreModalStage === 1 && (
          <Flex direction="row" justify="space-around" w="100%">
            <Flex direction="column">
              <Text m={5} fw={600} ta="center">
                Common Methods
              </Text>
              {GAME_CONFIG.scoreMethods.slice(0, 3).map((method, i) => (
                <Fragment key={i}>
                  <Button
                    miw={160}
                    m={isVertical ? 3 : 5}
                    color="player-color"
                    size="sm"
                    onClick={() => {
                      setReason(method);
                      setScoreModalStage((s) => s + 1);
                    }}
                  >
                    {method}
                  </Button>
                  <br />
                </Fragment>
              ))}
              <Button
                miw={160}
                m={isVertical ? 3 : 5}
                color="player-color"
                size="sm"
                disabled={
                  gameState.servingFromLeft !== playerLeft ||
                  gameState.firstTeamServes.get !== firstTeam
                }
                onClick={() => {
                  setReason('ace');
                  setScoreModalStage((s) => s + 1);
                }}
              >
                <i>Ace</i>
              </Button>
            </Flex>
            <Flex direction="column">
              <Text m={5} fw={600} ta="center">
                Alternative Methods
              </Text>
              {GAME_CONFIG.scoreMethods.slice(3).map((method, i) => (
                <Fragment key={i}>
                  <Button
                    miw={160}
                    m={isVertical ? 3 : 5}
                    size="sm"
                    color="player-color"
                    onClick={() => {
                      setReason(method);
                      setScoreModalStage((s) => s + 1);
                    }}
                  >
                    {method}
                  </Button>
                </Fragment>
              ))}
            </Flex>
          </Flex>
        )}
        {scoreModalStage === 2 && (
          <>
            <Stack>
              <Center>
                <SelectCourtLocation
                  location={location}
                  setLocation={setLocation}
                  isAce={reason === 'ace'}
                  leftSide={playerLeft}
                ></SelectCourtLocation>
              </Center>
              <br />
              <Button
                onClick={() => {
                  if (reason === 'ace') {
                    edit.ace(location);
                  } else {
                    edit.score(firstTeam, playerLeft, reason, location);
                  }
                  setScoreModalStage(0);
                }}
                disabled={!location.length}
              >
                Submit
              </Button>
            </Stack>
          </>
        )}
      </Modal>
      <Modal
        opened={cardColor !== undefined}
        onClose={() => setCardColor(undefined)}
        title={<Title>{cardColor}</Title>}
      >
        <Flex flex="space-between" w="100%" align="center">
          <Stack flex={1}>
            {GAME_CONFIG.cards[colorOfCard].map((cardReason, i) => (
              <Button
                key={i}
                ml="auto"
                mr="auto"
                w={160}
                h={40}
                mb={0}
                mt={0}
                size="xs"
                disabled={
                  !gameState.practice.get &&
                  !playerCanReceiveCard(
                    getPlayerFromGame(gameState, firstTeam, playerLeft).get!,
                    cardReason,
                    cardColor!
                  )
                }
                color={colorOfCard === 'warning' ? 'gray' : colorOfCard}
                onClick={() => {
                  if (colorOfCard === 'warning') {
                    edit.warning(firstTeam, playerLeft, cardReason);
                  } else if (colorOfCard === 'green') {
                    edit.greenCard(firstTeam, playerLeft, cardReason);
                  } else if (colorOfCard === 'yellow') {
                    edit.yellowCard(firstTeam, playerLeft, cardReason, cardTime);
                  } else if (colorOfCard === 'red') {
                    edit.redCard(firstTeam, playerLeft, cardReason);
                  }
                  setCardColor(undefined);
                }}
              >
                {cardReason}
              </Button>
            ))}
          </Stack>

          {cardColor === 'Yellow Card' && (
            <Stack m="auto">
              <VerticalSlider
                minValue={gameState.blitzGame.get ? 3 : 6}
                maxValue={gameState.blitzGame.get ? 9 : 12}
                value={cardTime}
                setValue={setCardTime}
              />

              <Text ta="center" mt="xs">
                <b>Card Time:</b> {cardTime} Rounds
              </Text>
            </Stack>
          )}
        </Flex>
      </Modal>
      <Modal opened={faultOpen} onClose={() => setFaultOpen(false)} title={<Title>Fault</Title>}>
        <Flex direction="column">
          <Flex direction="row" justify="space-around" w="100%">
            <Flex direction="column">
              <Text m={5} fw={600} ta="center">
                Common Methods
              </Text>
              {GAME_CONFIG.faultMethods.slice(0, 4).map((method, i) => (
                <Fragment key={i}>
                  <Button
                    miw={160}
                    m={isVertical ? 3 : 5}
                    color="player-color"
                    size="sm"
                    onClick={() => {
                      edit.fault(method);
                      setFaultOpen(false);
                    }}
                  >
                    {method}
                  </Button>
                  <br />
                </Fragment>
              ))}
            </Flex>
            <Flex direction="column">
              <Text m={5} fw={600} ta="center">
                Alternative Methods
              </Text>
              {GAME_CONFIG.faultMethods.slice(4).map((method, i) => (
                <Fragment key={i}>
                  <Button
                    miw={160}
                    m={isVertical ? 3 : 5}
                    size="sm"
                    color="player-color"
                    onClick={() => {
                      edit.fault(method);
                      setFaultOpen(false);
                    }}
                  >
                    {method}
                  </Button>
                </Fragment>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Modal>
      <Grid w="100%">
        <Grid.Col ta="center" span={5}>
          <Title order={2}>{teamOne.name.get}</Title>
        </Grid.Col>
        <Grid.Col ta="center" span={2}>
          <Title order={2}>vs</Title>
        </Grid.Col>
        <Grid.Col ta="center" span={5}>
          <Title order={2}>{teamTwo.name.get}</Title>
        </Grid.Col>

        <Grid.Col ta="center" span={5}>
          <Image
            maw={250}
            m="auto"
            w="80%"
            src={swapped ? gameObj?.teamTwo.imageUrl : gameObj?.teamOne.imageUrl}
          ></Image>
        </Grid.Col>
        <Grid.Col ta="center" span={2}>
          <Center h="100%">
            <ActionIcon variant="outline" onClick={() => setSwapped(!swapped)}>
              <IconTransfer></IconTransfer>
            </ActionIcon>
          </Center>
        </Grid.Col>
        <Grid.Col ta="center" span={5}>
          <Image
            maw={250}
            m="auto"
            w="80%"
            src={swapped ? gameObj?.teamOne.imageUrl : gameObj?.teamTwo.imageUrl}
          ></Image>
        </Grid.Col>
        <Grid.Col ta="center" span={6} pl={20} pr={20}>
          {teamOneCardTimeRemaining !== 0 && !gameState.ended.get && (
            <Progress
              radius={5}
              h={20}
              color={teamOneCardTime < 0 ? 'red' : teamOneCardTime > 2 ? 'yellow' : 'green'}
              value={
                100 *
                (teamOneCardTimeRemaining >= 0 ? teamOneCardTimeRemaining / teamOneCardTime : 1)
              }
            ></Progress>
          )}
        </Grid.Col>
        <Grid.Col ta="center" span={6} pl={20} pr={20}>
          {teamTwoCardTimeRemaining !== 0 && !gameState.ended.get && (
            <Progress
              radius={5}
              h={20}
              color={teamTwoCardTime < 0 ? 'red' : teamTwoCardTime > 2 ? 'yellow' : 'green'}
              value={
                100 *
                (teamTwoCardTimeRemaining >= 0 ? teamTwoCardTimeRemaining / teamTwoCardTime : 1)
              }
            ></Progress>
          )}
        </Grid.Col>
        <Grid.Col ta="center" span={5}>
          {teamOne.left.get && (
            <Text fs="italic" fw={isPlayerServing(gameState, !swapped, true) ? 700 : undefined}>
              {getPlayerFromPositionRespectingCards(gameState, !swapped, true)?.name} [L]{' '}
              {isPlayerServing(gameState, !swapped, true) && gameState.faulted.get && '*'}
            </Text>
          )}
          {teamOne.right.get && (
            <Text fs="italic" fw={isPlayerServing(gameState, !swapped, false) ? 700 : undefined}>
              {getPlayerFromPositionRespectingCards(gameState, !swapped, false)?.name} [R]{' '}
              {isPlayerServing(gameState, !swapped, false) && gameState.faulted.get && '*'}
            </Text>
          )}
        </Grid.Col>
        <Grid.Col ta="center" span={2}>
          <Title order={1}>
            {teamOne.score.get}-{teamTwo.score.get}
          </Title>
        </Grid.Col>
        <Grid.Col ta="center" span={5}>
          {teamTwo.left.get && (
            <Text fs="italic" fw={isPlayerServing(gameState, swapped, true) ? 700 : undefined}>
              {getPlayerFromPositionRespectingCards(gameState, swapped, true)?.name} [L]{' '}
              {isPlayerServing(gameState, swapped, true) && gameState.faulted.get && '*'}
            </Text>
          )}
          {teamTwo.right.get && (
            <Text fs="italic" fw={isPlayerServing(gameState, swapped, false) ? 700 : undefined}>
              {getPlayerFromPositionRespectingCards(gameState, swapped, false)?.name} [R]{' '}
              {isPlayerServing(gameState, swapped, false) && gameState.faulted.get && '*'}
            </Text>
          )}
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            teamOne={!swapped}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setScoreModalStage(1)}
            buttonText="Score"
          ></PlayersPopover>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            teamOne={swapped}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setScoreModalStage(1)}
            buttonText="Score"
          ></PlayersPopover>
        </Grid.Col>
        <Grid.Col ta="center" span={6} mt={25}>
          <Button
            size="compact-md"
            w={160}
            mih={50}
            onClick={() => edit.timeout(!swapped)}
            disabled={!!teamOne.timeouts.get}
          >
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Timeout for {teamOne.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6} mt={25}>
          <Button
            size="compact-md"
            w={160}
            mih={50}
            onClick={() => edit.timeout(swapped)}
            disabled={!!teamTwo.timeouts.get}
          >
            <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>
              Timeout for {teamTwo.name.get}
            </Text>
          </Button>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            teamOne={!swapped}
            buttonProps={{ color: 'gray' }}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setCardColor('Warning')}
            buttonText="Warning"
          ></PlayersPopover>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            buttonProps={{ color: 'gray' }}
            teamOne={swapped}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setCardColor('Warning')}
            buttonText="Warning"
          ></PlayersPopover>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            teamOne={!swapped}
            buttonProps={{ color: 'green' }}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setCardColor('Green Card')}
            buttonText="Green Card"
          ></PlayersPopover>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            teamOne={swapped}
            buttonProps={{ color: 'green' }}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setCardColor('Green Card')}
            buttonText="Green Card"
          ></PlayersPopover>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            teamOne={!swapped}
            buttonProps={{ color: 'yellow' }}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setCardColor('Yellow Card')}
            buttonText="Yellow Card"
          ></PlayersPopover>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            teamOne={swapped}
            buttonProps={{ color: 'yellow' }}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setCardColor('Yellow Card')}
            buttonText="Yellow Card"
          ></PlayersPopover>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            teamOne={!swapped}
            buttonProps={{ color: 'red' }}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setCardColor('Red Card')}
            buttonText="Red Card"
          ></PlayersPopover>
        </Grid.Col>
        <Grid.Col ta="center" span={6}>
          <PlayersPopover
            teamOne={swapped}
            buttonProps={{ color: 'red' }}
            setPlayerLeft={setPlayerLeft}
            setFirstTeam={setFirstTeam}
            gameState={gameState}
            onClick={() => setCardColor('Red Card')}
            buttonText="Red Card"
          ></PlayersPopover>
        </Grid.Col>
      </Grid>

      <Flex direction="row" justify="space-around" w="70%" m="auto" mt={20}>
        <Popover>
          <Popover.Target>
            <Button size="compact-md" w={100} mih={50} color="red">
              <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>Abandon</Text>
            </Button>
          </Popover.Target>
          <Popover.Dropdown maw={200} ta="center">
            <b>Are you sure you wish to abandon the game?</b>
            <br />
            <br />
            <Button onClick={() => edit.abandon()}>Yes</Button>
          </Popover.Dropdown>
        </Popover>

        <Popover>
          <Popover.Target>
            <Button size="compact-md" w={100} mih={50} color="red">
              <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>Forfeit</Text>
            </Button>
          </Popover.Target>
          <Popover.Dropdown maw={400} ta="center">
            <b>Which team is Forfeiting?</b>
            <br />
            <br />
            <Button color="red" onClick={() => edit.forfeit(!swapped)} mr={10}>
              {teamOne.name.get}
            </Button>
            <Button color="red" onClick={() => edit.forfeit(swapped)} ml={10}>
              {teamTwo.name.get}
            </Button>
          </Popover.Dropdown>
        </Popover>
      </Flex>
      <Flex direction="row" justify="space-around" w="70%" m="auto" mt={20}>
        <Button size="compact-md" w={100} mih={50} color="blue" onClick={() => setFaultOpen(true)}>
          <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>Fault</Text>
        </Button>

        <Button
          size="compact-md"
          w={100}
          mih={50}
          color="blue"
          onClick={() => {
            setLoading(true);
            edit.sync().then(() => setLoading(false));
          }}
        >
          <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>Sync</Text>
        </Button>
        <Button
          size="compact-md"
          w={100}
          mih={50}
          color="#000044"
          onClick={() => {
            setLoading(true);
            edit.undo().then(() => setLoading(false));
          }}
        >
          <Text style={{ overflow: 'wrap', textWrap: 'wrap' }}>Undo</Text>
        </Button>
      </Flex>
    </Box>
  );
}
