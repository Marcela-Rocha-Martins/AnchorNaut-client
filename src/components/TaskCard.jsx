import React from "react";

function TaskCard({ task, estimatedTime, status, deadline, subTasks }) {
  return (
    <div className="TaskCard card">
      <h3>{task}</h3>
      <p>Estimated Time: {estimatedTime}</p>
      <p>Status: {status}</p>
      <p>Deadline: {deadline ? new Date(deadline).toLocaleDateString() : "Not set"}</p>

      {/* Check if there are subtasks and display them */}
      {subTasks && subTasks.length > 0 && (
        <div>
          <h4>Subtasks:</h4>
          {subTasks.map((subtask) => (
            <div key={subtask._id}>
              <p>{subtask.subTask}</p>
              <p>Status: {subtask.status}</p>
              <p>Deadline: {subtask.deadline ? new Date(subtask.deadline).toLocaleDateString() : "Not set"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskCard;



