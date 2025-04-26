import React, { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core"; // Import the draggable hook

export function TaskCard({ task, isOverlay = false, onClick }) {
  const [clickTimer, setClickTimer] = useState(null);
  const [isHeld, setIsHeld] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Using the useDraggable hook from @dnd-kit to make the task draggable
  const { attributes, listeners, setNodeRef, transform, isDragging: dndIsDragging } = useDraggable({
    id: task.id,
  });

  // Update the isDragging state based on whether the task is being dragged
  useEffect(() => {
    setIsDragging(dndIsDragging);
  }, [dndIsDragging]);

  // Styles for the task when dragging or being held
  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition: "transform 0.2s ease", // Smooth transition for drag movement
    opacity: dndIsDragging ? 0.5 : 1, // Reduce opacity when dragging
    zIndex: dndIsDragging ? 1000 : 1, // Ensure the dragged card is on top
    ...(isOverlay && {
      boxShadow: "0 0 10px rgba(0,0,0,0.2)", // Add shadow for drag overlay
      scale: "1.05", // Slightly scale the task during overlay
    }),
  };

  // Handle mouse down event to detect long presses
  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsHeld(true); // Set isHeld to true after 2 seconds of holding
    }, 2000);
    setClickTimer(timer); // Store the timer reference
  };

  // Handle mouse up event to stop holding and trigger the click
  const handleMouseUp = () => {
    clearTimeout(clickTimer); // Clear the timer if mouse up happens before hold time
    if (!isHeld && !isDragging) {
      onClick(task); // Trigger the onClick if it's not a drag
    }

    setIsHeld(false);
    setIsDragging(false); // Reset dragging visual state
  };

  // Prevent click propagation if dragging
  const handleClick = (e) => {
    if (isDragging) {
      e.stopPropagation(); // Prevent further click events from propagating
    } else {
      onClick(task); // Normal click behavior when not dragging
    }
  };

  return (
    <div
      ref={setNodeRef} // Attach the draggable reference to this div
      {...listeners} // Spread the listeners (dragging events) here
      {...attributes} // Spread the attributes for draggable behavior
      style={style} // Apply dynamic styles based on dragging state
      onMouseDown={handleMouseDown} // Detect mouse hold
      onMouseUp={handleMouseUp} // Handle mouse release
      onClick={handleClick} // Prevent click if dragging
      className={`cursor-grab rounded-xl border border-gray-200 bg-white p-4 shadow hover:shadow-md transition duration-200 ${
        isDragging ? "scale-95" : "" // Shrink the task slightly when dragging
      }`}
    >
      <h3 className="font-semibold text-gray-800 text-base">{task.title}</h3>


            {/* Display the mou_fy value in a small text below the description */}
            {task.mou_fy && (
        <p className="mt-2 text-[10px] text-gray-700">{task.mou_fy}</p>
      )}
    </div>
  );
}
