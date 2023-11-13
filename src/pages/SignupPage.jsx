import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/Button";
import { useMediaQuery } from "react-responsive";

// const API_URL = "http://localhost:5005";
const API_URL = process.env.VITE_REACT_APP_SERVER_URL 

// || "http://localhost:5005"; estava na linha de cima!!!!!!!!!!!!!

function SignupPage(props) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
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

    const requestBody = { email, password, name };

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
          margin: "5px",
          width: "100%",
          position: "fixed",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontWeight: "550", margin: "40px" }}>
          Become an AnchorNaut and turn your dreams into tangible plans
        </h2>
        <div
          className="SignupPage"
          style={{
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid black",
            borderRadius: "8px",
            width: isMobile ? "300px" : "400px",
            height: "450px",
            display: "flex",
            gap: "20px",
            flexDirection: "column",
          }}
        >
          <div
            className="form-wrapper"
            style={{ padding: "10px", alignItems: "center"}}
          >
            <form onSubmit={handleSignupSubmit}>
              <label style={{ fontWeight: "bold" }}>Email:</label>
              <div>
                <input
                  type="email"
                  placeholder="youremail@here.com"
                  name="email"
                  value={email}
                  onChange={handleEmail}
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
                  placeholder="************"
                  value={password}
                  onChange={handlePassword}
                />
                <i
                  className="fas fa-unlock-alt"
                  style={{ color: "#050505" }}
                ></i>
              </div>
              <label style={{ fontWeight: "bold", alignSelf: "center" }}>
                Name:
              </label>
              <div>
                <input
                  type="name"
                  placeholder="Your name here"
                  name="name"
                  value={name}
                  onChange={handleName}
                />
                <i class="fa-solid fa-user" style={{ color: "#050506" }}></i>
              </div>
              <Button color="#EBEE41" type="submit">
                Sign Up
              </Button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <div
              className="bottom-form"
              style={{ display: "flex", flexDirection: "column" }}
            >
            <p style={{ marginBottom: "0", fontSize: "16px" }}>
              Already have account?
            </p>
            <button
              style={{
                border: "none",
                backgroundColor: "white",
                fontSize: "16px",
                fontWeight: "550",
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
      </div>
    </body>
  );
}

export default SignupPage;
