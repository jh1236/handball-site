import { useEffect, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Center, Paper, Text } from '@mantine/core';
import { TeamState } from '@/components/HandballComponenets/GameState';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

interface OrderPlayersProps {
  team: TeamState;
}

const sides: ('left' | 'right' | 'sub')[] = ['left', 'right', 'sub'];

export function PlacePlayersGameStart({ team }: OrderPlayersProps) {
  const initialPlayers = [team.left.get, team.right.get, team.sub.get].filter(
    (a): a is PlayerGameStatsStructure => !!a
  );
  const [players, setPlayers] = useState(initialPlayers);

  useEffect(() => {
    setPlayers(initialPlayers);
  }, [initialPlayers]);

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;

    const oldIndex = players.findIndex((p) => p.searchableName === active.id);
    const newIndex = players.findIndex((p) => p.searchableName === over.id);
    const newPlayers = arrayMove(players, oldIndex, newIndex);
    setPlayers(newPlayers);

    // Update team state to match the new order
    if (newPlayers[0]) team.left.set(newPlayers[0]);
    if (newPlayers[1]) team.right.set(newPlayers[1]);
    if (newPlayers[2]) team.sub.set(newPlayers[2]);
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={players.map((pgs) => pgs.searchableName)}
        strategy={verticalListSortingStrategy}
      >
        {players.map((id, i) => (
          <SortableItem key={id.searchableName} pgs={id} index={i} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

interface SortableItemsProps {
  pgs: PlayerGameStatsStructure;
  index: number;
}

function SortableItem({ pgs, index }: SortableItemsProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: pgs.searchableName,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: 20,
  };

  const side = sides[index];
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Paper shadow="lg" withBorder>
        <Center>
          <Text m={10} size="lg">
            <b>{side[0].toUpperCase() + side.slice(1)}: </b> {pgs.name}
          </Text>
        </Center>
      </Paper>
    </div>
  );
}
