import { useState, useEffect, useMemo } from 'react';
import { Column } from '../Sales/Column'; // Assuming you have the Column component for each task column
import { DndContext } from '@dnd-kit/core';
import { db, ref, get, update, onValue, push } from '../../firebase';

const COLUMNS = [
  { id: 'BEGINNER', title: 'Beginner' },
  { id: 'INTERMEDIATE', title: 'Intermediate' },
  { id: 'ADVANCED', title: 'Advanced' },
  { id: 'COMPLETED', title: 'Completed' },
];

export default function LDKanban() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksRef = ref(db, 'learning_and_development');
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
    const tasksRef = ref(db, 'learning_and_development');
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

      // Check if the task was moved to the "COMPLETED" column in LDKanban
      if (newStatus === 'COMPLETED') {
        // Add the task to the Placement Kanban Board (APPLIED column)
        createTaskInPlacement(taskId);
      }

      return updatedTasks;
    });
  }

  // Update task status in Realtime Database
  const updateTaskStatusInDatabase = (taskId, newStatus) => {
    const taskRef = ref(db, `learning_and_development/${taskId}`);
    update(taskRef, {
      status: newStatus,
    });
  };

  // Function to create the task in the Placement Kanban Board
  const createTaskInPlacement = async (taskId) => {
    const taskRef = ref(db, 'placement');
    const newTaskRef = push(taskRef);
    const task = tasks.find((t) => t.id === taskId);
    await update(newTaskRef, {
      title: task.title,
      status: 'APPLIED', // Add task to the "APPLIED" column in Placement Kanban
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
        Learning and Development Kanban Board
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
