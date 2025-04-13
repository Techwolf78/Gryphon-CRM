import { useState, useEffect, useRef } from "react";
import { db, ref, get, push, update } from "../firebase";
import { generateProjectId } from "../utils/idGenerator";

const BOARDS = {
  sales: ["COLD", "WARM", "ON_CALL", "CLOSED"],
  learning_and_development: [
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
    "COMPLETED",
  ],
  placement: ["APPLIED", "INTERVIEWED", "OFFERED", "PLACED"],
};

const normalize = (str) => str.replace(/\s+/g, "").toLowerCase();

export default function AddCollegeModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [board, setBoard] = useState("sales");
  const [status, setStatus] = useState("COLD");

  const [checking, setChecking] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const [allNormalizedNames, setAllNormalizedNames] = useState([]);

  const debounceRef = useRef(null);

  // Fetch existing names when modal opens
  useEffect(() => {
    const fetchNames = async () => {
      const allNodes = Object.keys(BOARDS);
      let allNames = [];

      for (const node of allNodes) {
        const snapshot = await get(ref(db, node));
        if (snapshot.exists()) {
          const data = snapshot.val();
          Object.values(data).forEach((task) => {
            if (task.title) {
              allNames.push(normalize(task.title));
            }
          });
        }
      }

      setAllNormalizedNames(allNames);
    };

    if (isOpen) fetchNames();
  }, [isOpen]);

  // Realtime validation with debounce
  useEffect(() => {
    if (!title.trim()) {
      setNameExists(false);
      return;
    }

    setChecking(true);
    setNameExists(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const isDuplicate = allNormalizedNames.includes(normalize(title));
      setNameExists(isDuplicate);
      setChecking(false);
    }, 500);
  }, [title, allNormalizedNames]);

  const handleAddCollege = async () => {
    if (!title.trim() || nameExists) return;

    const projectId = generateProjectId(title, allNormalizedNames);
    const newTaskRef = push(ref(db, board));

    await update(newTaskRef, {
      title,
      status,
      projectId,
    });

    onClose();
    setTitle("");
    setBoard("sales");
    setStatus("COLD");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New College
        </h2>

        {/* College Name Input */}
        <div className="mb-5 relative">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            College Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Pune University"
            className={`w-full pr-10 px-4 py-2 border text-gray-800 rounded-lg outline-none transition ring-2 ${
              nameExists
                ? "border-red-500 ring-red-100"
                : "border-gray-300 ring-transparent focus:ring-indigo-200"
            }`}
          />

          {/* Spinner / Check / Cross */}
          <div className="absolute top-10 right-3">
            {checking ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" />
            ) : title.trim() ? (
              nameExists ? (
                <button
                  type="button"
                  onClick={() => setTitle("")}
                  className="text-gray-600 hover:text-black transition"
                  title="Clear and enter a different name"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )
            ) : null}
          </div>

          {nameExists && (
            <p className="text-sm mt-2 text-red-600">
              College name already exists.
            </p>
          )}
        </div>

        {/* Selects */}
        <div className="mb-6 flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Board
            </label>
            <select
              value={board}
              onChange={(e) => {
                setBoard(e.target.value);
                setStatus(BOARDS[e.target.value][0]);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {Object.keys(BOARDS).map((key) => (
                <option key={key} value={key}>
                  {key.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {BOARDS[board].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleAddCollege}
            disabled={!title.trim() || nameExists}
            className={`px-5 py-2.5 rounded-lg text-white font-medium transition ${
              !title.trim() || nameExists
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Add College
          </button>

          <button
            onClick={onClose}
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
