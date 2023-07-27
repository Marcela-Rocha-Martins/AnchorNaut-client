import React, { useState } from "react";
import axios from "axios";
import { Button } from "./Button";

const API_URL = "http://localhost:5005";

function AddSubtaskForm({ taskId, onAddSubtask, setEditedSubTask }) {
  const [subtaskData, setSubtaskData] = useState({
    subTask: "",
    status: "pending",
    deadline: "",
  });
  const storedToken = localStorage.getItem("authToken");
  const handleAddSubTask = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/tasks/${taskId}/subtasks`,
        {
          ...subtaskData,
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      // Notify parent component about the new subtask addition
      onAddSubtask(subtaskData);
      console.log('onAddSubtask', subtaskData);

      // Clear form fields
      setSubtaskData({
        subTask: "",
        status: "pending",
        deadline: "",
      });
    } catch (error) {
      console.error(
        "Error calling API to add new subtask:",
        error.response.data
      );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white", 
        borderRadius: "8px",
        padding: "5px",
        marginTop: "5px",
        border: "2px dotted black",
      }}
    >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        name="subtask"
        value={subtaskData.subTask}
        onChange={(e) =>
          setSubtaskData({ ...subtaskData, subTask: e.target.value })
        }
      />
      <div>
      <span className="material-icons-outlined">calendar_month</span>
        <input
          type="date"
          name="deadline"
          value={subtaskData.deadline}
          onChange={(e) =>
            setSubtaskData({ ...subtaskData, deadline: e.target.value })
          }
        />
      </div>
      <Button onClick={handleAddSubTask}>Add Subtask</Button>
    </div>
    </div>
  );
}

export default AddSubtaskForm;
