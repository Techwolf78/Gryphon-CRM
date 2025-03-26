import { useState, useEffect, useMemo } from 'react';
import { Column } from '../Sales/Column'; // Assuming you have the Column component for each task column
import { DndContext } from '@dnd-kit/core';
import { db, ref, get, update, onValue } from '../../firebase';

const COLUMNS = [
  { id: 'APPLIED', title: 'Applied' },
  { id: 'INTERVIEWED', title: 'Interviewed' },
  { id: 'OFFERED', title: 'Offered' },
  { id: 'PLACED', title: 'Placed' },
];

export default function PlacementKanban() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksRef = ref(db, 'placement');
      const snapshot = await get(tasksRef);

      if (snapshot.exists()) {
        const tasksData = snapshot.val();
        const formattedTasks = Object.keys(tasksData).map((taskId) => ({
          id: taskId,
          ...tasksData[taskId],
        }));
        setTasks(formattedTasks);
      } else {
        console.log('No tasks found in Firebase');
      }
    };

    fetchTasks();

    // Real-time listener for task updates
    const tasksRef = ref(db, 'placement');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const tasksData = snapshot.val();
        const formattedTasks = Object.keys(tasksData).map((taskId) => ({
          id: taskId,
          ...tasksData[taskId],
        }));
        setTasks(formattedTasks);
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Handle the drag-and-drop event and update Realtime Database
  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      // Update Realtime Database with the new status
      updateTaskStatusInDatabase(taskId, newStatus);
      return updatedTasks;
    });
  }

  // Update task status in Realtime Database
  const updateTaskStatusInDatabase = (taskId, newStatus) => {
    const taskRef = ref(db, `placement/${taskId}`);
    update(taskRef, {
      status: newStatus,
    });
  };

  // Memoize tasks for each column to optimize performance
  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id);
      return acc;
    }, {});
  }, [tasks]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Heading */}
      <div className="text-3xl font-semibold text-gray-800 mb-6">
        Placement Kanban Board
      </div>

      <div className="flex gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]} // Only pass the filtered tasks for the specific column
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
