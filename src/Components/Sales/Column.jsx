import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';

const COLUMN_COLORS = {
  COLD: "#FC807A", 
  WARM: "#365DFF", 
  ON_CALL: "#FFBF37", 
  CLOSED: "#0EBD94", 

  APPLIED: "#FC807A",      
  INTERVIEWED: "#365DFF",   
  OFFERED: "#FFBF37",     
  PLACED: "#0EBD94",    

  BEGINNER: "#FC807A",     
  INTERMEDIATE: "#365DFF",  
  ADVANCED: "#FFBF37",     
  COMPLETED: "#0EBD94", 
};

export function Column({ column, tasks, isHovered, brandColor = "#008370", onTaskClick }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  const dotColor = COLUMN_COLORS[column.id] || "#000000"; // default to black if not found

  return (
    <div className="flex w-80 flex-col rounded-xl border border-gray-200 bg-[#F8F8F8] shadow-sm">
      <div
        className="px-4 py-3 font-semibold text-white rounded-t-xl flex space-x-2 items-center"
        style={{ backgroundColor: brandColor }}
      >
        {/* Colored Dot */}
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: dotColor }}
        ></span>

        {/* Title */}
        <span>{column.title}</span>

        {/* Count Bubble */}
        <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-semibold shadow-lg">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-4 flex flex-col gap-4 relative min-h-[100px]"
      >
        {isHovered && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#E6F6F4] opacity-50 rounded-lg border-2 border-dashed border-[#008370] pointer-events-none z-0 animate-pulse" />
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
}
