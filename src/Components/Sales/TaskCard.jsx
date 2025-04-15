// TaskCard.jsx
import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';

export function TaskCard({ task, onClick }) {
  const [isDragging, setIsDragging] = useState(false);
  const [clickTimer, setClickTimer] = useState(null);
  const [isHeld, setIsHeld] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        transition: 'transform 0.2s ease',
      }
    : undefined;

  useEffect(() => {
    if (isHeld) {
      setIsDragging(true); // Enable dragging after 2 seconds
    }
  }, [isHeld]);

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsHeld(true); // Start dragging if held for 2 seconds
    }, 2000);
    setClickTimer(timer);
  };

  const handleMouseUp = () => {
    clearTimeout(clickTimer);
    if (!isHeld) {
      onClick(task); // Open detail drawer on click
    }
    setIsHeld(false); // Reset on release
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="cursor-grab rounded-xl border border-gray-200 bg-white p-4 shadow hover:shadow-md transition"
    >
      <h3 className="font-semibold text-gray-800 text-base">{task.title}</h3>
      {task.description && (
        <p className="mt-1 text-sm text-gray-500">{task.description}</p>
      )}
    </div>
  );
}
