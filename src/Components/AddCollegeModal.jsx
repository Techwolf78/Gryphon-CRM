import { useState, useEffect, useRef } from "react";
import { db, ref, get, push, update } from "../firebase";

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

  const [clgCode, setClgCode] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [programType, setProgramType] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const [checking, setChecking] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const [allNormalizedNames, setAllNormalizedNames] = useState([]);

  const debounceRef = useRef(null);

  const defaultStatus = {
    sales: "COLD",
    learning_and_development: "PLANNING", // updated default
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

    // Generate the project ID
    const projectId = `${clgCode.toUpperCase()}/${course.toUpperCase()}/${year.toUpperCase()}/${programType.toUpperCase()}/${academicYear}`;

    const newTaskRef = push(ref(db, board));

    // Save the business data with individual inputs and projectId
    await update(newTaskRef, {
      title: businessName,
      address,
      pocName,
      phone,
      status: defaultStatus,
      clgCode,
      course,
      year,
      programType,
      academicYear,
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
    setClgCode("");
    setCourse("");
    setYear("");
    setProgramType("");
    setAcademicYear("");
    setNameExists(false);
    setChecking(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[95vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Leads</h2>

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

        {/* Address, POC, Phone */}
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

        {/* Project ID Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              College Code
            </label>
            <input
              type="text"
              value={clgCode}
              onChange={(e) => setClgCode(e.target.value.toUpperCase())}
              placeholder="e.g. ASM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Course
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value.toUpperCase())}
              placeholder="e.g. PGDM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value.toUpperCase())}
              placeholder="e.g. 1st"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Type of Program
            </label>
            <input
              type="text"
              value={programType}
              onChange={(e) => setProgramType(e.target.value.toUpperCase())}
              placeholder="e.g. TP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Academic Year
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value.toUpperCase())}
              placeholder="e.g. 25-27"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>
        </div>

        {/* Student Count Section (same as before) */}
        {/* ... keep your student count UI here unchanged ... */}

        {/* Actions */}
        <div className="flex justify-between items-center mt-6">
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
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
