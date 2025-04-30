import { db, ref, get, update } from "../firebase";

/**
 * Finds a task by its projectId from a specific node.
 */
export const findTaskByProjectId = async (nodePath, projectId) => {
  const snapshot = await get(ref(db, nodePath));
  const tasks = snapshot.val();
  if (!Array.isArray(tasks)) return null;

  for (const task of tasks) {
    if (task?.projectId?.toUpperCase() === projectId.toUpperCase()) {
      return task; // no ID needed, since it's an array
    }
  }

  return null;
};


/**
 * Updates the status of a task by its projectId.
 */
export const updateStatusByProjectId = async (nodePath, projectId, newStatus) => {
  const task = await findTaskByProjectId(nodePath, projectId);
  if (!task) throw new Error("Project not found");

  await update(ref(db, `${nodePath}/${task.id}`), {
    status: newStatus,
  });
  return task;
};
