import { useMemo, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Box, Center, Flex, FloatingIndicator, UnstyledButton } from '@mantine/core';
import classes from './SelectCourtLocation.module.css';

interface SelectCourtLocationParams {
  location: string[];
  setLocation: React.SetStateAction<string[]>;
  isAce: boolean;
}

export function SelectCourtLocation({ location, setLocation, isAce }: SelectCourtLocationParams) {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

  const setControlRef = (name: string) => (node: HTMLButtonElement) => {
    controlsRefs[name] = node;
    setControlsRefs(controlsRefs);
  };
  const W = 50;
  const H = 50;
  const Thick = 3;
  const stringLocation = useMemo(() => controlsRefs[location.join('-')], [controlsRefs, location]);
  return (
    <>
      <div className={classes.root} dir="ltr" ref={setRootRef}>
        <Center>
          <i>Back Court</i>
        </Center>
        <FloatingIndicator
          target={stringLocation}
          style={{
            opacity: 0.5,
            backgroundColor: '#6666ff',
          }}
          parent={rootRef}
          className={classes.indicator}
        />

        <Box w={4 * W + 3 * Thick} bg="purple" h={Thick}></Box>

        <Flex>
          <Box w={Thick} bg="pink" h={H}></Box>
          <UnstyledButton
            className={classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['top', 'left'])}
            ref={setControlRef('top-left')}
            mod={{ active: stringLocation === 'top-left' }}
          ></UnstyledButton>
          <UnstyledButton
            className={classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['top', 'center-left'])}
            ref={setControlRef('top-center-left')}
            mod={{ active: stringLocation === 'top-center-left' }}
          ></UnstyledButton>
          <Box w={Thick} bg="green" h={H}></Box>
          <UnstyledButton
            className={classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['top', 'center-right'])}
            ref={setControlRef('top-center-right')}
            mod={{ active: stringLocation === 'top-center-right' }}
          ></UnstyledButton>
          <UnstyledButton
            className={classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['top', 'right'])}
            ref={setControlRef('top-right')}
            mod={{ active: stringLocation === 'top-center-right' }}
          ></UnstyledButton>
          <Box w={Thick} bg="pink" h={H}></Box>
        </Flex>
        <Flex>
          <Box w={Thick} bg="pink" h={H}></Box>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['mid', 'left'])}
            ref={setControlRef('mid-left')}
            mod={{ active: stringLocation === 'mid-left' }}
          >
            {isAce && <IconX></IconX>}
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
            {isAce && <IconX></IconX>}
          </UnstyledButton>
          <Box w={Thick} bg="green" h={H}></Box>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['mid', 'center-right'])}
            ref={setControlRef('mid-center-right')}
            mod={{ active: location === 'mid-center-right' }}
          >
            {isAce && <IconX></IconX>}
          </UnstyledButton>
          <UnstyledButton
            disabled={isAce}
            className={isAce ? classes.evilcontrol : classes.control}
            h={H}
            w={W}
            onClick={() => setLocation(['mid', 'right'])}
            ref={setControlRef('mid-right')}
            mod={{ active: location === 'mid-right' }}
          >
            {isAce && <IconX></IconX>}
          </UnstyledButton>
          <Box w={Thick} bg="pink" h={H}></Box>
        </Flex>
        <Box w={4 * W + 3 * Thick} bg="red" h={Thick}></Box>
        <Flex>
          <Box w={Thick} bg="pink" h={H}></Box>
          <UnstyledButton
            className={isAce ? classes.evilcontrol : classes.control}
            disabled={isAce}
            h={H}
            w={W}
            onClick={() => setLocation(['bra', 'left'])}
            ref={setControlRef('bra-left')}
            mod={{ active: stringLocation === 'bra-left' }}
          >
            {isAce && <IconX></IconX>}
          </UnstyledButton>
          <UnstyledButton
            className={isAce ? classes.evilcontrol : classes.control}
            disabled={isAce}
            h={H}
            w={W}
            onClick={() => setLocation(['bra', 'center-left'])}
            ref={setControlRef('bra-center-left')}
            mod={{ active: stringLocation === 'bra-center-left' }}
          >
            {isAce && <IconX></IconX>}
          </UnstyledButton>
          <Box w={Thick} bg="green" h={H}></Box>
          <UnstyledButton
            className={isAce ? classes.evilcontrol : classes.control}
            disabled={isAce}
            h={H}
            w={W}
            onClick={() => setLocation(['bra', 'center-right'])}
            ref={setControlRef('bra-center-right')}
            mod={{ active: stringLocation === 'bra-center-right' }}
          >
            {isAce && <IconX></IconX>}
          </UnstyledButton>
          <UnstyledButton
            className={isAce ? classes.evilcontrol : classes.control}
            disabled={isAce}
            h={H}
            w={W}
            onClick={() => setLocation(['bra', 'right'])}
            ref={setControlRef('bra-right')}
            mod={{ active: stringLocation === 'bra-right' }}
          >
            {isAce && <IconX></IconX>}
          </UnstyledButton>
          <Box w={Thick} bg="pink" h={H}></Box>
        </Flex>
        <Box w={4 * W + 3 * Thick} bg="white" h={Thick}></Box>
        <Center>
          <i>Center Line</i>
        </Center>
      </div>
    </>
  );
}
