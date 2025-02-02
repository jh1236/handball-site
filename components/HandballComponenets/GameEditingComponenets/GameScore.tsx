import React, { useMemo, useState } from 'react';
import { IconCheckbox, IconCloudUpload, IconNote, IconTrophy } from '@tabler/icons-react';
import { Accordion, Button, Checkbox, List, Modal, Textarea, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  begin,
  end,
  GameState,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
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
  if (!bestPlayer) return [];
  const winningTeam =
    game.teamTwo.score.get > game.teamOne.score.get ? game.teamTwo.name : game.teamOne.name;
  return [
    {
      Icon: IconTrophy,
      value: 'Game Statistics',
      color: 'white',
      content: (
        <>
          <List>
            <List.Item>
              <strong>Winning Team: </strong>
              {winningTeam}
            </List.Item>
            <List.Item>
              <strong>Best Player: </strong>
              {bestPlayer.name}
            </List.Item>
            <List.Item>
              <strong>Review Required: </strong>
              {reviewReqd ? 'Yes' : 'No'}
            </List.Item>
            <List.Item>
              <strong>Team One: </strong>
              <List>
                <List.Item>
                  <strong>Protest Reason: </strong>
                  {game.teamOne.protest.get ? game.teamOne.protest.get : <i>None</i>}
                </List.Item>
                <List.Item>
                  <strong>Notes: </strong>
                  {game.teamOne.notes.get ? game.teamOne.notes.get : <i>None</i>}
                </List.Item>
              </List>
            </List.Item>
            <List.Item>
              <strong>Team Two: </strong>
              <List>
                <List.Item>
                  <strong>Protest Reason: </strong>
                  {game.teamTwo.protest.get ? game.teamTwo.protest.get : <i>None</i>}
                </List.Item>
                <List.Item>
                  <strong>Notes: </strong>
                  {game.teamTwo.notes.get ? game.teamTwo.notes.get : <i>None</i>}
                </List.Item>
              </List>
            </List.Item>
          </List>
        </>
      ),
    },
    {
      Icon: IconNote,
      value: 'Notes',
      color: 'white',
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
        <Button
          size="lg"
          color="red"
          onClick={() => {
            end(game, bestPlayer.searchableName, reviewReqd);
            close();
          }}
        >
          Submit
        </Button>
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
  const [opened, { open, close }] = useDisclosure(false);
  const items = useMemo(
    () =>
      getActions(game, bestPlayer[0]?.get, close, reviewReqd, setReviewReqd).map((item, i) => (
        <Accordion.Item key={i} value={item.value}>
          <Accordion.Control>
            <item.Icon color={item.color}></item.Icon>
            {item.value}
          </Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      )),
    [bestPlayer, close, game]
  );
  const teamOne = game.teamOneIGA.get ? game.teamOne : game.teamTwo;
  const teamTwo = game.teamOneIGA.get ? game.teamTwo : game.teamOne;
  const matchPoints =
    teamOne.score.get >= 10 || teamTwo.score.get >= 10 ? teamOne.score.get - teamTwo.score.get : 0;
  return (
    <>
      <Modal opened={opened} centered onClose={close} title="Action">
        <Title> End Game</Title>
        <Accordion defaultValue="Notes">{items}</Accordion>
      </Modal>
      {game.started.get ? (
        game.ended.get ? (
          <>
            <Button size="lg" onClick={open} disabled={bestPlayer.length === 0}>
              End
            </Button>
          </>
        ) : (
          <>
            <Title order={1}>
              {matchPoints > 0 ? <strong>{teamOne.score.get}*</strong> : teamOne.score.get}
            </Title>
            <Title order={1}>-</Title>
            <Title order={1}>
              {matchPoints < 0 ? <strong>{teamTwo.score.get}*</strong> : teamTwo.score.get}
            </Title>
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
