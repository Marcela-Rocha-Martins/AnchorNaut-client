import React, { useImperativeHandle, useState } from "react";
import axios from "axios";
import TaskItem from "../components/TaskItem";

const API_URL = "http://localhost:5005";

const DreamAssistantPage = () => {
  const [dream, setDream] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

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

      console.log(projectData, "Project Name");
      // console.log(projectName);
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

      // Save all tasks and subtasks under the project
      const formattedTasks = tasks.map((task) => ({
        taskId: task._id,
        task: task.text,
        estimatedTime: task.time,
        project: projectId,
        status: "pending",
        deadline: null,
        subtasks: task.subTasks
          ? task.subTasks.map((subtask) => ({ subtask: subtask.text, estimatedTime: subtask.time  }))
          : [],
      }));

      console.log(formattedTasks, "formatted tasks, porra");

      await axios.post(`${API_URL}/api/tasks`, formattedTasks, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Project created and tasks saved successfully!");
    } catch (error) {
      console.error("Error creating project and saving tasks:", error);
    }
  };

  return (
    <div>
      <h2>Transform Your Dreams into Personal Projects</h2>
      <p>
        Dream Assistant is a powerful tool that helps you turn your dreams and
        aspirations into actionable personal projects. Simply enter your dream,
        activate the Dream Assistant, and it will provide you with a list of
        suggested tasks to achieve your dream. You can approve, edit, and break
        down tasks further to make your dreams a reality.
      </p>

      <div>
        <h2>My Dream Assistant</h2>
        <div>
          <input
            type="text"
            value={dream}
            onChange={handleDreamChange}
            placeholder="Enter your dream here"
          />
          <button onClick={handleActivateAssistant}>
            {loading ? "Loading..." : "Activate Dream Assistant"}
          </button>
        </div>

        {tasks ? (
          <div>
            <h3>Tasks suggested by Dream Assistant:</h3>
            <div>
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
            <button onClick={handleApproveProjectEntry}>
              Approve Project Entry
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DreamAssistantPage;
