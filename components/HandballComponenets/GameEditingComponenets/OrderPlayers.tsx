import {
  closestCenter,
  DndContext,
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
import { IconAward, IconHomeRibbon, IconTrophy } from '@tabler/icons-react';
import { Center, Paper, Text } from '@mantine/core';
import { GameState } from '@/components/HandballComponenets/GameEditingComponenets/GameEditingActions';
import { PlayerGameStatsStructure } from '@/ServerActions/types';

interface OrderPlayersProps {
  game: GameState;
}

export function OrderPlayers({ game }: OrderPlayersProps) {
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = game.votes.get.map((pgs) => pgs.searchableName).indexOf(active.id);
      const newIndex = game.votes.get.map((pgs) => pgs.searchableName).indexOf(over.id);
      game.votes.set(arrayMove(game.votes.get, oldIndex, newIndex));
    }
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
        items={game.votes.get.map((pgs) => pgs.searchableName)}
        strategy={verticalListSortingStrategy}
      >
        {game.votes.get.map((id, i) => (
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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Paper shadow="lg">
        <Center>
          <Text m={10} size="lg">
            <b>{index + 1}: </b> {pgs.name}
          </Text>
          {index === 0 && <i>(2 Votes)</i>}
          {index === 1 && <i>(1 Vote)</i>}
        </Center>
      </Paper>
    </div>
  );
}
