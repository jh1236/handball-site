import { useMemo, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Box, Center, Flex, FloatingIndicator, UnstyledButton } from '@mantine/core';
import classes from './SelectCourtLocation.module.css';

interface SelectCourtLocationParams {
  location: string[];
  setLocation: React.Dispatch<React.SetStateAction<string[]>>;
  isAce?: boolean;
  leftSide: boolean;
}

export function SelectCourtLocation({
  location,
  setLocation,
  isAce = false,
  leftSide,
}: SelectCourtLocationParams) {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

  const setControlRef = (name: string) => (node: HTMLButtonElement) => {
    controlsRefs[name] = node;
    setControlsRefs(controlsRefs);
  };
  const W = 50;
  const H = 50;
  const lineThickness = 3;
  const edgeFactor = 2;
  const stringLocation = useMemo(() => location.join('-'), [location]);
  const active = useMemo(() => controlsRefs[stringLocation], [controlsRefs, stringLocation]);
  return (
    <>
      <div className={classes.root} dir="ltr" ref={setRootRef}>
        <Center>
          <i>Back Court</i>
        </Center>
        <FloatingIndicator
          target={active}
          style={{
            opacity: 0.5,
            backgroundColor: '#6666ff',
          }}
          parent={rootRef}
          className={classes.indicator}
        />

        <Flex>
          <UnstyledButton
            disabled={isAce && leftSide}
            className={isAce && leftSide ? classes.evilcontrol : classes.control}
            h={H}
            w={W / edgeFactor}
            onClick={() => setLocation(['deep', 'wide-left'])}
            ref={setControlRef('deep-wide-left')}
            mod={{ active: stringLocation === 'deep-wide-left' }}
          >
            {isAce && leftSide && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} h={H} />
          <UnstyledButton
            disabled={isAce && leftSide}
            className={isAce && leftSide ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['deep', 'left'])}
            ref={setControlRef('deep-left')}
            mod={{ active: stringLocation === 'deep-left' }}
          >
            {isAce && leftSide && <IconX />}
          </UnstyledButton>
          <UnstyledButton
            disabled={isAce && leftSide}
            className={isAce && leftSide ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['deep', 'center-left'])}
            ref={setControlRef('deep-center-left')}
            mod={{ active: stringLocation === 'deep-center-left' }}
          >
            {isAce && leftSide && <IconX />}
          </UnstyledButton>
          <Box pos="relative" w={lineThickness} bg="green" h={H / edgeFactor} top={(2 * H) / edgeFactor} />
          <UnstyledButton
            disabled={isAce && !leftSide}
            className={isAce && !leftSide ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['deep', 'center-right'])}
            ref={setControlRef('deep-center-right')}
            mod={{ active: stringLocation === 'deep-center-right' }}
          >
            {isAce && !leftSide && <IconX />}
          </UnstyledButton>
          <UnstyledButton
            disabled={isAce && !leftSide}
            className={isAce && !leftSide ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['deep', 'right'])}
            ref={setControlRef('deep-right')}
            mod={{ active: stringLocation === 'deep-right' }}
          >
            {isAce && !leftSide && <IconX />}
          </UnstyledButton>
          <UnstyledButton
            disabled={isAce && !leftSide}
            className={isAce && !leftSide ? classes.evilcontrol : classes.control}
            h={H}
            w={W / edgeFactor}
            onClick={() => setLocation(['deep', 'wide-right'])}
            ref={setControlRef('deep-wide-right')}
            mod={{ active: stringLocation === 'deep-wide-right' }}
          >
            {isAce && !leftSide && <IconX />}
          </UnstyledButton>
        </Flex>

        <Box pos="relative" left={W / edgeFactor} w={4 * W + 3 * lineThickness} bg="purple" h={lineThickness} />

        <Flex>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W / edgeFactor}
            onClick={() => setLocation(['back', 'wide-left'])}
            ref={setControlRef('back-wide-left')}
            mod={{ active: stringLocation === 'back-wide-left' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} bg="pink" h={H} />
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['back', 'left'])}
            ref={setControlRef('back-left')}
            mod={{ active: stringLocation === 'back-left' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['back', 'center-left'])}
            ref={setControlRef('back-center-left')}
            mod={{ active: stringLocation === 'back-center-left' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} bg="green" h={H} />
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['back', 'center-right'])}
            ref={setControlRef('back-center-right')}
            mod={{ active: stringLocation === 'back-center-right' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['back', 'right'])}
            ref={setControlRef('back-right')}
            mod={{ active: stringLocation === 'back-right' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} bg="pink" h={H} />
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W / edgeFactor}
            onClick={() => setLocation(['back', 'wide-right'])}
            ref={setControlRef('back-wide-right')}
            mod={{ active: stringLocation === 'back-wide-right' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
        </Flex>
        <Flex>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W / edgeFactor}
            onClick={() => setLocation(['mid', 'wide-left'])}
            ref={setControlRef('mid-wide-left')}
            mod={{ active: stringLocation === 'mid-wide-left' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} bg="pink" h={H} />
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['mid', 'left'])}
            ref={setControlRef('mid-left')}
            mod={{ active: stringLocation === 'mid-left' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['mid', 'center-left'])}
            ref={setControlRef('mid-center-left')}
            mod={{ active: stringLocation === 'mid-center-left' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} bg="green" h={H} />
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['mid', 'center-right'])}
            ref={setControlRef('mid-center-right')}
            mod={{ active: stringLocation === 'mid-center-right' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['mid', 'right'])}
            ref={setControlRef('mid-right')}
            mod={{ active: stringLocation === 'mid-right' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} bg="pink" h={H} />
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W / edgeFactor}
            onClick={() => setLocation(['mid', 'wide-right'])}
            ref={setControlRef('mid-wide-right')}
            mod={{ active: stringLocation === 'mid-wide-right' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
        </Flex>

        <Box pos="relative" left={W / edgeFactor} w={4 * W + 3 * lineThickness} bg="red" h={lineThickness} />

        <Flex>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W / edgeFactor}
            onClick={() => setLocation(['front', 'wide-left'])}
            ref={setControlRef('front-wide-left')}
            mod={{ active: stringLocation === 'front-wide-left' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} bg="pink" h={H} />
          <UnstyledButton
            className={isAce ? classes.evilcontrol : classes.control}
            disabled={isAce}
            h={H}
            w={W}
            onClick={() => setLocation(['front', 'left'])}
            ref={setControlRef('front-left')}
            mod={{ active: stringLocation === 'front-left' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <UnstyledButton
            className={isAce ? classes.evilcontrol : classes.control}
            disabled={isAce}
            h={H}
            w={W}
            onClick={() => setLocation(['front', 'center-left'])}
            ref={setControlRef('front-center-left')}
            mod={{ active: stringLocation === 'front-center-left' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} bg="green" h={H} />
          <UnstyledButton
            className={isAce ? classes.evilcontrol : classes.control}
            disabled={isAce}
            h={H}
            w={W}
            onClick={() => setLocation(['front', 'center-right'])}
            ref={setControlRef('front-center-right')}
            mod={{ active: stringLocation === 'front-center-right' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <UnstyledButton
            className={isAce ? classes.evilcontrol : classes.control}
            disabled={isAce}
            h={H}
            w={W}
            onClick={() => setLocation(['front', 'right'])}
            ref={setControlRef('front-right')}
            mod={{ active: stringLocation === 'front-right' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
          <Box w={lineThickness} bg="pink" h={H} />
          <UnstyledButton
            className={isAce ? classes.evilcontrol : classes.control}
            disabled={isAce}
            h={H}
            w={W / edgeFactor}
            onClick={() => setLocation(['front', 'wide-right'])}
            ref={setControlRef('front-wide-right')}
            mod={{ active: stringLocation === 'front-wide-right' }}
          >
            {isAce && <IconX />}
          </UnstyledButton>
        </Flex>

        <Box pos="relative" left={W / edgeFactor} w={4 * W + 3 * lineThickness} bg="white" h={lineThickness} />

        <Center>
          <i>Center Line</i>
        </Center>
      </div>
    </>
  );
}
