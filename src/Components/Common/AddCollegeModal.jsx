import { useState, useEffect } from "react";
import { db, ref, get, push, update } from "../../firebase";

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

  const [projectIdExists, setProjectIdExists] = useState(false);
  const [checkingProjectId, setCheckingProjectId] = useState(false);

  const defaultStatus = {
    sales: "COLD",
    learning_and_development: "PLANNING",
    placement: "APPLIED",
  }[board];

  useEffect(() => {
    const allFilled = clgCode && course && year && programType && academicYear;

    if (!allFilled) {
      setProjectIdExists(false);
      return;
    }

    const generatedId = `${clgCode.toUpperCase()}/${course.toUpperCase()}/${year.toUpperCase()}/${programType.toUpperCase()}/${academicYear}`;
    setCheckingProjectId(true);

    const checkProjectId = async () => {
      const allNodes = ["sales", "learning_and_development", "placement"];
      let exists = false;

      for (const node of allNodes) {
        const snapshot = await get(ref(db, node));
        if (snapshot.exists()) {
          const data = snapshot.val();
          for (const task of Object.values(data)) {
            if (task.projectId === generatedId) {
              exists = true;
              break;
            }
          }
        }
        if (exists) break;
      }

      setProjectIdExists(exists);
      setCheckingProjectId(false);
    };

    checkProjectId();
  }, [clgCode, course, year, programType, academicYear]);

  const totalContractValue =
    hasStudentCount === true
      ? Number(studentCount || 0) * Number(costPerStudent || 0)
      : Number(manualTCV || 0);

  const handleAddBusiness = async () => {
    if (!businessName.trim() || projectIdExists) return;

    const projectId = `${clgCode.toUpperCase()}/${course.toUpperCase()}/${year.toUpperCase()}/${programType.toUpperCase()}/${academicYear}`;
    const newTaskRef = push(ref(db, board));

    const taskData = {
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
    };

    if (hasStudentCount === true) {
      taskData.std_count = Number(studentCount);
      taskData.cost_per_std = Number(costPerStudent);
    }

    await update(newTaskRef, taskData);
    resetForm();
    onClose();
  };

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
    setProjectIdExists(false);
    setCheckingProjectId(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl overflow-y-auto max-h-[95vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Leads</h2>

        {/* Business Name */}
        <div className="mb-2">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
          />
        </div>

        {/* Address, POC, Phone */}
        <div className="grid grid-cols-3 gap-4 mb-2">
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

        {/* Project Fields */}
        <div className="grid grid-cols-3 gap-4 mb-2">
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
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
            >
              <option value="">Select Course</option>
              <option value="MBA">MBA</option>
              <option value="placement">Placement</option>
              <option value="Engg">Engg</option>
              <option value="MSC/IT">MSC/IT</option>
              <option value="BE/BTECH">BE/BTECH</option>
              <option value="Training">Training</option>
              <option value="Diploma">Diploma</option>
              <option value="PGDM">PGDM</option>
              <option value="BBA">BBA</option>
            </select>
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
            {projectIdExists && !checkingProjectId && (
              <p className="text-sm text-red-600 mt-1">
                This project ID already exists.
              </p>
            )}
          </div>
        </div>

        {/* Student Count Logic */}
        <div className="mb-2">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Do you have the Student Count?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                checked={hasStudentCount === true}
                onChange={() => setHasStudentCount(true)}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                checked={hasStudentCount === false}
                onChange={() => setHasStudentCount(false)}
              />
              No
            </label>
          </div>

          {hasStudentCount === true && (
            <div className="grid grid-cols-3 gap-4 mt-1">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Student Count
                </label>
                <input
                  type="number"
                  value={studentCount}
                  onChange={(e) => setStudentCount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Cost per Student
                </label>
                <input
                  type="number"
                  value={costPerStudent}
                  onChange={(e) => setCostPerStudent(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Total Contract Value
                </label>
                <input
                  type="text"
                  value={
                    Number(studentCount || 0) * Number(costPerStudent || 0)
                  }
                  readOnly
                  className="w-full px-4 py-2 border bg-gray-100 text-gray-800 border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {hasStudentCount === false && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Total Contract Value
              </label>
              <input
                type="number"
                value={manualTCV}
                onChange={(e) => setManualTCV(e.target.value)}
                placeholder="e.g. 200000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008370]"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleAddBusiness}
            disabled={
              !businessName.trim() || projectIdExists || checkingProjectId
            }
            className={`px-5 py-2.5 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${
              !businessName.trim() || projectIdExists || checkingProjectId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#008370] hover:bg-[#006e56]"
            }`}
          >
            {checkingProjectId ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Checking...
              </>
            ) : (
              "Add Business"
            )}
          </button>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-sm text-gray-500 rounded-lg hover:text-white hover:bg-red-600 px-4 py-2 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
