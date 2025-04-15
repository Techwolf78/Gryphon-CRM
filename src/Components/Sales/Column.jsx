import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';

export function Column({ column, tasks, isHovered, brandColor = "#008370" }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex w-80 flex-col rounded-xl border border-gray-200 bg-[#F8F8F8] shadow-sm">
      {/* Column Header */}
      <div
        className="px-4 py-3 font-semibold text-white rounded-t-xl flex justify-between items-center"
        style={{ backgroundColor: brandColor }}
      >
        <span>{column.title}</span>
        
        {/* Task Count */}
        <span
          className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-semibold shadow-lg"
          style={{
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)", // subtle shadow
            marginLeft: "8px", // small margin between the title and the count
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className="flex-1 p-4 flex flex-col gap-4 relative min-h-[100px]"
      >
        {isHovered && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#E6F6F4] opacity-50 rounded-lg border-2 border-dashed border-[#008370] pointer-events-none z-0 animate-pulse" />
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

