import React, { useEffect, useMemo, useState } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import {
  IconCheckbox,
  IconCloudUpload,
  IconNote,
  IconSquare,
  IconTrophy,
} from '@tabler/icons-react';
import {
  Accordion,
  Box,
  Button,
  Center,
  Checkbox,
  List,
  Modal,
  Popover,
  Rating,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { markIfReqd } from '@/components/HandballComponenets/AdminGamePanel';
import {
  abandon,
  begin,
  end,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { OrderPlayers } from '@/components/HandballComponenets/GameEditingComponenets/OrderPlayers';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import { decidedOnCoinToss } from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { GameState } from '@/components/HandballComponenets/GameState';
import { OfficialStructure } from '@/ServerActions/types';

interface GameScoreArgs {
  game: GameState;
  official?: OfficialStructure;
  scorer?: OfficialStructure;
}

export const QUICK_GAME_END = false;

export function FakeCheckbox({ checked }: { checked: boolean }) {
  return checked ? (
    <IconCheckbox size="1.25em"></IconCheckbox>
  ) : (
    <IconSquare size="1.25em"></IconSquare>
  );
}

function getActions(
  game: GameState,
  close: () => void,
  reviewReqd: boolean,
  setReviewReqd: (value: ((prevState: boolean) => boolean) | boolean) => void,
  router: AppRouterInstance,
  bestPlayersOpened: boolean
) {
  const winningTeam =
    game.teamTwo.score.get > game.teamOne.score.get ? game.teamTwo.name : game.teamOne.name;
  return [
    {
      Icon: IconNote,
      value: 'Notes',
      title:
        !reviewReqd || game.notes.get ? (
          'Notes'
        ) : (
          <>
            <strong>Notes</strong>
            <strong style={{ color: 'red' }}>*</strong>{' '}
          </>
        ),
      color: undefined,
      content: (
        <Textarea
          value={game.notes.get}
          onChange={(v) => game.notes.set(v.currentTarget.value)}
        ></Textarea>
      ),
    },
    {
      Icon: IconCheckbox,
      value: 'Mark For Review',
      color: 'orange',
      content: (
        <Checkbox
          defaultChecked={reviewReqd}
          onChange={(e) => setReviewReqd(e.currentTarget.checked)}
          label="Mark this game as requiring action"
          description="This will notify the Umpire Manager"
        />
      ),
    },
    {
      Icon: IconTrophy,
      value: 'Rank Best Players',
      title: markIfReqd(!bestPlayersOpened && !game.practice.get, 'Rank Best Players'),
      color: undefined,
      content: <OrderPlayers game={game}></OrderPlayers>,
    },
    {
      Icon: IconCloudUpload,
      value: 'Finalise Game',
      content: (
        <>
          <List>
            <List.Item>
              <strong>Winning Team: </strong>
              {winningTeam.get}
            </List.Item>
            <List.Item>
              <strong>Best Players</strong>
              {!bestPlayersOpened && <strong style={{ color: 'red' }}>*</strong>}
              <strong>: </strong>
              {game.votes.get.map((pgs: { name: string }) => pgs.name).join(', ')}
            </List.Item>
            <List.Item>
              <strong>Review Required: </strong>
              {reviewReqd ? 'Yes' : 'No'}
            </List.Item>
            <List.Item>
              <strong>Notes</strong>
              {reviewReqd && !game.notes.get && <strong style={{ color: 'red' }}>*</strong>}
              <strong>: </strong>
              {game.notes.get.trim() === '' ? <i>Unset</i> : game.notes.get}
            </List.Item>
            <List.Item>
              <strong>Team One: </strong> {game.teamOne.name.get}
              <List>
                <List.Item>
                  <strong>Protest Reason: </strong>
                  {game.teamOne.protest.get ? game.teamOne.protest.get : <i>Unset</i>}
                </List.Item>
                <List.Item>
                  <strong>
                    {markIfReqd(!game.teamOne.rating.get && !game.practice.get, 'Rating')}{' '}
                  </strong>
                  <strong>: </strong>
                  <Rating count={4} value={game.teamOne.rating.get} readOnly></Rating>
                  {FEEDBACK_TEXTS[game.teamOne.rating.get ?? 0]}
                </List.Item>
                <List.Item>
                  <strong>{markIfReqd(game.teamOne.rating.get === 1, 'Notes')} </strong>
                  <strong>: </strong>
                  {game.teamOne.notes.get ? game.teamOne.notes.get : <i>Unset</i>}
                </List.Item>
              </List>
            </List.Item>
            <List.Item>
              <strong>Team Two: </strong> {game.teamTwo.name.get}
              <List>
                <List.Item>
                  <strong>Protest Reason: </strong>
                  {game.teamTwo.protest.get ? game.teamTwo.protest.get : <i>Unset</i>}
                </List.Item>
                <List.Item>
                  <strong>
                    {markIfReqd(!game.teamTwo.rating.get && !game.practice.get, 'Rating')}{' '}
                  </strong>
                  <strong>: </strong>
                  <Rating count={4} value={game.teamTwo.rating.get} readOnly></Rating>
                  {FEEDBACK_TEXTS[game.teamTwo.rating.get ?? 0]}
                </List.Item>
                <List.Item>
                  <strong>
                    {markIfReqd(game.teamTwo.rating.get === 1 && !game.practice.get, 'Notes')}{' '}
                  </strong>
                  <strong>: </strong>
                  {game.teamTwo.notes.get ? game.teamTwo.notes.get : <i>Unset</i>}
                </List.Item>
              </List>
            </List.Item>
          </List>
          {!decidedOnCoinToss(game) ? (
            <Button
              size="lg"
              color="red"
              disabled={
                !game.practice.get &&
                (!game.teamOne.rating.get ||
                  !game.teamTwo.rating.get ||
                  (game.teamOne.rating.get === 1 && !game.teamOne.notes.get) ||
                  (game.teamTwo.rating.get === 1 && !game.teamTwo.notes.get) ||
                  (reviewReqd && !game.notes.get) ||
                  !bestPlayersOpened)
              }
              onClick={() => {
                end(game, reviewReqd).then(() => router.push('/games/create'));
                close();
              }}
            >
              Submit
            </Button>
          ) : (
            <Popover>
              <Popover.Target>
                <Button
                  size="lg"
                  color="red"
                  disabled={
                    !game.practice.get &&
                    (!game.teamOne.rating.get ||
                      !game.teamTwo.rating.get ||
                      (game.teamOne.rating.get === 1 && !game.teamOne.notes.get) ||
                      (game.teamTwo.rating.get === 1 && !game.teamTwo.notes.get) ||
                      (reviewReqd && !game.notes.get) ||
                      !bestPlayersOpened)
                  }
                >
                  Submit
                </Button>
              </Popover.Target>
              <Popover.Dropdown ta="center">
                <Text m={5}>
                  Submitting this game will result in a{' '}
                  <b style={{ color: 'red' }}>random winner</b> being chosen. Are you sure that is
                  what you want to happen
                </Text>
                <Button
                  m={5}
                  size="lg"
                  color="red"
                  onClick={() => {
                    end(game, reviewReqd).then(() => router.push('/games/create'));
                    close();
                  }}
                >
                  I Understand
                </Button>
              </Popover.Dropdown>
            </Popover>
          )}
        </>
      ),
    },
  ];
}

export function GameScore({ game, official, scorer }: GameScoreArgs) {
  const router = useRouter();
  const [reviewReqd, setReviewReqd] = useState<boolean>(false);
  const [endGameOpen, { open: openEndGame, close: closeEndGame }] = useDisclosure(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [bestPlayersOpened, setBestPlayersOpened] = useState(false);
  useEffect(() => {
    if (game.practice.get) {
      game.teamOne.rating.set(3);
      game.teamTwo.rating.set(3);
      if (!game.started.get) {
        game.teamOneIGA.set(Math.random() > 0.5);
        game.firstTeamServes.set(Math.random() > 0.5);
      }
    }
    // there is no sane reason to have the deps that it wants.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.practice.get]);
  const items = useMemo(
    () =>
      getActions(game, closeEndGame, reviewReqd, setReviewReqd, router, bestPlayersOpened).map(
        (item, i) => (
          <Accordion.Item key={i} value={item.value}>
            <Accordion.Control icon={<item.Icon color={item.color}></item.Icon>}>
              {item.title ?? item.value}
            </Accordion.Control>
            <Accordion.Panel>{item.content}</Accordion.Panel>
          </Accordion.Item>
        )
      ),
    [closeEndGame, game]
  );

  const teamOne = game.teamOneIGA.get ? game.teamOne : game.teamTwo;
  const teamTwo = game.teamOneIGA.get ? game.teamTwo : game.teamOne;
  const matchPoints = useMemo(
    () =>
      teamOne.score.get >= 10 || teamTwo.score.get >= 10
        ? teamOne.score.get - teamTwo.score.get
        : 0,
    [teamOne.score.get, teamTwo.score.get]
  );
  return (
    <>
      <Modal opened={endGameOpen} centered onClose={closeEndGame} title="Action">
        <Title> End Game</Title>
        <Accordion
          defaultValue="Notes"
          onChange={(v) => {
            if (v === 'Rank Best Players') {
              setBestPlayersOpened(true);
            }
          }}
        >
          {items}
        </Accordion>
      </Modal>
      {game.started.get ? (
        game.ended.get ? (
          <>
            <Button color="player-color" size="lg" onClick={openEndGame}>
              End
            </Button>
          </>
        ) : (
          <>
            <Popover opened={openPopover} onChange={setOpenPopover}>
              <Popover.Target>
                <Box
                  onClick={() => {
                    if (!openPopover && matchPoints === 0) {
                      setOpenPopover(true);
                    }
                  }}
                >
                  <Title order={1}>
                    {matchPoints > 0 ? <strong>{teamOne.score.get}*</strong> : teamOne.score.get}
                  </Title>
                  <Title order={1}>-</Title>
                  <Title order={1}>
                    {matchPoints < 0 ? <strong>{teamTwo.score.get}*</strong> : teamTwo.score.get}
                  </Title>
                </Box>
              </Popover.Target>

              <Popover.Dropdown>
                {game.ended.get ? (
                  <>
                    <Center>
                      <Title>Match Point Display</Title>
                    </Center>
                    <Center>
                      <Text fw={700} fz={20}>
                        <i>
                          {Math.abs(matchPoints)} match points to{' '}
                          {matchPoints > 0 ? teamOne.name.get : teamTwo.name.get}
                        </i>
                      </Text>
                    </Center>
                  </>
                ) : (
                  <Popover width={200} position="top" withArrow shadow="md">
                    <Popover.Target>
                      <Button size="lg" color="red">
                        Abandon
                      </Button>
                    </Popover.Target>

                    <Popover.Dropdown ta="center">
                      <Text m={5}>Are you sure you want to abandon this game?</Text>
                      {Math.max(game.teamOne.score.get, game.teamTwo.score.get) < 5 && (
                        <Text>
                          <b style={{ color: 'red' }}>
                            Doing so will result in the game being decided on a coin toss!
                          </b>
                        </Text>
                      )}
                      <Button
                        m={5}
                        color="red"
                        onClick={() => {
                          abandon(game);
                          setOpenPopover(false);
                        }}
                      >
                        Confirm
                      </Button>
                    </Popover.Dropdown>
                  </Popover>
                )}
              </Popover.Dropdown>
            </Popover>
          </>
        )
      ) : (
        <Button color="player-color" size="lg" onClick={() => begin(game, official, scorer)}>
          Start
        </Button>
      )}
    </>
  );
}
