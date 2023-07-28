import { Link } from "react-router-dom";


// We are deconstructing props object directly in the parentheses of the function
function ProjectCard ( { projectName, description, _id, tasks } ) {
  
 return tasks ? (
    <div className="pressAnimation" style={{backgroundColor:"white",border:"2px solid black", borderRadius:"8px", padding:"16px"}}>
      <Link to={`/projects/${_id}`}>
        <h3>{projectName}</h3>
      </Link>
      <p style={{ maxWidth: "400px" }}>{description}</p>

      {/* Exibir a informação do total de tarefas e tarefas concluídas */}
      <p>{`${tasks.filter(task => task.status === "done").length}/${tasks.length}`}</p>
    </div>
  ) : null;
}

export default ProjectCard;