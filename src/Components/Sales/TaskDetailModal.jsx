import React from 'react';

export default function TaskDetailModal({ isOpen, onClose, task }) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-3xl shadow-lg transform transition-all duration-500 ease-in-out ">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">College Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-300">Title:</span>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">{task.title}</p>
          </div>
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
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-300">Project ID:</span>
            <p className="text-lg text-gray-800 dark:text-white">{task.projectId}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-300">Address:</span>
            <p className="text-lg text-gray-800 dark:text-white">{task.address}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-300">Point of Contact:</span>
            <p className="text-lg text-gray-800 dark:text-white">{task.poc_name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-300">Phone No:</span>
            <p className="text-lg text-gray-800 dark:text-white">{task.phone_no}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-300">Student Count:</span>
            <p className="text-lg text-gray-800 dark:text-white">{task.std_count}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-300">Cost per Student:</span>
            <p className="text-lg text-gray-800 dark:text-white">₹{task.cost_per_std}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-300">Total Contract Value:</span>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">₹{task.total_contract_value}</p>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#008370] to-[#006B5D] text-white rounded-full shadow-md hover:from-[#006B5D] hover:to-[#008370] focus:outline-none transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
