import { useState, useEffect, useMemo, useRef } from "react";
import { Column } from "../Common/Column";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { db, ref, get, update, onValue, push } from "../../firebase";
import AddBusinessModal from "../Common/AddCollegeModal";
import TaskDetailModal from "../Common/TaskDetailModal";
import { TaskCard } from "../Common/TaskCard"; // ✅ keep named import

const COLUMNS = [
  { id: "COLD", title: "Cold" },
  { id: "WARM", title: "Warm" },
  { id: "ON_CALL", title: "On Call" },
  { id: "CLOSED", title: "Closed" },
];

export default function SalesKanban() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const recentlyTransferred = useRef(new Set());
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const fetchTasks = async () => {
    const tasksRef = ref(db, "sales");
    const snapshot = await get(tasksRef);
    if (snapshot.exists()) {
      const tasksData = snapshot.val();
      const formattedTasks = Object.keys(tasksData).map((taskId) => ({
        id: taskId,
        ...tasksData[taskId],
        category: "sales",
      }));
      setTasks(formattedTasks);
    }
  };

  useEffect(() => {
    fetchTasks();

    const tasksRef = ref(db, "sales");
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const tasksData = snapshot.val();
        const formattedTasks = Object.keys(tasksData).map((taskId) => ({
          id: taskId,
          ...tasksData[taskId],
          category: "sales",
        }));
        setTasks(formattedTasks);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshTaskInModal = async (task) => {
    if (!task?.category || !task?.projectId) return;

    const categoryRef = ref(db, task.category);
    const snapshot = await get(categoryRef);
    const data = snapshot.val();

    if (!data || !Array.isArray(data)) {
      alert("Invalid data structure in database.");
      return;
    }

    const updated = data.find((item) => item.projectId === task.projectId);
    if (!updated) {
      alert("Task not found.");
      return;
    }

    setSelectedTask({ ...updated, category: task.category });
  };

  const handleDragOver = (event) => {
    const { over } = event;
    setHoveredColumn(over?.id || null);
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

      if (newStatus === "CLOSED") createTaskInLearningAndDevelopment(taskId);

      return updatedTasks;
    });
  };

  const updateTaskStatusInDatabase = (taskId, newStatus) => {
    const taskRef = ref(db, `sales/${taskId}`);
    update(taskRef, { status: newStatus });
  };

  const createTaskInLearningAndDevelopment = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || recentlyTransferred.current.has(task.projectId)) return;

    recentlyTransferred.current.add(task.projectId);

    const taskRef = ref(db, "learning_and_development");
    const snapshot = await get(taskRef);
    const data = snapshot.val() || {};

    const alreadyExists = Object.values(data).some(
      (entry) => entry.projectId === task.projectId
    );

    if (alreadyExists) {
      console.log(`🛑 Task with projectId ${task.projectId} already exists in L&D`);
      return;
    }

    const newTaskRef = push(taskRef);
    const { id: _, ...taskWithoutId } = task;

    await update(newTaskRef, {
      ...taskWithoutId,
      status: "PLANNING",
      category: "learning_and_development",
    });

    console.log(`✅ Task pushed to L&D`);
  };

  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id);
      return acc;
    }, {});
  }, [tasks]);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="text-3xl font-bold text-[#000000] mb-6">Sales Kanban Board</div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-[#008370] text-white font-medium rounded-lg shadow hover:bg-[#006B5D] transition"
        >
          + Add College
        </button>
      </div>

      <AddBusinessModal isOpen={showModal} onClose={() => setShowModal(false)} board="sales" />

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        refreshTasks={fetchTasks}
        onRefreshTask={refreshTaskInModal}
      />

      <DndContext
        collisionDetection={closestCenter} // ✅ use closestCenter
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]}
              isHovered={hoveredColumn === column.id}
              brandColor="#008370"
              onTaskClick={(task) => setSelectedTask(task)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
