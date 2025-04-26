import { useState, useEffect, useMemo, useRef } from "react";
import { Column } from "../Common/Column";
import { DndContext } from "@dnd-kit/core";
import { db, ref, get, update, onValue, push } from "../../firebase";
import AddBusinessModal from "../Common/AddCollegeModal";
import TaskDetailModal from "../Common/TaskDetailModal"; // 👈 Import new modal

const COLUMNS = [
  { id: "APPLIED", title: "Applied" },
  { id: "INTERVIEWED", title: "Interviewed" },
  { id: "OFFERED", title: "Offered" },
  { id: "PLACED", title: "Placed" },
];

export default function PlacementKanban() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const recentlyTransferred = useRef(new Set()); // ✅ Now actively used

  // Fetch tasks from Firebase
  const fetchTasks = async () => {
    const tasksRef = ref(db, "placement");
    const snapshot = await get(tasksRef);

    if (snapshot.exists()) {
      const tasksData = snapshot.val();
      const formattedTasks = Object.keys(tasksData).map((taskId) => ({
        id: taskId,
        ...tasksData[taskId],
      }));
      setTasks(formattedTasks);
    } else {
      console.log("No tasks found in Firebase");
    }
  };

  useEffect(() => {
    fetchTasks();

    const tasksRef = ref(db, "placement");
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

      // ✅ Create completed placement entry if moved to PLACED
      if (newStatus === "PLACED") {
        createTaskInCompletedPlacement(taskId);
      }

      return updatedTasks;
    });
  };

  const updateTaskStatusInDatabase = (taskId, newStatus) => {
    const taskRef = ref(db, `placement/${taskId}`);
    update(taskRef, {
      status: newStatus,
    });
  };

  const createTaskInCompletedPlacement = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || recentlyTransferred.current.has(task.projectId)) return;
  
    recentlyTransferred.current.add(task.projectId); // ⛔ no double pushing
  
    const taskRef = ref(db, "completed_placements");
    const snapshot = await get(taskRef);
    const data = snapshot.val() || {};
  
    const alreadyExists = Object.values(data).some(
      (entry) => entry.projectId === task.projectId
    );
  
    if (alreadyExists) {
      console.log(`🛑 Task with projectId ${task.projectId} already exists in Completed Placements`);
      return;
    }
  
    const { id: _, ...taskWithoutId } = task;
  
    const completedRef = push(taskRef);
    await update(completedRef, {
      ...taskWithoutId,
      placedAt: new Date().toISOString(),
    });
  
    console.log(`✅ Task pushed to Completed Placements`);
  };
  
  
  

  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id);
      return acc;
    }, {});
  }, [tasks]);

  const onTaskClick = (task) => {
    setSelectedTask(task);
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-3xl font-semibold text-gray-800 mb-6">
        Placement Kanban Board
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-[#008370] text-white font-medium rounded-lg shadow hover:bg-[#006B5D] transition"
        >
          + Add College
        </button>
      </div>

      <AddBusinessModal isOpen={showModal} onClose={() => setShowModal(false)} board="placement" />

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        refreshTasks={fetchTasks}
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
