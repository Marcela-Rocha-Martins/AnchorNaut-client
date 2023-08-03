import React, { useState } from "react";
import axios from "axios";
import AddSubtaskForm from "./AddSubtaskForm";
import { SubtaskCard } from "./SubtaskCard";
import { Button } from "./Button";

const API_URL = "http://localhost:5005";

function TaskCard({
  taskId,
  task,
  estimatedTime,
  status,
  deadline,
  subTasks,
  updateTask,
  onDeleteTask,
  setCardDetail,
  editTaskStatus,
}) {
  const [editing, setEditing] = useState(false);
  const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [subtasks, setSubtasks] = useState([]);

  const storedToken = localStorage.getItem("authToken");

  const [editedTask, setEditedTask] = useState({
    task: task || "",
    estimatedTime: estimatedTime || "",
    status: status || "",
    deadline: deadline || "",
    subTasks: subTasks || [],
  });

  const [editedSubTask, setEditedSubTask] = useState({
    subTask: "",
    estimatedTime: "",
    status: "",
    deadline: "",
  });

  const [editingSubTaskIndex, setEditingSubTaskIndex] = useState(null);

  const handleEdit = () => {
    setEditing(true);
    setShowDropdown(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setShowDropdown(false);
    setEditedTask({
      task: task,
      estimatedTime: estimatedTime,
      status: status,
      deadline: deadline,
      subTasks: subTasks || [],
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/api/tasks/${taskId}`, editedTask, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setEditing(false);
      setShowDropdown(false);
      updateTask(taskId, editedTask);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      onDeleteTask(taskId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBreakMoreClick = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/assistant`,
        { prompt: task },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      const newSubTasks = response.data.data.map((sub) => ({
        subTask: sub.text,
        estimatedTime: sub.time,
        unsaved: true,
      }));

      setEditedTask((prevState) => ({
        ...prevState,
        subTasks: [...prevState.subTasks, ...newSubTasks],
      }));
    } catch (error) {
      console.error("Error calling Dream Assistant API to subtasks:", error);
    }
  };

  const handleSaveNewSubtasks = async (index) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/tasks/${taskId}/subtasks`,
        {
          subTask: editedTask.subTasks[index].subTask,
          estimatedTime: editedTask.subTasks[index].estimatedTime,
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      const newSubtasks = [...editedTask.subTasks];
      newSubtasks[index].unsaved = false;

      setEditedTask((prevState) => ({
        ...prevState,
        subTasks: [...newSubtasks],
      }));
    } catch (error) {
      console.error(
        "Error calling API to add new subtask:",
        error.response.data
      );
    }
  };

  const handleEditSubtask = (index) => {
    const subtaskToUpdate = editedTask.subTasks[index];

    setEditedSubTask({
      subTask: subtaskToUpdate.subTask,
      estimatedTime: subtaskToUpdate.estimatedTime,
      status: subtaskToUpdate.status,
      deadline: subtaskToUpdate.deadline,
    });

    setEditingSubTaskIndex(index);
  };

  const handleSubTaskChange = (event) => {
    const { name, value } = event.target;
    setEditedSubTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveSubTask = async () => {
    try {
      const subtaskToUpdate = editedTask.subTasks[editingSubTaskIndex];
      const response = await axios.put(
        `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskToUpdate._id}`,
        {
          subTask: editedSubTask.subTask,
          estimatedTime: editedSubTask.estimatedTime,
          status: editedSubTask.status,
          deadline: editedSubTask.deadline,
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      // Atualize a subtarefa editada no estado da tarefa
      const updatedSubTasks = [...editedTask.subTasks];
      updatedSubTasks[editingSubTaskIndex] = {
        ...subtaskToUpdate,
        ...editedSubTask,
      };

      setEditedTask((prevState) => ({
        ...prevState,
        subTasks: updatedSubTasks,
      }));

      // Limpe o estado da subtarefa editada e o índice de edição da subtarefa
      setEditedSubTask({
        subTask: "",
        estimatedTime: "",
        status: "",
        deadline: "",
      });
      setEditingSubTaskIndex(null);
    } catch (error) {
      console.error(
        "Error calling API to update subtask:",
        error.response.data
      );
    }
  };

  const handleCancelSubTask = () => {
    // Limpe o estado da subtarefa editada e o índice de edição da subtarefa para cancelar a edição
    setEditedSubTask({
      subTask: "",
      estimatedTime: "",
      status: "",
      deadline: "",
    });
    setEditingSubTaskIndex(null);
  };

  const handleDeleteSubtask = async (index) => {
    try {
      const subtaskToDelete = editedTask.subTasks[index];
      await axios.delete(
        `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      // Remova a subtarefa deletada do estado da tarefa
      const updatedSubTasks = editedTask.subTasks.filter((_, i) => i !== index);

      setEditedTask((prevState) => ({
        ...prevState,
        subTasks: updatedSubTasks,
      }));

      console.log("Subtask deleted successfully!");
    } catch (error) {
      console.error("Error calling API to delete subtask:", error);
    }
  };

  const handleDisapprove = (index) => {
    // Remova a subtarefa não salva do estado da tarefa
    const updatedSubTasks = editedTask.subTasks.filter((_, i) => i !== index);

    setEditedTask((prevState) => ({
      ...prevState,
      subTasks: updatedSubTasks,
    }));

    // Limpe o estado da subtarefa editada e o índice de edição da subtarefa
    setEditedSubTask({
      subTask: "",
      estimatedTime: "",
      status: "",
      deadline: "",
    });
    setEditingSubTaskIndex(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      // Atualize o status da tarefa no banco de dados
      await axios
        .put(
          `${API_URL}/api/tasks/${taskId}`,
          { status: newStatus },
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        )
        .then((x) => {
          console.log(`atualizou o status, respost:`, x);
        });

      // Atualize o status da tarefa no estado local
      setEditedTask((prevState) => ({
        ...prevState,
        status: newStatus,
      }));

      editTaskStatus(taskId, newStatus);

      // Feche o menu suspenso após selecionar o novo status
      setShowDropdown(false);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const [showSubtaskStatusOptions, setShowSubtaskStatusOptions] =
    useState(false);

  const handleShowSubtaskStatusOptions = () => {
    setShowSubtaskStatusOptions(true);
  };

  const handleHideSubtaskStatusOptions = () => {
    setShowSubtaskStatusOptions(false);
  };

  const handleSubtaskStatusChange = async (index) => {
    try {
      // Atualize o status da subtask no banco de dados
      const subtaskToUpdate = editedTask.subTasks[index];
      let newStatus;

      if (editedTask.subTasks[index].status !== "done") {
        newStatus = "done";
      } else newStatus = "pending";

      // Atualize o status da subtask no estado local
      const updatedSubTasks = [...editedTask.subTasks];
      updatedSubTasks[index].status = newStatus;

      await axios.put(
        `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskToUpdate._id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      setEditedTask((prevState) => ({
        ...prevState,
        subTasks: updatedSubTasks,
      }));
    } catch (error) {
      console.error("Error updating subtask status:", error);
    }
  };

  const handleAddSubtask = async (newSubtask) => {
    const addingNewSubtask = [...editedTask.subTasks, newSubtask];

    setEditedTask((prevState) => ({
      ...prevState,
      subTasks: addingNewSubtask,
    }));
    // Hide the form after adding the subtask
    setShowAddSubtaskForm(false);
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        width: "100vw",
        height: "100vh",
        display: "absolute",
        top: "0",
        left: "0",
        marginTop: "40px",
        position: "fixed",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          width: "70vw",
          maxHeight: "80vh",
          overflow: "scroll",
          position: "absolute",
          top: "50%",
          left: "50%",
          margin: "0 auto",
          transform: "translate(-50%,-50%)",
          padding: "32px",
        }}
      >
        {/* edditing tasks form --------------------------------------------------------------------------- */}
        <div>
          {editing ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                style={{
                  borderRadius: "5px",
                  border: "2px solid",
                  fontSize: "15px",
                  width: "50%",
                }}
                type="text"
                name="task"
                value={editedTask.task}
                onChange={handleChange}
              />
              <span className="material-icons-outlined">calendar_month</span>
              <input
                style={{
                  borderRadius: "5px",
                  border: "2px solid",
                  fontSize: "15px",
                }}
                type="date"
                name="deadline"
                value={editedTask.deadline}
                onChange={handleChange}
              />
              <div style={{ display: "flex" }}>
                <Button
                  icon="save"
                  color="#EBEE41"
                  type="button"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  icon="close"
                  type="button"
                  onClick={handleCancel}
                ></Button>
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h2>{editedTask.task}</h2>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <p
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      <p>Estimated time: </p>
                      <span className="material-icons-outlined">
                        timer
                      </span>{" "}
                      {editedTask.estimatedTime}
                    </p>
                    {editedTask.deadline ? (
                      <p
                        style={{
                          display: "flex",
                          gap: "4px",
                          alignItems: "center",
                        }}
                      >
                        <span className="material-icons-outlined">
                          calendar_month
                        </span>
                        {new Date(editedTask.deadline).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <div style={{ display: "flex", position: "relative" }}>
                    <button
                      style={{
                        backgroundColor: "white",
                        border: "2px solid black",
                        borderRadius: "8px",
                        position: "relative",
                        top: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        width: "110px",
                      }}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span>
                        {editedTask.status.charAt(0).toUpperCase() +
                          editedTask.status.slice(1)}
                      </span>
                      <b
                        style={{
                          fontSize: "10px",
                          fontWeight: "normal",
                          margin: "10px",
                        }}
                      >
                        ▼
                      </b>
                    </button>
                    {showDropdown && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 20000,
                          background: "#fff",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                          padding: "5px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "white",
                            fontWeight: "",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                          onClick={() => handleStatusChange("pending")}
                        >
                          Pending
                        </button>
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "white",
                            fontWeight: "",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                          onClick={() => handleStatusChange("doing")}
                        >
                          Doing
                        </button>
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "white",
                            fontWeight: "",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                          onClick={() => handleStatusChange("done")}
                        >
                          Done
                        </button>
                      </div>
                    )}
                    <Button onClick={handleEdit}>
                      <span className="material-icons-outlined">edit</span>
                    </Button>
                    <Button onClick={handleDelete}>
                      <span className="material-icons-outlined">delete</span>
                    </Button>
                    <Button onClick={() => setCardDetail(null)}>
                      <span className="material-icons-outlined">close</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {editedTask.subTasks.length > 0 ? (
          <div style={{ marginTop: "10px" }}>
            <h4>Subtasks:</h4>
            {editedTask.subTasks.map((sub, index) => (
              <SubtaskCard
                key={index}
                subtask={sub}
                index={index}
                editingSubTaskIndex={editingSubTaskIndex}
                editedSubTask={editedSubTask}
                handleSubTaskChange={handleSubTaskChange}
                handleDeleteSubtask={handleDeleteSubtask}
                handleSaveSubTask={handleSaveSubTask}
                handleCancelSubTask={handleCancelSubTask}
                handleSubtaskStatusChange={handleSubtaskStatusChange}
                handleStatusChange={handleStatusChange}
                handleSaveNewSubtasks={handleSaveNewSubtasks}
                handleEditSubtask={handleEditSubtask}
                handleDisapprove={handleDisapprove}
              />
            ))}
            <div>
              {/* Novo botão para adicionar tarefa */}
              {!showAddSubtaskForm && (
                <Button
                  color="#EBEE41"
                  icon="add"
                  onClick={() => setShowAddSubtaskForm(true)}
                >
                  New substask
                </Button>
              )}

              {/* Formulário para adicionar uma nova tarefa */}
              {showAddSubtaskForm && (
                <AddSubtaskForm
                  taskId={taskId}
                  onAddSubtask={handleAddSubtask}
                  onCancel={() => setShowAddSubtaskForm(false)}
                  setEditedSubTask={setEditedSubTask}
                />
              )}
            </div>
          </div>
        ) : (
          <Button color="#EBEE41" onClick={handleBreakMoreClick}>
            Generate subtasks
          </Button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import AddSubtaskForm from "./AddSubtaskForm";
// import { SubtaskCard } from "./SubtaskCard";
// import { Button } from "./Button";

// const API_URL = "http://localhost:5005";

// function TaskCard({
//   taskId,
//   task,
//   estimatedTime,
//   status,
//   deadline,
//   subTasks,
//   updateTask,
//   onDeleteTask,
//   setCardDetail,
// }) {
//   const [editing, setEditing] = useState(false);
//   const [showStatusOptions, setShowStatusOptions] = useState(false);
//   const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [subtasks, setSubtasks] = useState([]);
//   const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

//   const storedToken = localStorage.getItem("authToken");

//   const [editedTask, setEditedTask] = useState({
//     task: task || "",
//     estimatedTime: estimatedTime || "",
//     status: status || "",
//     deadline: deadline || "",
//     subTasks: subTasks || [],
//   });

//   const [editedSubTask, setEditedSubTask] = useState({
//     subTask: "",
//     estimatedTime: "",
//     status: "",
//     deadline: "",
//   });

//   const [editingSubTaskIndex, setEditingSubTaskIndex] = useState(null);

//   const handleEdit = () => {
//     setEditing(true);
//     setShowStatusOptions(true);
//   };

//   const handleCancel = () => {
//     setEditing(false);
//     setShowStatusOptions(false);
//     setEditedTask({
//       task: task,
//       estimatedTime: estimatedTime,
//       status: status,
//       deadline: deadline,
//       subTasks: subTasks || [],
//     });
//   };

//   const handleSave = async () => {
//     try {
//       await axios.put(`${API_URL}/api/tasks/${taskId}`, editedTask, {
//         headers: { Authorization: `Bearer ${storedToken}` },
//       });
//       setEditing(false);
//       setShowStatusOptions(false);
//       updateTask(taskId, editedTask);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setEditedTask((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
//         headers: { Authorization: `Bearer ${storedToken}` },
//       });
//       onDeleteTask(taskId);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleBreakMoreClick = async () => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/assistant`,
//         { prompt: task },
//         {
//           headers: {
//             Authorization: `Bearer ${storedToken}`,
//           },
//         }
//       );

//       const newSubTasks = response.data.data.map((sub) => ({
//         subTask: sub.text,
//         estimatedTime: sub.time,
//         unsaved: true,
//       }));

//       setEditedTask((prevState) => ({
//         ...prevState,
//         subTasks: [...prevState.subTasks, ...newSubTasks],
//       }));
//     } catch (error) {
//       console.error("Error calling Dream Assistant API to subtasks:", error);
//     }
//   };

//   const handleSaveNewSubtasks = async (index) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/tasks/${taskId}/subtasks`,
//         {
//           subTask: editedTask.subTasks[index].subTask,
//           estimatedTime: editedTask.subTasks[index].estimatedTime,
//         },
//         {
//           headers: { Authorization: `Bearer ${storedToken}` },
//         }
//       );

//       const newSubtasks = [...editedTask.subTasks];
//       newSubtasks[index].unsaved = false;

//       setEditedTask((prevState) => ({
//         ...prevState,
//         subTasks: [...newSubtasks],
//       }));
//     } catch (error) {
//       console.error(
//         "Error calling API to add new subtask:",
//         error.response.data
//       );
//     }
//   };

//   const handleEditSubtask = (index) => {
//     const subtaskToUpdate = editedTask.subTasks[index];

//     setEditedSubTask({
//       subTask: subtaskToUpdate.subTask,
//       estimatedTime: subtaskToUpdate.estimatedTime,
//       status: subtaskToUpdate.status,
//       deadline: subtaskToUpdate.deadline,
//     });

//     setEditingSubTaskIndex(index);
//   };

//   const handleSubTaskChange = (event) => {
//     const { name, value } = event.target;
//     setEditedSubTask((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSaveSubTask = async () => {
//     try {
//       const subtaskToUpdate = editedTask.subTasks[editingSubTaskIndex];
//       const response = await axios.put(
//         `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskToUpdate._id}`,
//         {
//           subTask: editedSubTask.subTask,
//           estimatedTime: editedSubTask.estimatedTime,
//           status: editedSubTask.status,
//           deadline: editedSubTask.deadline,
//         },
//         {
//           headers: { Authorization: `Bearer ${storedToken}` },
//         }
//       );

//       // Atualize a subtarefa editada no estado da tarefa
//       const updatedSubTasks = [...editedTask.subTasks];
//       updatedSubTasks[editingSubTaskIndex] = {
//         ...subtaskToUpdate,
//         ...editedSubTask,
//       };

//       setEditedTask((prevState) => ({
//         ...prevState,
//         subTasks: updatedSubTasks,
//       }));

//       // Limpe o estado da subtarefa editada e o índice de edição da subtarefa
//       setEditedSubTask({
//         subTask: "",
//         estimatedTime: "",
//         status: "",
//         deadline: "",
//       });
//       setEditingSubTaskIndex(null);
//     } catch (error) {
//       console.error(
//         "Error calling API to update subtask:",
//         error.response.data
//       );
//     }
//   };

//   const handleCancelSubTask = () => {
//     // Limpe o estado da subtarefa editada e o índice de edição da subtarefa para cancelar a edição
//     setEditedSubTask({
//       subTask: "",
//       estimatedTime: "",
//       status: "",
//       deadline: "",
//     });
//     setEditingSubTaskIndex(null);
//   };

//   const handleDeleteSubtask = async (index) => {
//     try {
//       const subtaskToDelete = editedTask.subTasks[index];
//       await axios.delete(
//         `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskToDelete._id}`,
//         {
//           headers: { Authorization: `Bearer ${storedToken}` },
//         }
//       );

//       // Remova a subtarefa deletada do estado da tarefa
//       const updatedSubTasks = editedTask.subTasks.filter((_, i) => i !== index);

//       setEditedTask((prevState) => ({
//         ...prevState,
//         subTasks: updatedSubTasks,
//       }));

//       console.log("Subtask deleted successfully!");
//     } catch (error) {
//       console.error("Error calling API to delete subtask:", error);
//     }
//   };

//   const handleDisapprove = (index) => {
//     // Remova a subtarefa não salva do estado da tarefa
//     const updatedSubTasks = editedTask.subTasks.filter((_, i) => i !== index);

//     setEditedTask((prevState) => ({
//       ...prevState,
//       subTasks: updatedSubTasks,
//     }));

//     // Limpe o estado da subtarefa editada e o índice de edição da subtarefa
//     setEditedSubTask({
//       subTask: "",
//       estimatedTime: "",
//       status: "",
//       deadline: "",
//     });
//     setEditingSubTaskIndex(null);
//   };

//   const handleStatusChange = async (newStatus) => {
//     try {
//       // Atualize o status da tarefa no banco de dados
//       await axios.put(
//         `${API_URL}/api/tasks/${taskId}`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${storedToken}` },
//         }
//       );

//       // Atualize o status da tarefa no estado local
//       setEditedTask((prevState) => ({
//         ...prevState,
//         status: newStatus,
//       }));

//       // Recolha as opções após selecionar o novo status
//       setShowStatusOptions(false);
//     } catch (error) {
//       console.error("Error updating task status:", error);
//     }
//   };

//   const [showSubtaskStatusOptions, setShowSubtaskStatusOptions] =
//     useState(false);

//   const handleShowSubtaskStatusOptions = () => {
//     setShowSubtaskStatusOptions(true);
//   };

//   const handleHideSubtaskStatusOptions = () => {
//     setShowSubtaskStatusOptions(false);
//   };

//   const handleSubtaskStatusChange = async (index) => {
//     try {
//       // Atualize o status da subtask no banco de dados
//       const subtaskToUpdate = editedTask.subTasks[index];
//       let newStatus;

//       if (editedTask.subTasks[index].status !== "done") {
//         newStatus = "done";
//       } else newStatus = "pending";

//       await axios.put(
//         `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskToUpdate._id}`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${storedToken}` },
//         }
//       );

//       // Atualize o status da subtask no estado local
//       const updatedSubTasks = [...editedTask.subTasks];
//       updatedSubTasks[index].status = newStatus;

//       setEditedTask((prevState) => ({
//         ...prevState,
//         subTasks: updatedSubTasks,
//       }));
//     } catch (error) {
//       console.error("Error updating subtask status:", error);
//     }
//   };

//   const handleAddSubtask = async (newSubtask) => {
//     const addingNewSubtask = [...editedTask.subTasks, newSubtask];

//     setEditedTask((prevState) => ({
//       ...prevState,
//       subTasks: addingNewSubtask,
//     }));
//     // Hide the form after adding the subtask
//     setShowAddSubtaskForm(false);
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "rgba(0,0,0,0.6)",
//         width: "100vw",
//         height: "100vh",
//         display: "absolute",
//         top: "0",
//         left: "0",
//         marginTop: "40px",
//         position: "fixed",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "white",
//           borderRadius: "5px",
//           width: "70vw",
//           maxHeight: "80vh",
//           overflow: "scroll",
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           margin: "0 auto",
//           transform: "translate(-50%,-50%)",
//           padding: "32px",
//         }}
//       >
//         {/* edditing tasks form --------------------------------------------------------------------------- */}
//         <div>
//           {editing ? (
//             <div style={{display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <input
//                style={{ borderRadius: "5px", border: "2px solid", fontSize: "15px", width: "50%"}}
//                 type="text"
//                 name="task"
//                 value={editedTask.task}
//                 onChange={handleChange}
//               />
//               <span className="material-icons-outlined">
//                           calendar_month
//                         </span>
//               <input
//                style={{ borderRadius: "5px", border: "2px solid", fontSize: "15px" }}
//                 type="date"
//                 name="deadline"
//                 value={editedTask.deadline}
//                 onChange={handleChange}
//               />
//               <div style={{display:"flex"}}>
//               <Button icon="save" color="#EBEE41" type="button" onClick={handleSave}>
//                 Save
//               </Button>
//               <Button icon="close"type="button" onClick={handleCancel}>
//               </Button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div
//                 style={{
//                   flex: "1",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <div style={{ display: "flex", flexDirection: "column" }}>
//                   <h2>{editedTask.task}</h2>
//                   <div style={{ display: "flex", gap: "20px" }}>
//                     <p
//                       style={{
//                         display: "flex",
//                         gap: "4px",
//                         alignItems: "center",
//                       }}
//                     >
//                       <p>Estimated time: </p>
//                       <span className="material-icons-outlined">
//                         timer
//                       </span>{" "}
//                       {editedTask.estimatedTime}
//                     </p>
//                     {editedTask.deadline ? (
//                       <p
//                         style={{
//                           display: "flex",
//                           gap: "4px",
//                           alignItems: "center",
//                         }}
//                       >
//                         <span className="material-icons-outlined">
//                           calendar_month
//                         </span>
//                         {new Date(editedTask.deadline).toLocaleDateString()}
//                       </p>
//                     ) : null}
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "5px",
//                   }}
//                 >
//                   <div style={{ display: "flex", position: "relative" }}>
//                     <Button onClick={() => setShowDropdown(!showDropdown)}>
//                       <span>status</span>
//                     </Button>
//                     {showDropdown && (
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: "100%",
//                           left: 0,
//                           zIndex: 20000,
//                           background: "#fff",
//                           boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//                           padding: "5px",
//                           display: "flex",
//                           flexDirection: "column",
//                         }}
//                       >
//                         {showStatusOptions ? (
//                           <>
//                             <button onClick={() => handleStatusChange("pending")}>
//                               pending
//                             </button>
//                             <button onClick={() => handleStatusChange("doing")}>
//                               doing
//                             </button>
//                             <button onClick={() => handleStatusChange("done")}>
//                               done
//                             </button>
//                           </>
//                         ) : (
//                           <Button
//                             onClick={() => {
//                               setShowStatusOptions(true);
//                               setShowDropdown(false);
//                             }}
//                           >
//                             {editedTask.status}
//                           </Button>
//                         )}
//                       </div>

//                     )}
//                     <Button onClick={handleEdit}>
//                           <span className="material-icons-outlined">edit</span>

//                         </Button>
//                         <Button onClick={handleDelete}>
//                           <span className="material-icons-outlined">delete</span>

//                         </Button>
//                         <Button onClick={() => setCardDetail(null)}>
//                           <span className="material-icons-outlined">close</span>
//                         </Button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {editedTask.subTasks.length > 0 ? (
//           <div style={{ marginTop: "10px" }}>
//             <h4>Subtasks:</h4>
//             {editedTask.subTasks.map((sub, index) => (
//               <SubtaskCard
//                 key={index}
//                 subtask={sub}
//                 index={index}
//                 editingSubTaskIndex={editingSubTaskIndex}
//                 editedSubTask={editedSubTask}
//                 handleSubTaskChange={handleSubTaskChange}
//                 handleDeleteSubtask={handleDeleteSubtask}
//                 handleSaveSubTask={handleSaveSubTask}
//                 handleCancelSubTask={handleCancelSubTask}
//                 handleSubtaskStatusChange={handleSubtaskStatusChange}
//                 handleStatusChange={handleStatusChange}
//                 handleSaveNewSubtasks={handleSaveNewSubtasks}
//                 handleEditSubtask={handleEditSubtask}
//                 handleDisapprove={handleDisapprove}
//               />
//             ))}
//             <div>
//               {/* Novo botão para adicionar tarefa */}
//               {!showAddSubtaskForm && (
//                 <Button
//                   color="#EBEE41"
//                   icon="add"
//                   onClick={() => setShowAddSubtaskForm(true)}
//                 >
//                   New substask
//                 </Button>
//               )}

//               {/* Formulário para adicionar uma nova tarefa */}
//               {showAddSubtaskForm && (
//                 <AddSubtaskForm
//                   taskId={taskId}
//                   onAddSubtask={handleAddSubtask}
//                   onCancel={() => setShowAddSubtaskForm(false)}
//                   setEditedSubTask={setEditedSubTask}
//                 />
//               )}
//             </div>
//           </div>
//         ) : (
//           <Button color="#EBEE41" onClick={handleBreakMoreClick}>
//             Generate subtasks
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default TaskCard;
