import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';

export function Column({ column, tasks, isHovered }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4 relative">
        {isHovered && (
          <div className="absolute top-1/2 left-0 w-full h-1 bg-indigo-500 opacity-75 rounded animate-pulse" />
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

