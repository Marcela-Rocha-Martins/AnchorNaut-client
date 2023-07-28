import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { Button } from "../components/Button";

const API_URL = "http://localhost:5005";

function HomePage() {
  const { user } = useContext(AuthContext);

  // Variável para controlar o status de login
  const isLoggedIn = !!user;

  const [dream, setDream] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projectLink, setProjectLink] = useState(null); // Estado para armazenar o link do projeto criado
  const [showAlert, setShowAlert] = useState(false); // Estado para controlar a exibição do alerta
  const [projects, setProjects] = useState([]); // Adicione o estado para armazenar os projetos

  const token = localStorage.getItem("authToken");

  const handleDreamChange = (event) => {
    setDream(event.target.value);
  };

  const handleActivateAssistant = async () => {
    setLoading(true);
    console.log("JWT Token before request:", token);
    try {
      const response = await axios.post(
        `${API_URL}/api/assistant`,
        { prompt: dream },
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the request headers
          },
        }
      );
      setTasks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error calling Dream Assistant API:", error);
      setLoading(false);
    }
  };

  const handleDeleteTask = (taskToDelete) => {
    const updatedTasks = tasks.filter((task) => task !== taskToDelete);
    setTasks(updatedTasks);
  };

  const handleApproveProjectEntry = async () => {
    // Show a prompt to the user to enter a name for the new project
    const projectName = prompt("Enter a name for your new personal project:");

    if (!projectName) {
      // If the user clicks "Cancel" or leaves the name blank, do nothing
      return;
    }

    try {
      // Create the project in the database
      const projectData = {
        projectName: projectName,
      };

      // Create the project first
      const projectResponse = await axios.post(
        `${API_URL}/api/projects`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract the projectId from the response
      const projectId = projectResponse.data._id;

      // Save all tasks and subtasks under the project
      const formattedTasks = tasks.map((task) => ({
        task: task.text,
        estimatedTime: task.time,
        project: projectId,
        status: "pending",
        deadline: null,
        subtasks: task.subTasks
          ? task.subTasks.map((subtask) => ({
              subtask: subtask.text,
              estimatedTime: subtask.time,
            }))
          : [],
      }));

      console.log(formattedTasks, "formatted tasks");

      // Create the tasks and update the project with the task IDs
      const tasksResponse = await axios.post(
        `${API_URL}/api/tasks`,
        formattedTasks,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract the task IDs from the response
      const taskIds = tasksResponse.data.map((task) => task._id);
      console.log(taskIds, "tasks Ids");

      // Criar o link para a página de detalhes do projeto após criar o projeto com sucesso
      const projectLink = `/projects/${projectId}`;
      setProjectLink(projectLink); // Atualizar o estado projectLink com o link do projeto criado

      // Mostrar o alerta com o botão "View Project Details"
      setShowAlert(true);
    } catch (error) {
      console.error("Error creating project and saving tasks:", error);
    }
  };

  const getAllProjects = () => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setProjects(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <div className="HomePage" style={{ overflow: "hidden" }}>
      {isLoggedIn ? (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <h2>Transform Your Dreams into Personal Projects</h2>
            <p>
              Dream Assistant is a powerful tool that helps you turn your dreams
              and aspirations into actionable personal projects. Simply enter
              your dream, activate the Dream Assistant, and it will provide you
              with a list of suggested tasks to achieve your dream. You can
              approve, edit, and break down tasks further to make your dreams a
              reality.
            </p>
          </div>

          <div style={{}}>
            {tasks && tasks.length > 0 ? null : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "40px",
                }}
              >
                <input
                  type="text"
                  value={dream}
                  onChange={handleDreamChange}
                  placeholder="Enter your dream here"
                  style={{ width: "100%" }}
                />
                <Button
                  icon="rocket_launch"
                  color=" #EBEE41"
                  onClick={handleActivateAssistant}
                >
                  {loading ? "Loading..." : "Activate Dream Assistant"}
                </Button>
              </div>
            )}
            <div>
              {tasks && tasks.length > 0 ? (
                <div>
                  <div
                    style={{ display: "grid", gridTemplateColumns: "1fr auto" }}
                  >
                    <h3>Tasks suggested by Dream Assistant:</h3>
                    <div style={{ display: "flex" }}>
                      <Button
                        color="#EBEE41"
                        onClick={handleApproveProjectEntry}
                      >
                        Approve Project Entry
                      </Button>
                      <Button
                        icon="delete"
                        onClick={() => setTasks([])}
                      ></Button>
                    </div>
                  </div>
                  {tasks.map((task, index) => (
                    <TaskItem
                      key={index + "task"}
                      task={task}
                      onDelete={handleDeleteTask}
                      token={token}
                      tasks={tasks}
                      setTasks={setTasks}
                      i={index}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ flex: "1", marginLeft: "10px" }}>
                  <h2>Projects List</h2>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    {projects.map((project) => (
                      <ProjectCard key={project._id} {...project} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {showAlert && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <h2>Project created and tasks saved successfully!</h2>
              <Link to={projectLink}>
                <button>View Project Details</button>
              </Link>
              <button onClick={() => setShowAlert(false)}>Close</button>
            </div>
          )}
        </div>
      ) : (
        // Se estiver deslogado, exibe uma mensagem de boas-vindas ou redireciona para outra página
        <>
          <div
            style={{
              height: "100vh",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <video
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                height: "520px",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -1,
              }}
            >
              <source
                src="https://res.cloudinary.com/dpzheb9o3/video/upload/v1690482802/production_id_4955252_1080p_nuu4yq.mp4"
                type="video/mp4"
              />
            </video>

            <div
              className="intro"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "520px",
                position: "relative",
              }}
            >
              <h1
                className="intro-title"
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "60px",
                  color: "#fff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  margin: "0",
                }}
              >
                AnchorNaut
              </h1>
              <p
                className="work-text"
                style={{
                  fontSize: "20px",
                  color: "#d1d1d1",
                  textTransform: "uppercase",
                  margin: "20px 0",
                }}
              >
                Transform your craziest dreams into actionable and tangible
                personal projects{" "}
              </p>
              <button
                className="pressAnimation"
                style={{
                  backgroundColor: "white",
                  border: "2px solid black",
                  cursor: "pointer",
                  borderRadius: "9px",
                  padding: "8px",
                  fontWeight: "bold",
                  display: "flex",
                  textDecoration: "none",
                  fontSize: "16px",
                }}
              >
                Sign up
              </button>
            </div>
            <div
              className="achievements"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "40px 80px",
              }}
            >
              <div
                className="work"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0 40px",
                }}
              >
                <i
                  className="fas fa-atom"
                  style={{
                    width: "fit-content",
                    fontSize: "40px",
                    color: "#000000",
                    borderRadius: "50%",
                    border: "2px solid #E6EA3F",
                    padding: "15px",
                  }}
                ></i>
                <p
                  className="work-heading"
                  style={{
                    fontSize: "20px",
                    color: "#333333",
                    textTransform: "uppercase",
                    margin: "10px 0",
                  }}
                >
                  Science based
                </p>
                <p
                  className="work-text"
                  style={{
                    fontSize: "15px",
                    color: "#585858",
                    margin: "10px 0",
                  }}
                >
                  Navigate through success with confidence, knowing your dreams
                  are anchored in research-backed methodologies{" "}
                </p>
              </div>
              <div
                className="work"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0 40px",
                }}
              >
                <i
                  className="fas fa-comments"
                  style={{
                    width: "fit-content",
                    fontSize: "40px",
                    color: "#000000",
                    borderRadius: "50%",
                    border: "2px solid #E6EA3F",
                    padding: "15px",
                  }}
                ></i>
                <p
                  className="work-heading"
                  style={{
                    fontSize: "20px",
                    color: "#333333",
                    textTransform: "uppercase",
                    margin: "10px 0",
                  }}
                >
                  Personalized Guidance{" "}
                </p>
                <p
                  className="work-text"
                  style={{
                    fontSize: "15px",
                    color: "#585858",
                    margin: "10px 0",
                  }}
                >
                  Embark on a personalized odyssey with our AI-powered personal
                  assistant. Like a co-captain for your dreams, the AnchorNaut
                  assistant provides tailored support, understanding your
                  aspirations at a deeper level{" "}
                </p>
              </div>
              <div
                className="work"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0 40px",
                }}
              >
                <i
                  className="fas fa-tasks"
                  style={{
                    width: "fit-content",
                    fontSize: "40px",
                    color: "#000000",
                    borderRadius: "50%",
                    border: "2px solid #E6EA3F",
                    padding: "15px",
                  }}
                ></i>
                <p
                  className="work-heading"
                  style={{
                    fontSize: "20px",
                    color: "#333333",
                    textTransform: "uppercase",
                    margin: "10px 0",
                  }}
                >
                  Productivity Unleashed
                </p>
                <p
                  className="work-text"
                  style={{
                    fontSize: "15px",
                    color: "#585858",
                    margin: "10px 0",
                  }}
                >
                  Boost productivity as you set sail towards greatness!
                  AnchorNaut streamlines your voyage with intuitive task lists,
                  and tracking tools{" "}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
