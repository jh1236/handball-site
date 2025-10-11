import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCheckbox, IconCloudUpload, IconNote, IconTrophy } from '@tabler/icons-react';
import { Accordion, Button, Checkbox, List, Popover, Rating, Text, Textarea } from '@mantine/core';
import { markIfReqd } from '@/components/HandballComponenets/AdminGamePanel';
import { end } from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { OrderPlayers } from '@/components/HandballComponenets/GameEditingComponenets/OrderPlayers';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton/TeamButton';
import { decidedOnCoinToss } from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { GameState } from '@/components/HandballComponenets/GameState';

interface GameActionListParams {
  game: GameState;
  close: () => void;
}

export function GameActionList({ game, close }: GameActionListParams): React.ReactElement {
  const router = useRouter();
  const [reviewReqd, setReviewReqd] = useState<boolean>(false);
  const [bestPlayersOpened, setBestPlayersOpened] = useState(false);
  const winningTeam =
    game.teamTwo.score.get > game.teamOne.score.get ? game.teamTwo.name : game.teamOne.name;
  const out = [
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
  return (
    <Accordion
      defaultValue="Notes"
      onChange={(v) => {
        if (v === 'Rank Best Players') {
          setBestPlayersOpened(true);
        }
      }}
    >
      {out.map((item, i) => (
        <Accordion.Item key={i} value={item.value}>
          <Accordion.Control icon={<item.Icon color={item.color}></item.Icon>}>
            {item.title ?? item.value}
          </Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
