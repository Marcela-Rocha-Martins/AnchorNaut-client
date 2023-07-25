import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import TaskCard from "../components/TaskCard";

const API_URL = "http://localhost:5005";

function ProjectDetailsPage(props) {
  const [project, setProject] = useState(null);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      // Get the token from the localStorage
      const storedToken = localStorage.getItem('authToken');
      console.log(storedToken, "token before fetching project");
      try {
        // Fetch project details
        const projectResponse = await axios.get(
          `${API_URL}/api/projects/${projectId}`,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
        const fetchedProject = projectResponse.data;
  
        console.log(projectResponse.data, "axios projects");
  
        // Fetch task details for each task in the project
        const tasksResponse = await axios.get(
          `${API_URL}/api/tasks/${projectId}`,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
        const fetchedTasks = tasksResponse.data;
  
        console.log(tasksResponse.data, "Tasks");
        
        // Update the project with the full task details
        setProject({
          ...fetchedProject,
          tasks: fetchedTasks,
        });
      } catch (error) {
        console.log("Error fetching project:", error);
      }
    };
  
    fetchProject();
  }, [projectId]);
  

  return (
    <div className="ProjectDetails">
      {project ? (
        <>
          <h1>{project.projectName}</h1>
          
          {/* Lista de tasks e subtasks */}
          <div>
            {project.tasks.map((task) => (
              <div key={task._id}>
                {/* Informações da task e botões */}
                <TaskCard
                  task={task.task}
                  estimatedTime={task.estimatedTime}
                  status={task.status}
                  deadline={task.deadline}
                  subTasks={task.subTasks}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
      
      <Link to="/projects">
        <button>See all projects</button>
      </Link>

      <Link to={`/projects/edit/${projectId}`}>
        <button>Edit Project</button>
      </Link>
    </div>
  );
}

export default ProjectDetailsPage;



// return (
//     <div className="ProjectDetails">
//       {project ? (
//         <>
//           <h1>{project.projectName}</h1>
//           <p>{project.description}</p>
//         </>
//       ) : (
//         <p>Loading...</p>
//       )}
//     <AddTask refreshProject={getProject} projectId={projectId} />

//     { project && project.tasks.map((task) => <TaskCard key={task._id} {...task} /> )}

//     <Link to="/projects">
//       <button>See all projects</button>
//     </Link>

//     <Link to={`/projects/edit/${projectId}`}>
//       <button>Edit Project</button>
//     </Link>

//   </div>
// );
