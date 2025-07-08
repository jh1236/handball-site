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
import useSound from 'use-sound';
import {
  Accordion,
  Box,
  Button,
  Center,
  Checkbox,
  Image,
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
  begin,
  end,
} from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { OrderPlayers } from '@/components/HandballComponenets/GameEditingComponenets/OrderPlayers';
import { FEEDBACK_TEXTS } from '@/components/HandballComponenets/GameEditingComponenets/TeamButton';
import { GameState } from '@/components/HandballComponenets/GameState';

interface GameScoreArgs {
  game: GameState;
}

const CAN_HAVE_ZAIAH_BOX = ['Zaiah Deards', 'Jared Healy'];

export const ZAIAH_BOX_FUCKERY = false;
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
        </>
      ),
    },
  ];
}

export function GameScore({ game }: GameScoreArgs) {
  const router = useRouter();
  const [reviewReqd, setReviewReqd] = useState<boolean>(false);
  const [endGameOpen, { open: openEndGame, close: closeEndGame }] = useDisclosure(false);
  const [openMatchPoints, setOpenMatchPoints] = useState(false);
  const [bestPlayersOpened, setBestPlayersOpened] = useState(false);
  const [openZaiahBox, setOpenZaiahBox] = useState<number>(0);
  useEffect(() => {
    if (game.practice.get) {
      game.teamOne.rating.set(3);
      game.teamTwo.rating.set(3);
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

  const [playZaiahBox] = useSound(`/sounds/zaiah${Math.floor(Math.random() * 6 + 1)}.mp3`, {
    volume: 1,
  });

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
      <Image
        src="/images/confett.gif"
        width={100}
        height={100}
        alt="Fuckin Confetti"
        onClick={() => setOpenMatchPoints(false)}
        style={{
          zIndex: 999,
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          display: ZAIAH_BOX_FUCKERY && openMatchPoints ? 'block' : 'none',
        }}
      ></Image>
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
      <Modal
        zIndex={999}
        opened={openZaiahBox === 3}
        centered
        onClose={() => setOpenZaiahBox(openZaiahBox - 1)}
        title="Action"
      >
        <Title> You have opened The Zaiah box</Title>
        <Text>
          This text is here so you cant see the value of the zaiah box whilst this dialogue box is
          open. This is really important, and im protecting the sanctity of the zaiah box.
          Apparrently its not long enough, so now i need to
        </Text>
      </Modal>
      <Modal
        zIndex={999}
        opened={openZaiahBox === 2}
        centered
        onClose={() => setOpenZaiahBox(openZaiahBox - 1)}
        title="Action"
      >
        <Title>
          {' '}
          You just closed the dialogue box which tells you about how you opened the zaiah box
        </Title>
        <Text>
          This is the last one I promise. Dont forget: if it&apos;s less than 5 rounds, you&apos;re
          supposed to say it out loud, and its kinda important that you get this right.
        </Text>
      </Modal>
      <Modal
        zIndex={999}
        opened={openZaiahBox === 1}
        centered
        onClose={() => {
          setOpenZaiahBox(openZaiahBox - 1);
          setOpenMatchPoints(true);
        }}
        title="Action"
      >
        <Title>
          {' '}
          You have opened box designed to let you know that the previous box was there so you knew
          that you closed the box to tell you about the zaiah box.
        </Title>
        <Text>
          (Black screen with text; The sound of buzzing bees can be heard) According to all known
          laws of aviation, : there is no way a bee should be able to fly. : Its wings are too small
          to get its fat little body off the ground. : The bee, of course, flies anyway : because
          bees don&apos;t care what humans think is impossible. BARRY BENSON: (Barry is picking out
          a shirt) Yellow, black. Yellow, black. Yellow, black. Yellow, black. : Ooh, black and
          yellow! Let&apos;s shake it up a little. JANET BENSON: Barry! Breakfast is ready! BARRY:
          Coming! : Hang on a second. (Barry uses his antenna like a phone) : Hello? ADAM FLAYMAN:
          (Through phone) - Barry? BARRY: - Adam? ADAM: - Can you believe this is happening? BARRY:
          - I can&apos;t. I&apos;ll pick you up. (Barry flies down the stairs) : MARTIN BENSON:
          Looking sharp. JANET: Use the stairs. Your father paid good money for those. BARRY: Sorry.
          I&apos;m excited. MARTIN: Here&apos;s the graduate. We&apos;re very proud of you, son. : A
          perfect report card, all B&apos;s. JANET: Very proud. (Rubs Barry&apos;s hair) BARRY= Ma!
          I got a thing going here. JANET: - You got lint on your fuzz. BARRY: - Ow! That&apos;s me!
          JANET: - Wave to us! We&apos;ll be in row 118,000. - Bye! (Barry flies out the door)
          JANET: Barry, I told you, stop flying in the house! (Barry drives through the hive,and is
          waved at by Adam who is reading a newspaper) BARRY== - Hey, Adam. ADAM: - Hey, Barry.
          (Adam gets in Barry&apos;s car) : - Is that fuzz gel? BARRY: - A little. Special day,
          graduation. ADAM: Never thought I&apos;d make it. (Barry pulls away from the house and
          continues driving) BARRY: Three days grade school, three days high school... ADAM: Those
          were awkward. BARRY: Three days college. I&apos;m glad I took a day and hitchhiked around
          the hive. ADAM== You did come back different. (Barry and Adam pass by Artie, who is
          jogging) ARTIE: - Hi, Barry! BARRY: - Artie, growing a mustache? Looks good. ADAM: - Hear
          about Frankie? BARRY: - Yeah. ADAM== - You going to the funeral? BARRY: - No, I&apos;m not
          going to his funeral. : Everybody knows, sting someone, you die. : Don&apos;t waste it on
          a squirrel. Such a hothead. ADAM: I guess he could have just gotten out of the way. (The
          car does a barrel roll on the loop-shaped bridge and lands on the highway) : I love this
          incorporating an amusement park into our regular day. BARRY: I guess that&apos;s why they
          say we don&apos;t need vacations. (Barry parallel parks the car and together they fly over
          the graduating students) Boy, quite a bit of pomp... under the circumstances. (Barry and
          Adam sit down and put on their hats) : - Well, Adam, today we are men. ADAM: - We are!
          BARRY= - Bee-men. =ADAM= - Amen! BARRY AND ADAM: Hallelujah! (Barry and Adam both have a
          happy spasm) ANNOUNCER: Students, faculty, distinguished bees, : please welcome Dean
          Buzzwell. DEAN BUZZWELL: Welcome, New Hive Oity graduating class of... : ...9: : That
          concludes our ceremonies. : And begins your career at Honex Industries! ADAM: Will we pick
          our job today? (Adam and Barry get into a tour bus) BARRY= I heard it&apos;s just
          orientation. (Tour buses rise out of the ground and the students are automatically loaded
          into the buses) TOUR GUIDE: Heads up! Here we go. ANNOUNCER: Keep your hands and antennas
          inside the tram at all times. BARRY: - Wonder what it&apos;ll be like? ADAM: - A little
          scary. TOUR GUIDE== Welcome to Honex, a division of Honesco : and a part of the Hexagon
          Group. Barry: This is it! BARRY AND ADAM: Wow. BARRY: Wow. (The bus drives down a road an
          on either side are the Bee&apos;s massive complicated Honey-making machines) TOUR GUIDE:
          We know that you, as a bee, have worked your whole life : to get to the point where you
          can work for your whole life. : Honey begins when our valiant Pollen Jocks bring the
          nectar to the hive. : Our top-secret formula : is automatically color-corrected,
          scent-adjusted and bubble-contoured : into this soothing sweet syrup : with its
          distinctive golden glow you know as... EVERYONE ON BUS: Honey! (The guide has been
          collecting honey into a bottle and she throws it into the crowd on the bus and it is
          caught by a girl in the back) ADAM: - That girl was hot. BARRY: - She&apos;s my cousin!
          ADAM== - She is? BARRY: - Yes, we&apos;re all cousins. ADAM: - Right. You&apos;re right.
          TOUR GUIDE: - At Honex, we constantly strive : to improve every aspect of bee existence. :
          These bees are stress-testing a new helmet technology. (The bus passes by a Bee wearing a
          helmet who is being smashed into the ground with fly-swatters, newspapers and boots. He
          lifts a thumbs up but you can hear him groan) : ADAM== - What do you think he makes?
          BARRY: - Not enough. TOUR GUIDE: Here we have our latest advancement, the Krelman. (They
          pass by a turning wheel with Bees standing on pegs, who are each wearing a finger-shaped
          hat) Barry: - Wow, What does that do? TOUR GUIDE: - Catches that little strand of honey :
          that hangs after you pour it. Saves us millions. ADAM: (Intrigued) Can anyone work on the
          Krelman? TOUR GUIDE: Of course. Most bee jobs are small ones. But bees know that every
          small job, if it&apos;s done well, means a lot. : But choose carefully : because
          you&apos;ll stay in the job you pick for the rest of your life. (Everyone claps except for
          Barry) BARRY: The same job the rest of your life? I didn&apos;t know that.
        </Text>
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
                <Box
                  onClick={() => {
                    if (matchPoints !== 0) {
                      if (
                        !openMatchPoints &&
                        CAN_HAVE_ZAIAH_BOX.includes(localStorage.getItem('username')!)
                      ) {
                        if (ZAIAH_BOX_FUCKERY) {
                          playZaiahBox();
                          setOpenZaiahBox(3);
                        } else {
                          setOpenMatchPoints(!openMatchPoints);
                        }
                      }
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
                <Center>
                  <Title>The Zaiah Box</Title>
                </Center>
                <Center>
                  <Text fw={700} fz={20}>
                    <i>
                      {Math.abs(matchPoints)} match points to{' '}
                      {matchPoints > 0 ? teamOne.name.get : teamTwo.name.get}
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
