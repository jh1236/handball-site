import React, { ForwardRefExoticComponent, Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCloudUpload, IconNote, IconStarHalfFilled, IconTrophy } from '@tabler/icons-react';
import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  List,
  Popover,
  Rating,
  Stepper,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useEditGameActions } from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { OrderPlayers } from '@/components/HandballComponenets/GameEditingComponenets/OrderPlayers';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton/TeamButton';
import { decidedOnCoinToss } from '@/components/HandballComponenets/GameEditingComponenets/UpdateGameActions';
import { GameState } from '@/components/HandballComponenets/GameState';

interface GameActionListParams {
  game: GameState;
  close?: () => void;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

type StepperData = {
  Icon: ForwardRefExoticComponent<any>;
  value: string;
  title?: string | React.JSX.Element;
  color?: string;
  content: React.JSX.Element;
  nextDisabled?: () => boolean;
};

export function GameActionList({
  game,
  close,
  index,
  setIndex,
}: GameActionListParams): React.ReactElement {
  const router = useRouter();
  const [reviewReqd, setReviewReqd] = useState<boolean>(false);
  const { end } = useEditGameActions(game);
  const winningTeam =
    game.teamTwo.score.get > game.teamOne.score.get ? game.teamTwo.name : game.teamOne.name;
  const [protest, setProtest] = useState<boolean>(false);
  const out: StepperData[] = [
    {
      Icon: IconNote,
      value: 'Notes',
      color: undefined,
      nextDisabled: () =>
        (reviewReqd && game.notes.get.split(' ').filter((a) => a.length > 0).length < 3) as boolean,
      content: (
        <>
          <Checkbox
            mt={10}
            mb={10}
            defaultChecked={reviewReqd}
            onChange={(e) => setReviewReqd(e.currentTarget.checked)}
            label="Mark this game as requiring action"
            description="This will notify the Umpire Manager"
          />
          <Textarea
            mt={10}
            mb={10}
            label="Notes"
            error={
              reviewReqd && game.notes.get.split(' ').filter((a) => a.length > 0).length < 3
                ? game.notes.get
                  ? 'Notes must contain at least 3 words'
                  : 'Notes must be provided if review required'
                : undefined
            }
            value={game.notes.get}
            minRows={6}
            autosize
            onChange={(v) => game.notes.set(v.currentTarget.value)}
          ></Textarea>
        </>
      ),
    },
  ];

  for (const team of [game.teamOne, game.teamTwo]) {
    out.push({
      Icon: IconStarHalfFilled,
      value: `Rate ${team.name.get}`,
      color: undefined,
      nextDisabled: () =>
        (team.rating.get === 1 &&
          team.notes.get.split(' ').filter((a) => a.length > 0).length < 3) ||
        (protest && team.protest.get.split(' ').filter((a) => a.length > 0).length < 3),
      content: (
        <>
          <Rating value={team.rating.get} count={4} size="lg" onChange={team.rating.set}></Rating>
          {FEEDBACK_TEXTS[team.rating.get]}
          <Textarea
            label="Notes"
            mt={10}
            mb={10}
            value={team.notes.get}
            minRows={4}
            autosize
            error={
              team.rating.get === 1 &&
              team.notes.get.split(' ').filter((a) => a.length > 0).length < 3
                ? team.notes.get
                  ? 'Notes must contain at least 3 words'
                  : 'Notes must be provided if behaviour needs follow up'
                : undefined
            }
            onChange={(v) => team.notes.set(v.currentTarget.value)}
          ></Textarea>
          <Checkbox
            checked={protest || !!team.protest.get}
            mt={10}
            mb={10}
            onChange={(e) => {
              team.protest.set('');
              setProtest(e.target.checked);
            }}
            label={`Do '${team.name.get}' wish to protest?`}
          ></Checkbox>
          {(protest || !!team.protest.get) && (
            <Textarea
              mt={10}
              mb={10}
              label="Protest Reason"
              error={
                team.protest.get.split(' ').filter((a) => a.length > 0).length < 3
                  ? team.protest.get
                    ? 'Protest reason must contain at least 3 words'
                    : 'Protest reason must be provided'
                  : undefined
              }
              value={team.protest.get}
              minRows={4}
              autosize
              onChange={(v) => team.protest.set(v.currentTarget.value)}
            ></Textarea>
          )}
        </>
      ),
    });
  }

  if (
    (game.teamOne.left.get && game.teamOne.right.get) ||
    (game.teamTwo.left.get && game.teamTwo.right.get)
  ) {
    // at least one team has two players; we need B&F Votes
    out.push({
      Icon: IconTrophy,
      value: 'B&F Votes',
      color: undefined,
      content: <OrderPlayers game={game}></OrderPlayers>,
    });
  }

  out.push({
    Icon: IconCloudUpload,
    value: 'Finalise',
    content: (
      <>
        <List>
          <List.Item>
            <strong>Winning Team: </strong>
            {winningTeam.get}
          </List.Item>
          <List.Item>
            <strong>Best Players</strong>
            <strong>: </strong>
            {game.votes.get.map((pgs: { name: string }) => pgs.name).join(', ')}
          </List.Item>
          <List.Item>
            <strong>Review Required: </strong>
            {reviewReqd ? 'Yes' : 'No'}
          </List.Item>
          <List.Item>
            <strong>Notes:</strong>
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
                <strong>Rating: </strong>
                {FEEDBACK_TEXTS[game.teamOne.rating.get ?? 0]}
              </List.Item>
              <List.Item>
                Notes
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
                <strong>Rating: </strong>
                {FEEDBACK_TEXTS[game.teamTwo.rating.get ?? 0]}
              </List.Item>
              <List.Item>
                <strong>Notes: </strong>
                {game.teamTwo.notes.get ? game.teamTwo.notes.get : <i>Unset</i>}
              </List.Item>
            </List>
          </List.Item>
        </List>
      </>
    ),
  });
  return (
    <>
      <Flex w="100%" justify="space-between">
        <Title order={1} m={5}>
          {out[index].title ?? out[index].value}
        </Title>
        {close && <CloseButton onClick={close}></CloseButton>}
      </Flex>
      <Stepper
        defaultValue="Notes"
        size="sm"
        active={index}
        onStepClick={(s) => {
          setIndex(s);
          setProtest(false);
        }}
        allowNextStepsSelect={game.practice.get}
        iconSize={32}
      >
        {out.map((item, i) => (
          <Stepper.Step icon={<item.Icon color={item.color}></item.Icon>} key={i}>
            <Flex direction="column" align="space-between">
              {item.content}
              <Box>
                <Button
                  m={10}
                  maw={100}
                  disabled={!close && index < 1}
                  onClick={() => {
                    if (index === 0) {
                      close && close();
                    } else {
                      setIndex((a) => a - 1);
                    }
                  }}
                >
                  Back
                </Button>
                {index < out.length - 1 ? (
                  <Button
                    m={10}
                    maw={100}
                    disabled={item.nextDisabled ? item.nextDisabled() : false}
                    style={{ float: 'right' }}
                    onClick={() => setIndex((a) => a + 1)}
                  >
                    Next
                  </Button>
                ) : !decidedOnCoinToss(game) ? (
                  <Button
                    color="red"
                    m={10}
                    maw={100}
                    style={{ float: 'right' }}
                    disabled={
                      !game.practice.get &&
                      (!game.teamOne.rating.get ||
                        !game.teamTwo.rating.get ||
                        (game.teamOne.rating.get === 1 && !game.teamOne.notes.get) ||
                        (game.teamTwo.rating.get === 1 && !game.teamTwo.notes.get) ||
                        (reviewReqd && !game.notes.get))
                    }
                    onClick={() => {
                      end(reviewReqd).then(() => router.push('/games/create'));
                      close && close();
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
                            (reviewReqd && !game.notes.get))
                        }
                      >
                        Submit
                      </Button>
                    </Popover.Target>
                    <Popover.Dropdown ta="center">
                      <Text m={5}>
                        Submitting this game will result in a{' '}
                        <b style={{ color: 'red' }}>random winner</b> being chosen. Are you sure
                        that is what you want to happen
                      </Text>
                      <Button
                        m={5}
                        size="lg"
                        color="red"
                        onClick={() => {
                          end(reviewReqd).then(() => router.push('/games/create'));
                          close && close();
                        }}
                      >
                        I Understand
                      </Button>
                    </Popover.Dropdown>
                  </Popover>
                )}
              </Box>
            </Flex>
          </Stepper.Step>
        ))}
      </Stepper>
    </>
  );
}
