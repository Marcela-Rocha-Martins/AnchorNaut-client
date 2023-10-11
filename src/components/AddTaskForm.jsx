import React, { useState } from "react";
import { Button } from "./Button";

const AddTaskForm = ({ onAddTask, onCancel }) => {
  const [task, setTask] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [status, setStatus] = useState("pending");
  const [deadline, setDeadline] = useState("");

  const handleAddTask = () => {
    // new object with the new data
    const newTask = {
      task: task,
      status: status,
      estimatedTime: estimatedTime,
      deadline: deadline || "",
      subTasks: [], 
    };

    // Chamar a função onAddTask passada como prop para adicionar a nova tarefa ao projeto
    onAddTask(newTask);

    // Limpar os campos do formulário após adicionar a tarefa
    setTask("");
    setEstimatedTime("");
    setStatus("pending");
    setDeadline("");
  };

  return (
    
    <div
      style={{
        border: "2px dotted gray",
        justifyContent: "center",
        borderRadius: "8px",
        padding: "20px",
        width: "95%", 
        height: "50px",
        display: "flex", 
        
      }}
    >
      <div>
      {/* <div
        display: "flex",
          gridTemplateColumns: "1fr auto auto",
          alignItems: "center",
        }}
      ></div> */}
      <div style={{display: "flex", alignItems:"center", margin:"-8px"}}>
        <input
          style={{ border: "2px solid", width: "300px" }}
          type="text"
          name="task"
          value={task}
          placeholder="here goes your task"
          onChange={(e) => setTask(e.target.value)}
        />

        {/* Status:
        <select style={{border: "2px solid", fontSize:"15px"}}name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">pending</option>
          <option value="doing">doing</option>
          <option value="done">done</option>
        </select> */}

        <span className="material-icons-outlined">calendar_month</span>
        <input
          style={{ border: "2px solid", fontSize: "15px", marginLeft: "5px", borderRadius:"8px", height:"14px" }}
          type="date"
          name="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <Button color="#EBEE41" onClick={handleAddTask}>
          Add Task
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
      </div>
    </div>
  );
};

export default AddTaskForm;
