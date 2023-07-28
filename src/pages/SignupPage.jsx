import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/Button";

const API_URL = "http://localhost:5005";

function SignupPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name };

    // Make an axios request to the API
    // If POST request is successful redirect to login page
    // If the request resolves with an error, set the error message in the state
    axios
      .post(`${API_URL}/auth/signup`, requestBody)
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        const errorDescription =
          error?.response?.data?.message || "An error occurred";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <body>
      <div
        style={{
          padding: "2%",
          width: "100vw",
          position: "fixed",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {" "}
        <div
          className="SignupPage"
          style={{
            paddingTop: "10px",
            alignItems: "center",
            backgroundColor: "white",
            border: "2px solid black",
            borderRadius: "8px",
          }}
        >
          <h1>Sign Up</h1>

          <div
            className="form-wrapper"
            style={{ padding: "10px", alignItems: "center" }}
          >
            <form onSubmit={handleSignupSubmit}>
              <label style={{ fontWeight: "bold" }}>Email:</label>
              <div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmail}
                  style={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: "8px",
                    padding: "5px",
                    width: "250px",
                  }}
                />
                <i
                  className="fa-solid fa-envelope"
                  style={{ color: "#050505" }}
                ></i>
              </div>

              <label style={{ fontWeight: "bold" }}>Password:</label>
              <div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                  style={{
                   
                    borderRadius: "8px",
                    padding: "5px",
                  }}
                />{" "}
                <i
                  className="fas fa-unlock-alt"
                  style={{ color: "#050505" }}
                ></i>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleName}
                  style={{
                    backgroundColor: "#E8F0FE",
                    borderRadius: "8px",
                    padding: "5px",
                  }}
                />
                <i class="fa-solid fa-user" style={{ color: "#050506" }}></i>
              </div>
              <Button color="#EBEE41" type="submit">
                Sign Up
              </Button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <p>Already have account?</p>

          <button
            style={{
              border: "none",
              backgroundColor: "white",
              fontSize: "16px",
            }}
          >
            <Link to={"/login"}> Login</Link>
            <i
              className="fa-solid fa-arrow-right"
              style={{ color: "#0c1018", marginLeft: "5px" }}
            ></i>
          </button>
        </div>
      </div>
    </body>
  );
}

export default SignupPage;
