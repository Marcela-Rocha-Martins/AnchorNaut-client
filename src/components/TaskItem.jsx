import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5005";

const TaskItem = ({ task, onDelete, token, tasks, setTasks, i }) => {
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [subTasks, setSubTasks] = useState([]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    task.text = editedText;
    setEditing(false);
    if (!task.parentId) {
      // If the task is a parent task, clear the subtasks when edited
      setSubTasks([]);
    }
  };

  const handleCancelClick = () => {
    // Se o usuário cancelar a edição, restauramos o texto original
    setEditedText(task.text);
    setEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete(task);
    if (!task.parentId) {
      // If the task is a parent task, clear the subtasks when deleted
      setSubTasks([]);
    }
  };

  const handleChange = (event) => {
    setEditedText(event.target.value);
  };

  const handleBreakMoreClick = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/assistant`,
        { prompt: task.text }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      let newTasks = [...tasks];
      newTasks[i].subTasks = response.data.data;
      setTasks(newTasks);

      console.log("Break More Sucessful", tasks);
      // console.log("SetTasks:", response.data.data);
    } catch (error) {
      console.error("Error calling Dream Assistant API to subtasks:", error);
    }
  };

  const handleEditSubTaskClick = (subTaskIndex) => {
    let newTasks = [...tasks];
    newTasks[i].subTasks[subTaskIndex].editing = true;
    setTasks(newTasks);
    console.log(tasks, "edit");
  };

  const handleSaveSubTaskClick = (subTaskIndex) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks[i].subTasks[subTaskIndex].text =
        newTasks[i].subTasks[subTaskIndex].editedText;
      newTasks[i].subTasks[subTaskIndex].editing = false;
      return newTasks;
    });
    console.log(tasks, "save");

  };

  const handleCancelSubTaskClick = (subTaskIndex) => {
     setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks[i].subTasks[subTaskIndex].editing = false;
      newTasks[i].subTasks[subTaskIndex].editedText =
        newTasks[i].subTasks[subTaskIndex].text;
      return newTasks;
    });
  };

  const handleDeleteSubTaskClick = (subTaskIndex) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks[i].subTasks.splice(subTaskIndex, 1);
      return newTasks;
    });
  };

  useEffect(() => {
    //console.log("SubTasks:", subTasks);
  }, [subTasks]);

  return (
    <div
    
      style={{
        marginBottom: "10px",
        marginLeft: "10px",
        width: "80%",
        padding: "10px",
        backgroundColor: task.parentId ? "#f1f1f1" : "#d3d3d3", // Use different background colors for parent tasks and subtasks
      }}
    >
      {editing ? (
        <>
          <input type="text" value={editedText} onChange={handleChange} />
          <button onClick={handleSaveClick}>OK</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </>
      ) : (
        <>
          <span>{task.text}</span> | <span>Estimated time: {task.time}</span>
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={handleDeleteClick}>Delete</button>
          <button onClick={handleBreakMoreClick}>Break More</button>
          {/* Renderizar as subtarefas relacionadas abaixo da tarefa principal */}
          {task.subTasks !== undefined &&
            task.subTasks.map((subTask, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9", // Use a lighter background color for subtasks
                }}
              >
                {" "}
                {subTask.editing ? (
                  <>
                    <input
                      type="text"
                      value={subTask.editedText || subTask.text}
                      onChange={(event) => {
                        setTasks((prevTasks) => {
                          const newTasks = [...prevTasks];
                          newTasks[i].subTasks[index].editedText =
                            event.target.value;
                          return newTasks;
                        });
                      }}
                    />
                    <button onClick={() => handleSaveSubTaskClick(index)}>
                      OK
                    </button>
                    <button onClick={() => handleCancelSubTaskClick(index)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span>{subTask.text}</span> |{" "}
                    <span>Estimated time: {subTask.time}</span>
                    <button onClick={() => handleEditSubTaskClick(index)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteSubTaskClick(index)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
        </>
      )}
    </div>
  );
};
export default TaskItem;