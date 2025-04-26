import React, { useState, useEffect } from 'react';
import { db, ref, update, get, remove } from '../../firebase';
import { FiRefreshCw } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

export default function TaskDetailModal({ isOpen, onClose, task, refreshTasks, onRefreshTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    setEditedTask(task);
    setIsEditing(false);
  }, [task]);

  if (!isOpen || !task) return null;

  const handleEditToggle = () => setIsEditing(true);

  const handleChange = (field, value) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (!task.category) {
        alert("Task is missing category information.");
        return;
      }

      const categoryRef = ref(db, `${task.category}`);
      const snapshot = await get(categoryRef);
      const data = snapshot.val();

      if (!data || typeof data !== 'object') {
        alert("Invalid data structure in database.");
        return;
      }

      const dataEntries = Object.entries(data);
      const [taskKey] = dataEntries.find(
        ([, item]) => item.projectId === task.projectId
      ) || [];

      if (!taskKey) {
        alert("Task not found in the selected category.");
        return;
      }

      const taskRef = ref(db, `${task.category}/${taskKey}`);
      await update(taskRef, editedTask);
      if (refreshTasks) await refreshTasks();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task.');
    }
  };

  const handleRefreshModal = async () => {
    if (onRefreshTask && task) {
      await onRefreshTask(task);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the college "${task.title}"? This action is irreversible.`
    );
    if (!confirmDelete) return;

    try {
      const categoryRef = ref(db, `${task.category}`);
      const snapshot = await get(categoryRef);
      const data = snapshot.val();

      const dataEntries = Object.entries(data);
      const [taskKey] = dataEntries.find(
        ([, item]) => item.projectId === task.projectId
      ) || [];

      if (!taskKey) {
        alert("Task not found in the selected category.");
        return;
      }

      const taskRef = ref(db, `${task.category}/${taskKey}`);
      await remove(taskRef);
      if (refreshTasks) await refreshTasks();
      onClose();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete the task.");
    }
  };

  const renderField = (label, field, isCurrency = false, isNumber = false) => (
    <div>
      <span className="font-medium text-gray-600 dark:text-gray-300">{label}:</span>
      {isEditing ? (
        <input
          type={isNumber ? 'number' : 'text'}
          value={editedTask[field] || ''}
          onChange={(e) => handleChange(field, isNumber ? +e.target.value : e.target.value)}
          className="w-full p-2 mt-1 rounded border dark:bg-gray-700 dark:text-white"
        />
      ) : (
        <p className={`text-lg ${isCurrency ? 'font-semibold' : ''} text-gray-800 dark:text-white`}>
          {isCurrency ? `₹${task[field]}` : task[field]}
        </p>
      )}
    </div>
  );

  // Remove Status editing functionality, always show it as read-only
  const renderStatusField = () => (
    <div>
      <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
      <p
        className={`text-lg font-semibold ${
          task.status === 'COMPLETED'
            ? 'text-green-500'
            : task.status === 'PLACED'
            ? 'text-blue-500'
            : task.status === 'OFFERED'
            ? 'text-orange-500'
            : 'text-gray-800'
        } dark:text-white`}
      >
        {task.status}
      </p>
    </div>
  );

  // Add the Program Type field rendering here
  const renderProgramTypeField = () => (
    <div>
      <span className="font-medium text-gray-600 dark:text-gray-300">Program Type:</span>
      {isEditing ? (
        <input
          type="text"
          value={editedTask.programType || ''}
          onChange={(e) => handleChange('programType', e.target.value)}
          className="w-full p-2 mt-1 rounded border dark:bg-gray-700 dark:text-white"
        />
      ) : (
        <p className="text-lg text-gray-800 dark:text-white">{task.programType}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-3xl shadow-lg relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">College Details</h2>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleRefreshModal}
              title="Refresh"
              className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FiRefreshCw className="text-xl text-gray-600 dark:text-white" />
            </button>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {renderField("College Name", "title")}
          {renderStatusField()} {/* Status is now read-only */}
          {renderField("Project ID", "projectId")}
          {renderField("Address", "address")}
          {renderField("Point of Contact", "pocName")}
          {renderField("Phone No", "phone")}
          {renderField("Student Count", "std_count", false, true)}
          {renderField("Cost per Student", "cost_per_std", true, true)}
          {renderField("Total Contract Value", "totalContractValue", true, true)}
          {renderProgramTypeField()} {/* Program Type field */}
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-between items-center mt-8">
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 hover:bg-red-700 hover:text-white text-red-600 rounded-full  transition"
          >
            <FaTrash /> Delete
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#008370] to-[#006B5D] text-white rounded-full shadow-md hover:from-[#006B5D] hover:to-[#008370] transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
