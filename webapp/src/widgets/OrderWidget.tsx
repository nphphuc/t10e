import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface OrderWidgetProps {
  data: {
    prompt: string;
    options?: string[];
    items?: string[];
    correctOrder: string[];
  };
  selectedAnswer: string[] | null;
  onAnswer: (value: string[]) => void;
  isSubmitted: boolean;
}

interface SortableItemProps {
  id: string;
  isSubmitted: boolean;
  isCorrect?: boolean;
}

function SortableItem({ id, isSubmitted, isCorrect }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  let itemClass = "border-2 border-gray-700 bg-gray-800/60 text-gray-200 hover:border-gray-500 cursor-grab active:cursor-grabbing";

  if (isSubmitted) {
    if (isCorrect) {
      itemClass = "border-success/60 bg-success/5 text-success cursor-default";
    } else {
      itemClass = "border-error/40 bg-error/5 text-error cursor-default";
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!isSubmitted ? listeners : {})}
      className={`p-4 rounded-xl flex items-center gap-3 transition-all ${itemClass} ${isDragging ? "shadow-lg scale-[1.02] border-blue-500 bg-gray-800" : ""}`}
    >
      <div className="flex-shrink-0 flex flex-col gap-0.5 opacity-40">
        <div className="w-4 h-0.5 bg-current rounded-full" />
        <div className="w-4 h-0.5 bg-current rounded-full" />
        <div className="w-4 h-0.5 bg-current rounded-full" />
      </div>
      <span className="font-medium text-sm select-none">{id}</span>
    </div>
  );
}

export default function OrderWidget({
  data,
  selectedAnswer,
  onAnswer,
  isSubmitted,
}: OrderWidgetProps) {
  const listItems = data.options || data.items || [];
  
  // Shuffled or current ordered list
  const currentOrder = Array.isArray(selectedAnswer) ? selectedAnswer : listItems;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (isSubmitted || !over) return;

    if (active.id !== over.id) {
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      onAnswer(newOrder);
    }
  };

  // Helper to determine if item is in correct position (only shown when submitted)
  const isItemCorrect = (item: string, idx: number) => {
    return data.correctOrder[idx] === item;
  };

  return (
    <div className="space-y-4">
      {!isSubmitted && (
        <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase">
          Kéo thả hoặc dùng bàn phím (Tab, Space, mũi tên lên/xuống) để sắp xếp
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={currentOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {currentOrder.map((item, idx) => (
              <SortableItem
                key={item}
                id={item}
                isSubmitted={isSubmitted}
                isCorrect={isItemCorrect(item, idx)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {isSubmitted && (
        <div className="mt-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-sm">
          <div className="font-semibold text-gray-300 mb-2">Thứ tự đúng:</div>
          <ol className="list-decimal pl-5 space-y-1 text-gray-400">
            {data.correctOrder.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
