import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { Button } from "../components/Button";
import { useMediaQuery } from "react-responsive";

// const API_URL = "http://localhost:5005";
// const API_URL = process.env.VITE_REACT_APP_SERVER_URL || "http://localhost:5005";
const API_URL = "https://anchornaut.cyclic.app"

function HomePage() {
  const { user } = useContext(AuthContext);

  const isLoggedIn = !!user;

  const [dream, setDream] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projectLink, setProjectLink] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [projects, setProjects] = useState([]);

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
            Authorization: `Bearer ${token}`,
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
    const projectName = prompt("Enter a name for your new personal project");
  
    if (!projectName) {
      return;
    }
  
    try {
      // Crie o projeto primeiro
      const projectData = {
        projectName: projectName,
        user: user._id,
      };
  
      const projectResponse = await axios.post(
        `${API_URL}/api/projects`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const projectId = projectResponse.data._id;
  
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
  
     console.log(formattedTasks, "formatted tasks")
      const tasksResponse = await axios.post(
        `${API_URL}/api/tasks`,
        formattedTasks,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const projectLink = `/projects/${projectId}`;
      setProjectLink(projectLink);
      setShowAlert(true);
    } catch (error) {
      console.error("Error creating project and saving tasks:", error);
    }
  };

  // const handleApproveProjectEntry = async () => {
  //   const projectName = prompt("Enter a name for your new personal project:");

  //   if (!projectName) {
  //     return;
  //   }

  //   try {
  //     // Save all tasks and subtasks under the project
  //     const formattedTasks = tasks.map((task) => ({
  //       task: task.text,
  //       estimatedTime: task.time,
  //       project: null,
  //       status: "pending",
  //       deadline: null,
  //       subtasks: task.subTasks
  //         ? task.subTasks.map((subtask) => ({
  //             subtask: subtask.text,
  //             estimatedTime: subtask.time,
  //           }))
  //         : [],
  //     }));

  //     const tasksResponse = await axios.post(
  //       `${API_URL}/api/tasks`,
  //       formattedTasks,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const taskIds = tasksResponse.data.map((task) => task._id);
  //     console.log(taskIds, "tasks Ids");

  //     const projectData = {
  //       projectName: projectName,
  //       tasksId: taskIds,
  //       user: user._id,
  //     };

  //     console.log(projectData, "projectData");

  //     const projectResponse = await axios.post(
  //       `${API_URL}/api/projects`,
  //       projectData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const projectId = projectResponse.data._id;

  //     const projectLink = `/projects/${projectId}`;
  //     setProjectLink(projectLink);
  //     setShowAlert(true);
  //   } catch (error) {
  //     console.error("Error creating project and saving tasks:", error);
  //   }
  // };

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

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="HomePage" style={isMobile ? {} : { overflow: "hidden" }}>
      {isLoggedIn ? (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={isMobile ? { fontSize: "16px" } : { fontSize: "30px" }}>
              Transform your dreams into personal projects
            </h2>
            <p style={isMobile ? { fontSize: "14px" } : { fontSize: "18px" }}>
              Dream Assistant is a potent tool to transform your dreams into
              actionable projects. Just enter your goal, activate your Dream
              Assistant, and it suggests tasks for you to achieve it. You can
              approve, edit, and refine tasks to make your dreams come true
            </p>
            <p style={{ fontWeight: "550", weight: "auto" }}>
              Created by{" "}
              <a
                style={{ textDecoration: "none", backgroundColor: "#EBEE41" }}
                href="https://github.com/Marcela-Rocha-Martins"
                target="_blank"
              >
                Marcela Rocha
              </a>
            </p>
          </div>

          {tasks && tasks.length > 0 ? null : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
                gap: isMobile ? "0" : "40px",
              }}
            >
              {isMobile ? (
                <>
                  <input
                    type="text"
                    value={dream}
                    onChange={handleDreamChange}
                    placeholder="Enter your dream here"
                    style={{ width: "auto" }}
                  />
                  <Button
                    icon="rocket_launch"
                    color=" #EBEE41"
                    onClick={handleActivateAssistant}
                  >
                    {loading ? "Loading..." : "Activate Dream Assistant"}
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}

          <div>
            {tasks && tasks.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <div
                  className="project-entry-container"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    margin: "15px",
                  }}
                >
                  {showAlert ? null : (
                    <div
                      className="project-entry"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <h2>Tasks suggested by your Dream Assistant</h2>
                      <div style={{ display: "flex" }}>
                        <Button
                          color="#EBEE41"
                          onClick={handleApproveProjectEntry}
                        >
                          Approve project entry
                        </Button>
                        <Button
                          icon="delete"
                          onClick={() => setTasks([])}
                        >Delete project</Button>
                      </div>
                    </div>
                  )}

                  {showAlert && (
                    <div
                      className="project-entry2"
                      style={{
                        textAlign: "center",
                        // marginTop: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "2px dashed black",
                        borderRadius: "8px",
                        gap: "10px",
                        paddingBottom: "24px",
                      }}
                    >
                      <h2>Project created and tasks saved successfully!</h2>
                      <Link style={{ textDecoration: "none" }} to={projectLink}>
                        <Button color="#EBEE41">View Project Details</Button>
                      </Link>
                    </div>
                  )}
                </div>

                {showAlert ? null : (
                  <div
                    className="tasksContainer1"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
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
                )}
              </div>
            ) : (
              <div style={{ flex: "1", marginLeft: "10px" }}>
                {projects.length > 0 && (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            height: "100vh",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
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
                fontSize: isMobile ? "40px" : "60px",
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
                fontSize: isMobile ? "16px" : "20px",
                color: "#d1d1d1",
                textTransform: "uppercase",
                alignItems: "center",
                justifyContent: "center",
                margin: isMobile ? "20px 10px" : "20px 0",
              }}
            >
              Transform your craziest dreams into actionable and tangible
              personal projects{" "}
            </p>
            <Link to="/signup" style={{textDecoration: "none"}}>
              <Button
                className="pressAnimation"
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  padding: isMobile ? "10px 20px" : "15px 30px",
                }}
              >
                Sign up
              </Button>
            </Link>
          </div>
          <div
            className="achievements"
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "40px 80px",
            }}
          >
            <div
              className="work"
              style={{
                width: isMobile ? "100%" : "auto",
              }}
            >
              <i
                className="fas fa-atom"
                style={{
                  width: "fit-content",
                  fontSize: isMobile ? "30px" : "40px",
                  color: "#000000",
                  borderRadius: "50%",
                  border: "2px solid #E6EA3F",
                  padding: isMobile ? "8px" : "15px",
                }}
              ></i>
              <p
                className="work-heading"
                style={{
                  fontSize: isMobile ? "16px" : "20px",
                }}
              >
                Science based
              </p>
              <p
                className="work-text"
                style={{
                  fontSize: isMobile ? "13px" : "15px",
                }}
              >
                Navigate through a unique and personalized journey with our
                AI-powered assistant, AnchorNaut. Experience the depth of
                tailored support as it comprehends your aspirations profoundly,
                serving as your dream co-pilot
              </p>
            </div>
            <div
              className="work"
              style={{
                width: isMobile ? "120%" : "auto",
              }}
            >
              <i
                className="fas fa-comments"
                style={{
                  fontSize: isMobile ? "25px" : "35px",
                  color: "#000000",
                  borderRadius: "50%",
                  border: "2px solid #E6EA3F",
                  padding: isMobile ? "8px" : "15px",
                }}
              ></i>
              <p
                className="work-heading"
                style={{
                  fontSize: isMobile ? "16px" : "20px",
                }}
              >
                Personalized Guidance{" "}
              </p>
              <p
                className="work-text"
                style={{
                  fontSize: isMobile ? "13px" : "15px",
                }}
              >
                Embark on a personalized odyssey with our AI-powered personal
                assistant. Like a co-captain for your dreams, the AnchorNaut
                assistant provides tailored support, understanding your
                aspirations at a deeper level
              </p>
            </div>
            <div
              className="work"
              style={{
                width: isMobile ? "120%" : "auto",
              }}
            >
              <i
                className="fas fa-tasks"
                style={{
                  width: "fit-content",
                  fontSize: isMobile ? "30px" : "40px",
                  color: "#000000",
                  borderRadius: "50%",
                  border: "2px solid #E6EA3F",
                  padding: isMobile ? "8px" : "15px",
                }}
              ></i>
              <p
                className="work-heading"
                style={{
                  fontSize: isMobile ? "16px" : "20px",
                }}
              >
                Productivity Unleashed
              </p>
              <p
                className="work-text"
                style={{
                  fontSize: isMobile ? "13px" : "15px",
                }}
              >
                Enhance your productivity while you navigate your path to
                success! AnchorNaut simplifies your voyage with intuitive and
                user-friendly task lists, along with advanced tracking tools to
                ensure your progress
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
