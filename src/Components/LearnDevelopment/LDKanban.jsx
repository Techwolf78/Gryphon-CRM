import { useState, useEffect, useMemo, useRef } from "react";
import { Column } from "../Sales/Column";
import { DndContext } from "@dnd-kit/core";
import { db, ref, get, update, onValue, push } from "../../firebase";
import AddBusinessModal from "../AddCollegeModal";
import TaskDetailModal from "../Sales/TaskDetailModal";

const COLUMNS = [
  { id: "PLANNING", title: "Planning" },
  { id: "PHASE_1", title: "1st Phase" },
  { id: "PHASE_2", title: "2nd Phase" },
  { id: "PHASE_3", title: "3rd Phase" },
  { id: "COMPLETED", title: "Completed" },
];

export default function LDKanban() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const recentlyTransferred = useRef(new Set());
  const [hoveredColumn, setHoveredColumn] = useState(null);

  // Fetch tasks from Firebase
  const fetchTasks = async () => {
    const tasksRef = ref(db, "learning_and_development");
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

  useEffect(() => {
    fetchTasks();

    const tasksRef = ref(db, "learning_and_development");
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

  // Handle task dragging events
  const handleDragOver = (event) => {
    const { over } = event;
    setHoveredColumn(over?.id ?? null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setHoveredColumn(null);
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      updateTaskStatusInDatabase(taskId, newStatus);
      if (newStatus === "COMPLETED") createTaskInPlacement(taskId);
      return updatedTasks;
    });
  };

  // Update task status in Firebase
  const updateTaskStatusInDatabase = (taskId, newStatus) => {
    const taskRef = ref(db, `learning_and_development/${taskId}`);
    update(taskRef, { status: newStatus });
  };

  // Create task in placement after completion
  const createTaskInPlacement = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || recentlyTransferred.current.has(task.projectId)) return;

    recentlyTransferred.current.add(task.projectId);
    const taskRef = ref(db, "placement");
    const newTaskRef = push(taskRef);

    await update(newTaskRef, {
      title: task.title,
      status: "APPLIED",
      projectId: task.projectId,
    });
  };

  // Handle task click to open Task Detail Modal
  const onTaskClick = (task) => setSelectedTask(task);

  // Group tasks by column
  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id);
      return acc;
    }, {});
  }, [tasks]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-3xl font-semibold text-gray-800 mb-6">
        Learning and Development Kanban Board
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-[#008370] text-white font-medium rounded-lg shadow hover:bg-[#006B5D] transition"
        >
          + Add College
        </button>
      </div>

      <AddBusinessModal isOpen={showModal} onClose={() => setShowModal(false)} board="learning_and_development" />
      <TaskDetailModal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        task={selectedTask}
        refreshTasks={fetchTasks} // Pass refreshTasks function to modal
      />

      <div className="flex gap-8">
        <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]}
              isHovered={hoveredColumn === column.id}
              onTaskClick={onTaskClick}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
