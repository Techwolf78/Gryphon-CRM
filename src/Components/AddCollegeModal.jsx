import { useState, useEffect, useRef } from "react";
import { db, ref, get, push, update } from "../firebase";
import { generateProjectId } from "../utils/idGenerator";

const normalize = (str) => str.replace(/\s+/g, "").toLowerCase();

export default function AddBusinessModal({ isOpen, onClose, board = "sales" }) {
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [pocName, setPocName] = useState("");
  const [phone, setPhone] = useState("");
  const [hasStudentCount, setHasStudentCount] = useState(null);
  const [studentCount, setStudentCount] = useState("");
  const [costPerStudent, setCostPerStudent] = useState("");
  const [manualTCV, setManualTCV] = useState("");

  const [checking, setChecking] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const [allNormalizedNames, setAllNormalizedNames] = useState([]);

  const debounceRef = useRef(null);

  const defaultStatus = {
    sales: "COLD",
    learning_and_development: "BEGINNER",
    placement: "APPLIED",
  }[board];

  useEffect(() => {
    const fetchNames = async () => {
      const allNodes = ["sales", "learning_and_development", "placement"];
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

  useEffect(() => {
    if (!businessName.trim()) {
      setNameExists(false);
      return;
    }

    setChecking(true);
    setNameExists(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const isDuplicate = allNormalizedNames.includes(normalize(businessName));
      setNameExists(isDuplicate);
      setChecking(false);
    }, 500);
  }, [businessName, allNormalizedNames]);

  const totalContractValue =
    hasStudentCount === true
      ? Number(studentCount || 0) * Number(costPerStudent || 0)
      : Number(manualTCV || 0);

  const handleAddBusiness = async () => {
    if (!businessName.trim() || nameExists) return;

    const projectId = generateProjectId(businessName, allNormalizedNames);
    const newTaskRef = push(ref(db, board));

    await update(newTaskRef, {
      title: businessName,
      address,
      pocName,
      phone,
      status: defaultStatus,
      projectId,
      totalContractValue,
    });

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const resetForm = () => {
    setBusinessName("");
    setAddress("");
    setPocName("");
    setPhone("");
    setStudentCount("");
    setCostPerStudent("");
    setManualTCV("");
    setHasStudentCount(null);
    setNameExists(false);
    setChecking(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Business
        </h2>

        {/* Business Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Acme Corp"
            className={`w-full px-4 py-2 border text-gray-800 rounded-lg outline-none focus:ring-2 ${
              nameExists
                ? "border-red-500 ring-red-100"
                : "border-gray-300 ring-transparent focus:ring-[#008370]"
            }`}
          />
          {nameExists && (
            <p className="text-sm text-red-600">
              Business name already exists.
            </p>
          )}
        </div>

        {/* Address, POC Name & Phone No. (Side by Side) */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 Main St"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              POC Name
            </label>
            <input
              type="text"
              value={pocName}
              onChange={(e) => setPocName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Phone No.
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>
        </div>

        {/* Student Count Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Do you have Student Count?
          </label>
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="studentCountAvailable"
                checked={hasStudentCount === true}
                onChange={() => setHasStudentCount(true)}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="studentCountAvailable"
                checked={hasStudentCount === false}
                onChange={() => setHasStudentCount(false)}
              />
              No
            </label>
          </div>

          {hasStudentCount === true && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Total Contract Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={manualTCV}
                      onChange={(e) => setManualTCV(e.target.value)}
                      className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Cost Per Student
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={costPerStudent}
                      onChange={(e) => setCostPerStudent(e.target.value)}
                      className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Total Contract Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={
                      Number(studentCount || 0) * Number(costPerStudent || 0)
                    }
                    disabled
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </>
          )}

          {hasStudentCount === false && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Total Contract Value
              </label>
              <input
                type="number"
                value={manualTCV}
                onChange={(e) => setManualTCV(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleAddBusiness}
            disabled={!businessName.trim() || nameExists}
            className={`px-5 py-2.5 rounded-lg text-white font-medium transition ${
              !businessName.trim() || nameExists
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#008370] hover:bg-[#006e56]"
            }`}
          >
            Add Business
          </button>

          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
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
