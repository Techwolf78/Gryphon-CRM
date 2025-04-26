import { useState, useEffect, useMemo, useRef } from "react";
import { Column } from "../Common/Column";
import { DndContext } from "@dnd-kit/core";
import { db, ref, get, update, onValue, push } from "../../firebase";
import AddBusinessModal from "../Common/AddCollegeModal";
import TaskDetailModal from "../Common/TaskDetailModal";

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

  // Update task status in Firebase
  const updateTaskStatusInDatabase = (taskId, newStatus) => {
    const taskRef = ref(db, `learning_and_development/${taskId}`);
    update(taskRef, { status: newStatus });
  };

  const createTaskInPlacement = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || recentlyTransferred.current.has(task.projectId)) return;
  
    recentlyTransferred.current.add(task.projectId); // prevent double-push
  
    const taskRef = ref(db, "placement");
    const snapshot = await get(taskRef);
    const data = snapshot.val() || {};
  
    const alreadyExists = Object.values(data).some(
      (entry) => entry.projectId === task.projectId
    );
  
    if (alreadyExists) {
      console.log(`🛑 Task with projectId ${task.projectId} already exists in Placement`);
      return;
    }
  
    const newTaskRef = push(taskRef);
    const { id: _, ...taskWithoutId } = task;
  
    await update(newTaskRef, {
      ...taskWithoutId,
      status: "APPLIED",
      category: "placement",
    });
  
    console.log(`✅ Task pushed to Placement`);
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

      <AddBusinessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        board="learning_and_development"
      />
      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        refreshTasks={fetchTasks} // Pass refreshTasks function to modal
        onRefreshTask={refreshTaskInModal}
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
