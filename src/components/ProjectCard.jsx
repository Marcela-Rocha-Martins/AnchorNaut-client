import { Link } from "react-router-dom";

// We are deconstructing props object directly in the parentheses of the function
function ProjectCard({ projectName, description, _id, tasks }) {
  return tasks ? (
    <Link to={`/projects/${_id}`} style={{textDecoration: "none"}}>
      <div
        className="pressAnimation"
        style={{
          backgroundColor: "white",
          border: "2px solid black",
          borderRadius: "8px",
          padding: "16px",
          width: "366px",
          height: "133px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <h3 style={{ margin: "0px" }}>{projectName}</h3>

        <p style={{ maxWidth: "400px", margin: "0px" }}>{description}</p>

        {/* Exibir a informação do total de tarefas e tarefas concluídas */}
        <p style={{ margin: "0px" }}>{`${
          tasks.filter((task) => task.status === "done").length
        }/${tasks.length}`}</p>
      </div>
    </Link>
  ) : null;
}

export default ProjectCard;
