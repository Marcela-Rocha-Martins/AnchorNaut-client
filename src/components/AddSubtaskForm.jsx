import React, { useState } from "react";
import axios from "axios";
import { Button } from "./Button";

const API_URL = "http://localhost:5005";

function AddSubtaskForm({
  taskId,
  onAddSubtask,
  setEditedSubTask,
  showAddSubtaskForm2,
  showAddSubtaskForm,
  setShowAddSubtaskForm2,
  setShowAddSubtaskForm,
}) {
  const [subtaskData, setSubtaskData] = useState({
    subTask: "",
    status: "pending",
    deadline: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(true); // State to toggle form visibility
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
      console.log("onAddSubtask", subtaskData);

      // Clear form fields
      setSubtaskData({
        subTask: "",
        status: "pending",
        deadline: "",
      });

      // Hide the form after successfully adding the subtask
      setIsFormVisible(false);
    } catch (error) {
      console.error(
        "Error calling API to add new subtask:",
        error.response.data
      );
    }
  };

  const handleCancel = () => {
    // Hide the form when the "Close" button is clicked

    setIsFormVisible(false);

    setShowAddSubtaskForm(false);

    setShowAddSubtaskForm2(false);

    console.log("isFormVisible", isFormVisible);
    console.log("showAddSubtaskForm", showAddSubtaskForm);
    console.log("showAddSubtaskForm2", showAddSubtaskForm2);
  };

  if (!isFormVisible) {
    return null; // Don't render the form if it's hidden
  }

  return (
    <div
      style={{
       
        width:"80%",
        alignSelf: "center",
        borderRadius: "8px",
        padding: "5px",
        marginTop: "25px",
        border: "2px dotted black",
      }}
    >
      <div>
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
            style={{width: "auto"}}
            value={subtaskData.subTask}
            onChange={(e) =>
              setSubtaskData({ ...subtaskData, subTask: e.target.value })
            }
          />
          <div style={{ display: "flex" }}>
            <Button onClick={handleAddSubTask}>Add subtask</Button>
            <div style={{ right: "30px" }}>
              <Button icon="close" onClick={handleCancel}></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSubtaskForm;
