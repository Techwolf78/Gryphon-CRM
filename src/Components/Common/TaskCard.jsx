import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';

export function TaskCard({ task, onClick }) {
  const [clickTimer, setClickTimer] = useState(null);
  const [isHeld, setIsHeld] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging: dndIsDragging } = useDraggable({
    id: task.id,
  });

  // Use dndIsDragging from useDraggable hook to check if the task is being dragged
  useEffect(() => {
    setIsDragging(dndIsDragging);
  }, [dndIsDragging]);

  // Dynamic styles for dragging
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition: 'transform 0.2s ease',
    opacity: dndIsDragging ? 0.5 : 1,
    boxShadow: dndIsDragging
      ? '0 0 0 2px rgba(0, 131, 112, 0.4)'
      : '0 1px 3px rgba(0,0,0,0.1)',
    // Increase z-index when dragging to ensure the dragged card is on top
    zIndex: dndIsDragging ? 1000 : 1, 
  };

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsHeld(true);
    }, 2000); // Hold to drag
    setClickTimer(timer);
  };

  const handleMouseUp = () => {
    clearTimeout(clickTimer);

    // Prevent opening the modal if the task is being dragged
    if (!isHeld && !isDragging) {
      onClick(task); // Only trigger the click handler if not dragging
    }

    setIsHeld(false);
    setIsDragging(false); // reset drag visual state
  };

  const handleClick = (e) => {
    // Prevent the click event from triggering if it's a drag
    if (isDragging) {
      e.stopPropagation(); // Prevent further propagation of the click event
    } else {
      onClick(task); // Proceed with the normal click behavior
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick} // Handle click to ensure it's disabled when dragging
      className={`cursor-grab rounded-xl border border-gray-200 bg-white p-4 shadow hover:shadow-md transition duration-200 ${
        isDragging ? 'scale-95' : ''
      }`}
    >
      <h3 className="font-semibold text-gray-800 text-base">{task.title}</h3>
      {task.description && (
        <p className="mt-1 text-sm text-gray-500">{task.description}</p>
      )}
    </div>
  );
}
