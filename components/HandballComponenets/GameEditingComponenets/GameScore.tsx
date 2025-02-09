import React, { useMemo, useState } from 'react';
import { IconCheckbox, IconCloudUpload, IconNote } from '@tabler/icons-react';
import {
  Accordion,
  Box,
  Button, Center,
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
import {
  begin,
  end,
  GameState,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

interface GameScoreArgs {
  game: GameState;
}

function getActions(
  game: GameState,
  bestPlayer: PlayerGameStatsStructure | undefined,
  close: () => void,
  reviewReqd: boolean,
  setReviewReqd: (value: ((prevState: boolean) => boolean) | boolean) => void
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
          value={reviewReqd}
          onChange={(e) => setReviewReqd(e.currentTarget.checked)}
          label="Mark this game as requiring action"
          description="This will notify the Umpire Manager"
        />
      ),
    },
    {
      Icon: IconCloudUpload,
      value: 'Finalise Game',
      color: 'white',
      content: (
        <>
          <List>
            <List.Item>
              <strong>Winning Team: </strong>
              {winningTeam}
            </List.Item>
            <List.Item>
              <strong>Best Player</strong>
              {!bestPlayer && <strong style={{ color: 'red' }}>*</strong>}
              <strong>: </strong>
              {bestPlayer?.name ?? <i>Unset</i>}
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
              <strong>Team One: </strong> {game.teamOne.name}
              <List>
                <List.Item>
                  <strong>Protest Reason: </strong>
                  {game.teamOne.protest.get ? game.teamOne.protest.get : <i>Unset</i>}
                </List.Item>
                <List.Item>
                  <strong>Rating</strong>
                  {!game.teamOne.rating.get && <strong style={{ color: 'red' }}>*</strong>}
                  <strong>: </strong>
                  <Rating value={game.teamOne.rating.get} readOnly></Rating>
                  {FEEDBACK_TEXTS[game.teamOne.rating.get ?? 0]}
                </List.Item>
                <List.Item>
                  <strong>Notes</strong>
                  {game.teamOne.rating.get === 1 && <strong style={{ color: 'red' }}>*</strong>}
                  <strong>: </strong>
                  {game.teamOne.notes.get ? game.teamOne.notes.get : <i>Unset</i>}
                </List.Item>
              </List>
            </List.Item>
            <List.Item>
              <strong>Team Two: </strong> {game.teamTwo.name}
              <List>
                <List.Item>
                  <strong>Protest Reason: </strong>
                  {game.teamTwo.protest.get ? game.teamTwo.protest.get : <i>Unset</i>}
                </List.Item>
                <List.Item>
                  <strong>Rating </strong>
                  {!game.teamTwo.rating.get && <strong style={{ color: 'red' }}>*</strong>}
                  <strong>: </strong>
                  <Rating value={game.teamTwo.rating.get} readOnly></Rating>
                  {FEEDBACK_TEXTS[game.teamTwo.rating.get ?? 0]}
                </List.Item>
                <List.Item>
                  <strong>Notes </strong>
                  {game.teamTwo.rating.get === 1 && <strong style={{ color: 'red' }}>*</strong>}
                  <strong>: </strong>
                  {game.teamTwo.notes.get ? game.teamTwo.notes.get : <i>Unset</i>}
                </List.Item>
              </List>
            </List.Item>
          </List>
          <Button
            size="lg"
            color="red"
            disabled={
              !bestPlayer ||
              !(
                game.teamOne.rating.get &&
                (game.teamOne.rating.get !== 1 || game.teamOne.notes.get)
              ) ||
              !(
                game.teamTwo.rating.get &&
                (game.teamTwo.rating.get !== 1 || game.teamTwo.notes.get)
              ) ||
              (reviewReqd && !game.notes.get)
            }
            onClick={() => {
              end(game, bestPlayer!.searchableName, reviewReqd);
              close();
            }}
          >
            Submit
          </Button>
        </>
      ),
    },
  ];
}

export function GameScore({ game }: GameScoreArgs) {
  const bestPlayer = [
    game.teamOne.left,
    game.teamOne.right,
    game.teamOne.sub,
    game.teamTwo.left,
    game.teamTwo.right,
    game.teamTwo.sub,
  ].filter((a) => a.get && a.get.isBestPlayer);
  const [reviewReqd, setReviewReqd] = useState<boolean>(false);
  const [endGameOpen, { open: openEndGame, close: closeEndGame }] = useDisclosure(false);
  const [openMatchPoints, setOpenMatchPoints] = useState(false);
  const items = useMemo(
    () =>
      getActions(game, bestPlayer[0]?.get, closeEndGame, reviewReqd, setReviewReqd).map(
        (item, i) => (
          <Accordion.Item key={i} value={item.value}>
            <Accordion.Control icon={<item.Icon color={item.color}></item.Icon>}>
              {item.title ?? item.value}
            </Accordion.Control>
            <Accordion.Panel>{item.content}</Accordion.Panel>
          </Accordion.Item>
        )
      ),
    [bestPlayer, closeEndGame, game]
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
        <Accordion defaultValue="Notes">{items}</Accordion>
      </Modal>
      {game.started.get ? (
        game.ended.get ? (
          <>
            <Button size="lg" onClick={openEndGame}>
              End
            </Button>
          </>
        ) : (
          <>
            <Popover opened={openMatchPoints} onChange={setOpenMatchPoints}>
              <Popover.Target>
                <Box onClick={() => setOpenMatchPoints(!openMatchPoints)}>
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
                <Center>
                  <Title>The Zaiah Box</Title>
                </Center>
                <Center>
                  <Text fw={700} fz={20}>
                    <i>
                      {-matchPoints} matchpoints to {matchPoints > 0 ? teamOne.name : teamTwo.name}
                    </i>
                  </Text>
                </Center>
              </Popover.Dropdown>
            </Popover>
          </>
        )
      ) : (
        <Button size="lg" onClick={() => begin(game)}>
          Start
        </Button>
      )}
    </>
  );
}
