import React, { useState, useEffect } from "react";
import axios from "axios";
import AddSubtaskForm from "./AddSubtaskForm";

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
}) {
  const [editing, setEditing] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false);
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
  };

  const handleCancel = () => {
    setEditing(false);
    setShowStatusOptions(false);
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
      setShowStatusOptions(false);
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
      console.log(newSubTasks); // Verifique se as subtasks estão sendo corretamente adicionadas à task
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

      console.log(response.data); // Verifique se a subtarefa foi atualizada com sucesso
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

  const handleDesaprove = (index) => {
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
      await axios.put(
        `${API_URL}/api/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      // Atualize o status da tarefa no estado local
      setEditedTask((prevState) => ({
        ...prevState,
        status: newStatus,
      }));

      // Recolha as opções após selecionar o novo status
      setShowStatusOptions(false);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  const [showSubtaskStatusOptions, setShowSubtaskStatusOptions] = useState(false);

  const handleShowSubtaskStatusOptions = () => {
    setShowSubtaskStatusOptions(true);
  };

  const handleHideSubtaskStatusOptions = () => {
    setShowSubtaskStatusOptions(false);
  };

  const handleSubtaskStatusChange = async (index, newStatus) => {
    try {
      // Atualize o status da subtask no banco de dados
      const subtaskToUpdate = editedTask.subTasks[index];
      await axios.put(
        `${API_URL}/api/tasks/${taskId}/subtasks/${subtaskToUpdate._id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      // Atualize o status da subtask no estado local
      const updatedSubTasks = [...editedTask.subTasks];
      updatedSubTasks[index].status = newStatus;

      setEditedTask((prevState) => ({
        ...prevState,
        subTasks: updatedSubTasks,
      })); console.log(updatedSubTasks, "subtask status")
    } catch (error) {
      console.error("Error updating subtask status:", error);
      
    }
  };

  const handleAddSubtask = async (newSubtask) => {
    const addingNewSubtask = [...subtasks, newSubtask];

    setSubtasks((prevState) => ({
      ...prevState,
      subtasks: addingNewSubtask,
  })) 
    // Hide the form after adding the subtask
    setShowAddSubtaskForm(false);
  };
  
  return (
    <div style={{backgroundColor: "rgba(0,0,0,0.6)", width: "100vw", height:"100vh", display:"absolute", top: "0", left: "0", position: "fixed"}}>
    <div
      style={{
        backgroundColor: "#f1f1f1",
        borderRadius: "5px",
        padding: "10px",
        width: "70vw",
        maxHeight: "80vh",
        overflow: "scroll",
        position: "absolute",
        top:"50%",
        left:"50%",
        margin: "0 auto",
        transform: "translate(-50%,-50%)",
        padding: "32px"
      }}
    >
      {/* edditing tasks form --------------------------------------------------------------------------- */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {editing ? (
          <form>
            <label>
              Task:
              <input
                type="text"
                name="task"
                value={editedTask.task}
                onChange={handleChange}
              />
            </label>
            <label>
              Deadline:
              <input
                type="date"
                name="deadline"
                value={editedTask.deadline}
                onChange={handleChange}
              />
            </label>
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        ) : (
          <>
          {/* status button tasks --------------------------------------------------------------------------- */}
            {showStatusOptions ? (
              <div>
                <button onClick={() => handleStatusChange("pending")}>
                  pending
                </button>
                <button onClick={() => handleStatusChange("doing")}>
                  doing
                </button>
                <button onClick={() => handleStatusChange("done")}>done</button>
              </div>
            ) : (
              <button onClick={() => setShowStatusOptions(true)}>
                {editedTask.status}
              </button>
            )}
            <button onClick={() => setCardDetail(null)}>close</button>
            <div style={{ flex: "1" }}>
              <h3>{editedTask.task}</h3>
              <p>Estimated Time: {editedTask.estimatedTime}</p>
              <p>
                Deadline:{" "}
                {editedTask.deadline
                  ? new Date(editedTask.deadline).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
              <button onClick={handleBreakMoreClick}>Break More</button>
            </div>
          </>
        )}
      </div>

      {editedTask.subTasks && editedTask.subTasks.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h4>Subtasks:</h4>
          {editedTask.subTasks.map((subtask, index) => (
            <div
              key={subtask._id}
              style={{
                backgroundColor: "#d0d0d0",
                borderRadius: "5px",
                padding: "5px",
                marginTop: "5px",
                border: subtask.unsaved ? "1px solid red" : "none",
              }}
            >

 {/* edditing subtasks --------------------------------------------------------------------------- */}
              {editingSubTaskIndex === index ? (
                <div style={{ marginTop: "10px" }}>
                  <h4>Edit Subtask:</h4>
                  <form>
                    <label>
                      Subtask:
                      <input
                        type="text"
                        name="subTask"
                        value={editedSubTask.subTask}
                        onChange={handleSubTaskChange}
                      />
                    </label>
                    <label>
                      Deadline:
                      <input
                        type="date"
                        name="deadline"
                        value={editedSubTask.deadline}
                        onChange={handleSubTaskChange}
                      />
                    </label>
                    <button type="button" onClick={handleSaveSubTask}>
                      Save
                    </button>
                    <button type="button" onClick={handleCancelSubTask}>
                      Cancel
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <p>{subtask.subTask}</p>
                  <div>
                    {!subtask.unsaved ? (
                      <>
                        <button
                          onClick={() =>
                            handleSubtaskStatusChange(index, "pending")
                          }
                        >
                          pending
                        </button>
                        <button
                          onClick={() =>
                            handleSubtaskStatusChange(index, "doing")
                          }
                        >
                          doing
                        </button>
                        <button
                          onClick={() =>
                            handleSubtaskStatusChange(index, "done")
                          }
                        >
                          done
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(subtask.status)}
                      >
                        {subtask.status}
                      </button>
                    )}
                  </div>

                  <p>Estimated Time: {subtask.estimatedTime}</p>
                  <p>
                    Deadline:{" "}
                    {subtask.deadline
                      ? new Date(subtask.deadline).toLocaleDateString()
                      : "Not set"}
                  </p>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {!subtask.unsaved && (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => handleEditSubtask(index)}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteSubtask(index)}>
                          Delete
                        </button>
                      </div>
                    )}
                    {subtask.unsaved ? (
                      <>
                        <button onClick={() => handleSaveNewSubtasks(index)}>
                          Save
                        </button>
                        <button onClick={() => handleDesaprove(index)}>
                          Desaprove entry
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    <div>
  
  {/* Novo botão para adicionar tarefa */}
  {!showAddSubtaskForm && (
             <button onClick={() => setShowAddSubtaskForm(true)}>
             Add new subtask
           </button>
            )}

            {/* Formulário para adicionar uma nova tarefa */}
            {showAddSubtaskForm && (
              <AddSubtaskForm
               taskId={taskId}
               onAddSubtask={handleAddSubtask}
                onCancel={() => setShowAddSubtaskForm(false)}
              />
            )}
    </div>
    </div>
    </div>
  );
}

export default TaskCard;
