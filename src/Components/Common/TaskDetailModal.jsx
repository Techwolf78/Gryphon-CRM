import React, { useState, useEffect } from 'react';
import { db, ref, update, get } from '../../firebase';
import { FiRefreshCw } from 'react-icons/fi';

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
      const [taskKey, matchedTask] = dataEntries.find(
        ([, item]) => item.projectId === task.projectId
      ) || [];

      // Using matchedTask for any necessary logic
      if (matchedTask) {
        // You can use matchedTask here for any logic or debugging purposes
        console.log("Matched Task:", matchedTask); // Example: logging it
      }

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

  const renderStatusField = () => (
    <div>
      <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
      {isEditing ? (
        <select
          value={editedTask.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full p-2 mt-1 rounded border dark:bg-gray-700 dark:text-white"
        >
          <option value="COLD">COLD</option>
          <option value="WARM">WARM</option>
          <option value="ON_CALL">ON_CALL</option>
          <option value="PLANNING">PLANNING</option>
          <option value="PHASE_1">PHASE_1</option>
          <option value="PHASE_2">PHASE_2</option>
          <option value="PHASE_3">PHASE_3</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="APPLIED">APPLIED</option>
          <option value="INTERVIEWED">INTERVIEWED</option>
          <option value="OFFERED">OFFERED</option>
          <option value="PLACED">PLACED</option>
        </select>
      ) : (
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
          {renderStatusField()}
          {renderField("Project ID", "projectId")}
          {renderField("Address", "address")}
          {renderField("Point of Contact", "poc_name")}
          {renderField("Phone No", "phone_no")}
          {renderField("Student Count", "std_count", false, true)}
          {renderField("Cost per Student", "cost_per_std", true, true)}
          {renderField("Total Contract Value", "total_contract_value", true, true)}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-8">
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
