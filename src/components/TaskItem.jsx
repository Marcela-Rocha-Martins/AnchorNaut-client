import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./Button";


// const API_URL = "http://localhost:5005";
const API_URL = process.env.VITE_REACT_APP_SERVER_URL || "http://localhost:5005";

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
    //To restore the previous text
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
  }, [subTasks]);

  return (
    <div
    
      style={{
        margin: "0 auto",
        width: "80%",
        padding: "16px",
        backgroundColor: "white", 
        border: "2px dotted black",
        borderRadius: "8px",
        alignItems: "center",
      }}
    >
      {editing ? (
        <div className="task-editing" style={{display: "flex"}}>
          <input style={{width: "450px"}} type="text" value={editedText} onChange={handleChange} />
          <Button onClick={handleSaveClick}>OK</Button>
          <Button onClick={handleCancelClick}>Cancel</Button>
        </div>
      ) : (
        <>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto"}}>
        <div style={{alignItems:"flex-start"}}>
          <h3 style={{margin:"10px", marginLeft:"0", textAlign:"left"}}>{task.text}</h3>  
          
          <div style={{display:"flex"}}>
          <span className="material-icons-outlined">timer</span> {task.time}
          </div>
          </div>

<div style={{display:"flex", alignItems:"center"}}>
          <Button icon="edit" onClick={handleEditClick}>
          </Button>
          <Button icon="delete" onClick={handleDeleteClick}></Button>
          </div>
          </div>
    
          {task.subTasks !== undefined &&
            task.subTasks.map((subTask, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9", 
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
                    <Button onClick={() => handleSaveSubTaskClick(index)}>
                      OK
                    </Button>
                    <Button onClick={() => handleCancelSubTaskClick(index)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span>{subTask.text}</span> |{" "}
                    <span>Estimated time: {subTask.time}</span>
                    <Button onClick={() => handleEditSubTaskClick(index)}>
                      
                    </Button>
                    <Button onClick={() => handleDeleteSubTaskClick(index)}>
                   
                    </Button>
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