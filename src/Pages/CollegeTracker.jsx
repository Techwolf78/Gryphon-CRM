import { useState, useEffect } from "react";
import { db, ref, get } from "../firebase";
import { findTaskByProjectId } from "../utils/projectUtils";

const STAGES = [
  { label: "Sales", path: "sales" },
  { label: "Learning & Development", path: "learning_and_development" },
  { label: "Placement", path: "placement" },
];

export default function CollegeTracker() {
  const [projectId, setProjectId] = useState("");
  const [data, setData] = useState([]);
  const [allProjectIds, setAllProjectIds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllProjectIds = async () => {
      const nodes = ["sales", "learning_and_development", "placement"];
      let ids = new Set();

      for (const node of nodes) {
        const snapshot = await get(ref(db, node));
        if (snapshot.exists()) {
          const tasks = Object.values(snapshot.val());
          tasks.forEach((task) => {
            if (task.projectId) {
              ids.add(task.projectId.toUpperCase());
            }
          });
        }
      }

      setAllProjectIds(Array.from(ids).sort());
    };

    fetchAllProjectIds();
  }, []);

  const handleSearch = async () => {
    setError("");
    setData([]);

    const results = await Promise.all(
      STAGES.map(async (stage) => {
        const task = await findTaskByProjectId(stage.path, projectId);
        return task ? { stage: stage.label, status: task.status } : null;
      })
    );

    const filteredResults = results.filter((item) => item !== null);

    if (filteredResults.length === 0) {
      setError("❌ Project ID not found in any stage.");
    } else {
      setData(filteredResults);
    }
  };

  const clearInput = () => {
    setProjectId("");
    setData([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 p-8 flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Track College by Project ID
        </h2>

{/* Project ID Input with Clear Button (outside input) */}
<div className="mb-6 flex items-center gap-2">
  <div className="relative w-full">
    <input
      list="project-ids"
      value={projectId}
      onChange={(e) => setProjectId(e.target.value.toUpperCase())}
      placeholder="Select or enter Project ID"
      className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none text-lg"
    />
    <datalist id="project-ids">
      {allProjectIds.map((id) => (
        <option key={id} value={id} />
      ))}
    </datalist>
  </div>

  {projectId && (
    <button
      onClick={clearInput}
      title="Clear input"
      className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-full text-3xl font-bold focus:outline-none transition transform hover:scale-110"
    >
      &times;
    </button>
  )}
</div>


        {/* Track Progress Button */}
        <button
          onClick={handleSearch}
          className="w-full px-6 py-3 bg-[#008370] text-white rounded-lg shadow-md transform transition duration-300 hover:bg-[#006B5D] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
        >
          Track Progress
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-6 text-center text-red-600 font-semibold">
            {error}
          </div>
        )}

        {/* Results Table */}
        {data.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100 text-gray-800 font-medium">
                <tr>
                  <th className="text-left px-6 py-3 border-b">Stage</th>
                  <th className="text-left px-6 py-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-indigo-50 transition duration-200"
                  >
                    <td className="px-6 py-3 border-b font-medium text-gray-700">
                      {item.stage}
                    </td>
                    <td className="px-6 py-3 border-b text-lg text-green-600">
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
