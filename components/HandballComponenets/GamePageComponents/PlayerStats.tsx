import { Box, Table } from '@mantine/core';
import { GameStructure } from '@/ServerActions/types';


interface PlayerStatsStructure {
    game: GameStructure
}
export function PlayerStats({ game }: PlayerStatsStructure) {
  return (
      <>
          <Table withColumnBorders>
              <Table.Tr>
                  <Table.Th style={{ textAlign: 'right' }} w="37.5%">Team 1</Table.Th>
                  <Table.Th style={{ textAlign: 'center' }} w="25%">Stat</Table.Th>
                  <Table.Th style={{ textAlign: 'left' }} w="37.5%">Team 2</Table.Th>
              </Table.Tr>
              <Table.Tr>
                  <Table.Td bg="blue" style={{ justifyContent: 'flex-end', display: 'flex', flexDirection: 'column' }}>
                      <Box h={10} w={200} bg="red"></Box>
                      <Box h={10} w={200} bg="green"></Box>
                  </Table.Td>
                  <Table.Td>stat</Table.Td>
                  <Table.Td>2</Table.Td>
              </Table.Tr>
          </Table>
      </>
  );
}
