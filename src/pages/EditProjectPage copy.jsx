import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";


// const API_URL = "http://localhost:5005";
const API_URL = process.env.VITE_REACT_APP_SERVER_URL || "http://localhost:5005";


function EditProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    // Get the token from the localStorage
    const storedToken = localStorage.getItem("authToken");

    // Send the token through the request "Authorization" Headers
    axios
      .get(`${API_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        const oneProject = response.data;
        setTitle(oneProject.title);
        setDescription(oneProject.description);
      })
      .catch((error) => console.log(error));
  }, [projectId]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const requestBody = { title, description };

    // Get the token from the localStorage
    const storedToken = localStorage.getItem("authToken");

    // Send the token through the request "Authorization" Headers
    axios
      .put(`${API_URL}/api/projects/${projectId}`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        navigate(`/projects/${projectId}`);
      });
  };

  const deleteProject = () => {
    // Get the token from the localStorage
    const storedToken = localStorage.getItem("authToken");

    // Send the token through the request "Authorization" Headers
    axios
      .delete(`${API_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => navigate("/projects"))
      .catch((err) => console.log(err));
  };

  return (
    <div
      style={{
        margin: "5px",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <h2 style={{ fontWeight: "550", margin: "40px" }}>
        Edit your project below
      </h2>
      <div
        className="EditProjectPage"
        style={{
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          border: "2px solid black",
          borderRadius: "8px",
          width: "300px",
          height: "350px",
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description:</label>
          <input
          style={{height: "80px"}}
            type="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          
        </form>
        <div className="buttons-edit-page" style={{display:"flex"}}>
        <Button color="#EBEE41" type="submit">Update Project</Button>
        <Link style={{textDecoration: "none"}} to={`/projects/${projectId}`}>
        <Button>Cancel</Button>
        </Link>
        </div>
      </div>
    </div>
  );
}

export default EditProjectPage;
