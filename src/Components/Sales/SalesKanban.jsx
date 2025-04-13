import { useState, useEffect, useMemo, useRef } from "react";
import { Column } from "../Sales/Column";
import { DndContext } from "@dnd-kit/core";
import { db, ref, get, update, onValue, push } from "../../firebase";
import AddCollegeModal from "../AddCollegeModal";

const COLUMNS = [
  { id: "COLD", title: "Cold" },
  { id: "WARM", title: "Warm" },
  { id: "ON_CALL", title: "On Call" },
  { id: "CLOSED", title: "Closed" },
];

export default function SalesKanban() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const recentlyTransferred = useRef(new Set());
  const [hoveredColumn, setHoveredColumn] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksRef = ref(db, "sales");
      const snapshot = await get(tasksRef);

      if (snapshot.exists()) {
        const tasksData = snapshot.val();
        const formattedTasks = Object.keys(tasksData).map((taskId) => ({
          id: taskId,
          ...tasksData[taskId],
        }));
        setTasks(formattedTasks);
      }
    };

    fetchTasks();

    const tasksRef = ref(db, "sales");
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

  const handleDragOver = (event) => {
    const { over } = event;
    if (over) {
      setHoveredColumn(over.id);
    } else {
      setHoveredColumn(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    // Clear hovered column state after drag ends
    setHoveredColumn(null);
  
    // If dropped outside any column, do nothing
    if (!over) return;
  
    const taskId = active.id;
    const newStatus = over.id;
  
    // Only update if the status actually changed
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
  
      // Update in database
      updateTaskStatusInDatabase(taskId, newStatus);
  
      // If task moved to CLOSED, create corresponding placement entry
      if (newStatus === "CLOSED") {
        createTaskInPlacement(taskId);
      }
  
      return updatedTasks;
    });
  };
  

  const updateTaskStatusInDatabase = (taskId, newStatus) => {
    const taskRef = ref(db, `sales/${taskId}`);
    update(taskRef, { status: newStatus });
  };

  const createTaskInPlacement = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (recentlyTransferred.current.has(task.projectId)) return;

    recentlyTransferred.current.add(task.projectId);

    const taskRef = ref(db, "learning_and_development");
    const newTaskRef = push(taskRef);
    await update(newTaskRef, {
      title: task.title,
      status: "BEGINNER",
      projectId: task.projectId,
    });
  };

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

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700"
        >
          Add College
        </button>
      </div>

      <AddCollegeModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="flex gap-8">
      <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
  {COLUMNS.map((column) => (
    <Column
      key={column.id}
      column={column}
      tasks={tasksByColumn[column.id]}
      isHovered={hoveredColumn === column.id}
    />
  ))}
</DndContext>

      </div>
    </div>
  );
}
