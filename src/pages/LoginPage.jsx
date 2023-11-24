import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Button } from "../components/Button";
import { useMediaQuery } from "react-responsive";

// const API_URL = "http://localhost:5005";
const API_URL = "https://anchornaut.cyclic.app"

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    axios
      .post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        console.log("JWT token", response.data.authToken);

        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div style={{ height: "100vh", position: "sticky" }}>
      <div className="wrapper">
        <h1 style={{ fontSize: isMobile ? "26px" : "36px", margin: "40px" }}>
          Hello again, AnchorNaut
        </h1>

        <div
          className="LoginPage"
          style={{
            width: isMobile ? "300px" : "400px",
            height: "450px",
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div
            className="form-wrapper"
            style={{
              padding: "10px",
              alignItems: "center",
            }}
          >
            <form onSubmit={handleLoginSubmit}>
              <label>Email:</label>
              <div>
                <input
                  type="email"
                  placeholder="youremail@here.com"
                  name="email"
                  value={email}
                  onChange={handleEmail}
                />
                <i className="fa-solid fa-envelope"></i>
              </div>

              <label>Password:</label>
              <div>
                <input
                  type="password"
                  placeholder="************"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                />
                <i className="fas fa-unlock-alt"></i>
              </div>

              <Button color="#EBEE41" type="submit">
                Login
              </Button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <div>
            <p>Don't have an account yet?</p>
            <button>
              <Link to={"/signup"}>Sign Up</Link>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
