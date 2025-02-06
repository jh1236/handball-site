'use client';

import React, { useEffect } from 'react';
import { Title, Center, Box, Flex, Button, Group, useMantineColorScheme } from '@mantine/core';
import { GameStructure } from '@/ServerActions/types';
import { getGame } from '@/ServerActions/GameActions';
import SidebarLayout from '@/components/Sidebar/SidebarLayout';

interface ScoreboardProps {
    gameID: number;
}

export function Scoreboard({ gameID }: ScoreboardProps) {
    const [game, setGame] = React.useState<GameStructure>();
    //

    useEffect(() => {
        getGame({
            gameID,
        }).then(setGame);
    }, [gameID]);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    if (!game) {
        return <>Loading...</>;
    }
    //
    return (
        <>
            <Button onClick={toggleColorScheme}></Button>
            <Center component={Flex}>
                <Title>{game.teamOne.name} </Title>
                <Title> vs </Title>
                <Title> {game.teamTwo.name}</Title>
            </Center>
            <Center>
                <Group bg="white" justify="space-evenly" grow gap="xl" w="95vw">
                    <Button>1</Button>
                    <Button>2</Button>
                </Group>
            </Center>
        </>
    );
}
