import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import AddTaskForm from "../components/AddTaskForm";
import TaskMiniCard from "../components/TaskMiniCard";
import { Button } from "../components/Button";

const API_URL = "http://localhost:5005";

function ProjectDetailsPage(props) {
  const [project, setProject] = useState({ tasks: [] });
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [cardDetail, setCardDetail] = useState(null);
  const [projectDescription, setProjectDescription] = useState(
    "Add your project description here"
  );
  const [activeTask, setActiveTask] = useState(null);

  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [topUp, setTopUp] = useState(false);
  const [inputProjectName, setInputProjectName] = useState("");
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  useEffect(() => {
    if (cardDetail) {
      setActiveTask(filteredTasks.filter((task) => task._id === cardDetail)[0]);
    } else {
      setActiveTask(null);
    }
  }, [cardDetail]);

  const updateTask = (taskId, updatedTask) => {
    setProject((prevProject) => {
      const updatedTasks = prevProject.tasks.map((task) => {
        if (task._id === taskId) {
          return { ...task, ...updatedTask };
        }
        return task;
      });
      return { ...prevProject, tasks: updatedTasks };
    });
  };

  function editTaskStatus(id, status) {
    let newProject = { ...project };

    for (let i = 0; i < newProject.tasks.length; i++) {
      if (newProject.tasks[i]._id === id) {
        newProject.tasks[i].status = status;
      }
    }
    console.log(newProject, "teste");
    setProject(newProject);
  }

  const handleDeleteTask = (taskId) => {
    setProject((prevProject) => {
      const updatedTasks = prevProject.tasks.filter(
        (task) => task._id !== taskId
      );
      return { ...prevProject, tasks: updatedTasks };
    });
    setCardDetail(null);
  };

  const updateProjectDescription = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${API_URL}/api/projects/${projectId}`,
        { description: projectDescription },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setProject((prevProject) => ({
        ...prevProject,
        description: projectDescription,
      }));
      setIsAddingDescription(false);
    } catch (error) {
      console.log("Error updating project description:", error);
    }
  };

  const cancelAddDescription = () => {
    setIsAddingDescription(false);
  };

  const handleDeleteProject = () => {
    if (inputProjectName === project.projectName) {
      // Delete the project
      const storedToken = localStorage.getItem("authToken");
      axios
        .delete(`${API_URL}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => {
          // Show delete message after successful deletion
          setShowDeleteMessage(true);
          // Redirect to all projects page or handle the deletion success in any other way
          console.log("Project deleted successfully");
        })
        .catch((error) => {
          console.log("Error deleting project:", error);
        });
    } else {
      // Show an error or a notification that the project name is incorrect
      console.log("Project name does not match. Project was not deleted.");
    }
    navigate("/");
    //  setIsDeleting(false)
  };

  const handleAddTask = async (newTask) => {
    console.log("new task:", newTask);
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/api/projects/${projectId}/tasks`,
        newTask,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      const createdTask = response.data;

      setProject((prevProject) => ({
        ...prevProject,
        tasks: [...prevProject.tasks, createdTask],
      }));

      setShowAddTaskForm(false);
    } catch (error) {
      console.error("Error adding new task:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching project details...");
    const fetchProject = async () => {
      const storedToken = localStorage.getItem("authToken");
      try {
        const projectResponse = await axios.get(
          `${API_URL}/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        const fetchedProject = projectResponse.data;

        console.log("Fetched project details:", fetchedProject);

        const fetchedTasks = projectResponse.data.tasks;

        console.log("Fetched tasks:", fetchedTasks);

        setProject({
          ...fetchedProject,
          tasks: fetchedTasks,
        });

        setProjectDescription(
          fetchedProject.description || "Add your project description here"
        );
      } catch (error) {
        console.log("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  const filteredTasks = project?.tasks?.filter((task) => {
    if (filterStatus === "All") return true;
    return task.status === filterStatus;
  });

  console.log("Filtered tasks:", filteredTasks);

  filteredTasks.sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;

    return new Date(a.deadline) - new Date(b.deadline);
  });

  return (
    <>
      <div className="ProjectDetails">
        {project ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                padding: "32px",
                paddingBottom: "0px",
                alignItems: "center",
              }}
            >
              <div>
                <div className="top-content" style={{display: "flex", flexDirection:"column", alignItems:"flex-start", gap:"6px"}}>
                <h1 style={{ margin:"0", fontWeight:"550", backgroundColor: "#EBEE41"}}>{project.projectName}</h1>
                <h3 style={{ margin:"0", fontWeight:"normal"}}>{project.description}</h3>
                </div>

                {/* Message shown after successful deletion */}
                {showDeleteMessage && (
                  <div>
                    <p>Project deleted!</p>
                    <Link to="/projects">
                      <Button onClick={() => setShowDeleteMessage(false)}>
                        OK
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              {!showAddTaskForm && !isDeleting && (
                <Button
                  icon="add"
                  color="#ebee41"
                  onClick={() => setShowAddTaskForm(true)}
                >
                  Add New Task
                </Button>
              )}
            </div>

            <div
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Formulário para adicionar uma nova tarefa */}
              {showAddTaskForm && (
                <AddTaskForm
                  onAddTask={handleAddTask}
                  onCancel={() => setShowAddTaskForm(false)}
                />
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "32px",
                }}
              >
                <div className="boardColumn" style={{ borderRadius: "7px" }}>
                  <h2>To do</h2>
                  {filteredTasks
                    .filter((task) => task.status === "pending")
                    .map((task, index) => (
                      <div key={task._id}>
                        <TaskMiniCard
                          setCardDetail={setCardDetail}
                          index={index}
                          task={task.task}
                          taskId={task._id}
                          status={task.status}
                          deadline={task.deadline}
                          subTasks={task.subTasks}
                        />
                      </div>
                    ))}
                </div>
                <div className="boardColumn" style={{ borderRadius: "7px" }}>
                  <h2>Doing</h2>
                  {filteredTasks
                    .filter((task) => task.status === "doing")
                    .map((task, index) => (
                      <div key={task._id}>
                        <TaskMiniCard
                          setCardDetail={setCardDetail}
                          index={index}
                          task={task.task}
                          taskId={task._id}
                          status={task.status}
                          deadline={task.deadline}
                          subTasks={task.subTasks}
                        />
                      </div>
                    ))}
                </div>
                <div className="boardColumn" style={{ borderRadius: "7px" }}>
                  <h2>Done</h2>
                  {filteredTasks
                    .filter((task) => task.status === "done")
                    .map((task, index) => (
                      <div key={task._id}>
                        <TaskMiniCard
                          setCardDetail={setCardDetail}
                          index={index}
                          task={task.task}
                          taskId={task._id}
                          status={task.status}
                          deadline={task.deadline}
                          subTasks={task.subTasks}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "16px",
          }}
        >
          {!isDeleting && (
            <Link
              to={`/projects/edit/${projectId}`}
              style={{ textDecoration: "none" }}
            >
              <Button icon="edit">Edit Project</Button>
            </Link>
          )}
          {!isDeleting && (
            <Button icon="delete" onClick={() => setIsDeleting(true)}>
              Delete Project
            </Button>
          )}
        </div>

        {isDeleting && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "center",
              gap: "4px",
              justifyContent: "center",
              margin: "10px",
              padding: "10px",
              borderRadius: "8px",
              width: "98%",
              height: "50px",
              marginBottom: "50px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "center",
                border: "2px solid black",
                background: "#ebee41",
                paddingRight: "10px",
                paddingLeft: "10px",
              }}
            >
              <p
                style={{
                  fontWeight: "600",
                }}
              >
                Are you sure you want to delete the project?
              </p>
              <input
                style={{
                  borderRadius: "5px",
                  border: "2px solid",
                  width: "300px",
                  margin: "20px",
                  fontWeight: "500",
                  backgroundColor: "none",
                }}
                type="text"
                value={inputProjectName}
                onChange={(e) => setInputProjectName(e.target.value)}
                placeholder="write the project name here"
              />

              <div style={{ display: "flex" }}>
                <Button onClick={handleDeleteProject}>Confirm</Button>
                <Button onClick={() => setIsDeleting(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {activeTask === null ? null : (
          <TaskCard
            setCardDetail={setCardDetail}
            taskId={activeTask._id}
            task={activeTask.task}
            estimatedTime={activeTask.estimatedTime}
            status={activeTask.status}
            deadline={activeTask.deadline}
            subTasks={activeTask.subTasks}
            updateTask={updateTask}
            onDeleteTask={handleDeleteTask}
            editTaskStatus={editTaskStatus}
          />
        )}
      </div>
    </>
  );
}

export default ProjectDetailsPage;
