import { useState, useEffect, useMemo } from 'react';
import { Column } from './Column';
import { DndContext } from '@dnd-kit/core';
import { db, ref, get, update, push, onValue } from '../../firebase';

const COLUMNS = [
  { id: 'COLD', title: 'Cold' },
  { id: 'WARM', title: 'Warm' },
  { id: 'ON_CALL', title: 'On Call' },
  { id: 'CLOSED', title: 'Closed' },
];

export default function SalesKanban() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksRef = ref(db, 'sales');
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

    const tasksRef = ref(db, 'sales');
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
      updateTaskStatusInDatabase(taskId, newStatus);

      // Check if the task is moved to the last column (CLOSED)
      if (newStatus === 'CLOSED') {
        // Check if the task already exists in Learning and Development before adding it
        checkIfTaskExistsInLD(taskId);
      }

      return updatedTasks;
    });
  }

  // Update task status in Realtime Database
  const updateTaskStatusInDatabase = (taskId, newStatus) => {
    const taskRef = ref(db, `sales/${taskId}`);
    update(taskRef, {
      status: newStatus,
    });
  };

  // Check if task already exists in Learning and Development
  const checkIfTaskExistsInLD = async (taskId) => {
    const tasksRef = ref(db, 'learning_and_development');
    const snapshot = await get(tasksRef);
    const tasksData = snapshot.val();

    const task = tasks.find((t) => t.id === taskId);

    // Check if the task already exists in L&D
    const taskExists = Object.keys(tasksData).some((key) => tasksData[key].title === task.title);

    if (!taskExists) {
      createTaskInLearningAndDevelopment(taskId);
    } else {
      console.log(`Task '${task.title}' already exists in Learning and Development.`);
    }
  };

  // Create the task in Learning and Development if it doesn't already exist
  const createTaskInLearningAndDevelopment = async (taskId) => {
    const taskRef = ref(db, 'learning_and_development');
    const newTaskRef = push(taskRef);
    const task = tasks.find((t) => t.id === taskId);
    await update(newTaskRef, {
      title: task.title,
      status: 'BEGINNER',
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
      <div className="text-3xl font-semibold text-gray-800 mb-6">
        Sales Kanban Board
      </div>

      <div className="flex gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
