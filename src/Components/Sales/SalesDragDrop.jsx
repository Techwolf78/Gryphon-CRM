import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { fetchTasks, saveTask, updateTaskStatus } from '../../firebase';

// Task Component
const Task = ({ task, index, columnId, moveTask, removeTaskFromColumn }) => {
  const [, drag] = useDrag(() => ({
    type: 'TASK',
    item: { task, index, columnId },
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        removeTaskFromColumn(index, columnId);
      }
    },
  }));

  return (
    <div
      ref={drag}
      className="bg-blue-200 p-4 mb-2 rounded cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
    >
      {task.name}
    </div>
  );
};

// Column Component
const Column = ({ title, tasks, columnId, moveTask, removeTaskFromColumn, addTaskToColumn }) => {
  const [, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item, monitor) => {
      const { index, columnId: sourceColumnId } = item;
      if (sourceColumnId !== columnId) {
        moveTask(index, columnId, sourceColumnId); // Pass both source and target column IDs
        item.columnId = columnId;
      }
    },
  }));

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState('');

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
  };

  const handleSaveTask = async () => {
    if (newTask.trim()) {
      const newTaskId = await addTaskToColumn(newTask, columnId);
      setNewTask('');
      setIsAddingTask(false);
    }
  };

  const handleCancelTask = () => {
    setNewTask('');
    setIsAddingTask(false);
  };

  return (
    <div
      ref={drop}
      className="flex flex-col p-4 border rounded-lg w-1/3 bg-gray-100 overflow-y-auto max-h-[80vh]"
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {tasks.map((task, index) => (
        <Task
          key={index}
          index={index}
          task={task}
          columnId={columnId}
          moveTask={moveTask}
          removeTaskFromColumn={removeTaskFromColumn}
        />
      ))}
      {!isAddingTask && (
        <button
          onClick={handleAddTaskClick}
          className="bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600 transition-all duration-200"
        >
          Add Task
        </button>
      )}
      {isAddingTask && (
        <div className="mt-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="p-2 border rounded w-full mb-2"
            placeholder="Enter task name"
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSaveTask}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-200"
            >
              Save
            </button>
            <button
              onClick={handleCancelTask}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main SalesDragDrop Component
const SalesDragDrop = () => {
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  // Fetch tasks from Firebase on mount
  useEffect(() => {
    const loadTasks = async () => {
      const tasks = await fetchTasks();
      setTodoTasks(tasks.TODO);
      setInProgressTasks(tasks.IN_PROGRESS);
      setDoneTasks(tasks.DONE);
    };
    loadTasks();
  }, []);

  const moveTask = async (fromIndex, toColumnId, fromColumnId) => {
    let task;
    let fromColumn, toColumn;

    // Determine the source and destination columns
    if (fromColumnId === 'TODO') {
      task = todoTasks[fromIndex];
      fromColumn = todoTasks;
      toColumn = getColumn(toColumnId);
    } else if (fromColumnId === 'IN_PROGRESS') {
      task = inProgressTasks[fromIndex];
      fromColumn = inProgressTasks;
      toColumn = getColumn(toColumnId);
    } else if (fromColumnId === 'DONE') {
      task = doneTasks[fromIndex];
      fromColumn = doneTasks;
      toColumn = getColumn(toColumnId);
    }

    // Update the task in Firebase
    await updateTaskStatus(task.name, toColumnId);  // We pass the task name to update its details

    // Update the local state for both columns
    setFromColumn(fromColumn.filter((_, idx) => idx !== fromIndex));
    setToColumn([...toColumn, task]);
  };

  const getColumn = (columnId) => {
    switch (columnId) {
      case 'TODO':
        return todoTasks;
      case 'IN_PROGRESS':
        return inProgressTasks;
      case 'DONE':
        return doneTasks;
      default:
        return [];
    }
  };

  const removeTaskFromColumn = (index, columnId) => {
    switch (columnId) {
      case 'TODO':
        setTodoTasks((prevTasks) => prevTasks.filter((_, idx) => idx !== index));
        break;
      case 'IN_PROGRESS':
        setInProgressTasks((prevTasks) => prevTasks.filter((_, idx) => idx !== index));
        break;
      case 'DONE':
        setDoneTasks((prevTasks) => prevTasks.filter((_, idx) => idx !== index));
        break;
      default:
        return;
    }
  };

  const addTaskToColumn = async (task, columnId) => {
    const newTaskId = await saveTask(task, columnId);

    const newTask = {
      name: task,
      columnId: columnId,
      status: columnId,
    };

    if (columnId === 'TODO') {
      setTodoTasks((prevTasks) => [...prevTasks, newTask]);
    } else if (columnId === 'IN_PROGRESS') {
      setInProgressTasks((prevTasks) => [...prevTasks, newTask]);
    } else if (columnId === 'DONE') {
      setDoneTasks((prevTasks) => [...prevTasks, newTask]);
    }

    return newTaskId;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-between gap-4 p-4">
        <Column
          title="To Do"
          tasks={todoTasks}
          columnId="TODO"
          moveTask={moveTask}
          removeTaskFromColumn={removeTaskFromColumn}
          addTaskToColumn={addTaskToColumn}
        />
        <Column
          title="In Progress"
          tasks={inProgressTasks}
          columnId="IN_PROGRESS"
          moveTask={moveTask}
          removeTaskFromColumn={removeTaskFromColumn}
          addTaskToColumn={addTaskToColumn}
        />
        <Column
          title="Done"
          tasks={doneTasks}
          columnId="DONE"
          moveTask={moveTask}
          removeTaskFromColumn={removeTaskFromColumn}
          addTaskToColumn={addTaskToColumn}
        />
      </div>
    </DndProvider>
  );
};

export default SalesDragDrop;
