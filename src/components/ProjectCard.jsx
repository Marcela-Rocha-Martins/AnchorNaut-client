import { Link } from "react-router-dom";

// We are deconstructing props object directly in the parentheses of the function
function ProjectCard({ projectName, description, _id, tasks }) {
  return tasks ? (
    <Link to={`/projects/${_id}`}>
    <div
      className="pressAnimation"
      style={{
        backgroundColor: "white",
        border: "2px solid black",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
     
        <h3>{projectName}</h3>
      
      <p style={{ maxWidth: "400px" }}>{description}</p>

      {/* Exibir a informação do total de tarefas e tarefas concluídas */}
      <p>{`${tasks.filter((task) => task.status === "done").length}/${
        tasks.length
      }`}</p>
    </div>
    </Link>
  ) : null;
}

export default ProjectCard;
