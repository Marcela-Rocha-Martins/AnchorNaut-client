import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Button } from "../components/Button";

const API_URL = "http://localhost:5005";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

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
    <div style={{ height: "100vh", position:"sticky" }}>
      <div className="wrapper" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor:"" }}>
        
        <h1>Hello again, AnchorNaut</h1>
       
        <div className="LoginPage" style={{ backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center", border: "2px solid black", borderRadius: "8px" }}>
          <div className="form-group" style={{width:"100%"}}>
            <form onSubmit={handleLoginSubmit}>


                <label style={{ fontWeight: "bold"}}>Email:</label>
                <div>
                <input
                  type="email"
                  placeholder="youremail@here.com"
                  name="email"
                  value={email}
                  onChange={handleEmail}
                  style={{ backgroundColor: "#f2f2f2", borderRadius: "8px", padding: "5px", width:"250px" }}
                />
                <i className="fa-solid fa-envelope" style={{ color: "#050505" }}></i>
             </div>
  
              <div className="form-wrapper" style={{ padding: "10px" }}>
                <label style={{ fontWeight: "bold" }}>Password:</label>
                <input
                  type="password"
                  placeholder="************"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                  style={{ backgroundColor: "#f2f2f2", borderRadius: "8px", padding: "5px" }}
                />
                <i className="fas fa-unlock-alt" style={{ color: "#050505" }}></i>
              </div>
  
              <Button color="#EBEE41" type="submit">Login</Button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
  
          <p style={{ paddingBottom: "0px", marginTop: "5px" }}>Don't have an account yet?</p>
          <div style={{ display: "flex", alignItems: "center", paddingBottom: "5px" }}>
            <button style={{ border: "none", backgroundColor: "white", fontSize: "16px" }}>
              <Link to={"/signup"}>Sign Up</Link>
              <i className="fa-solid fa-arrow-right" style={{ color: "#0c1018", marginLeft: "5px" }}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default LoginPage;

// return (
//   <div className="LoginPage">
//     <h1>Login</h1>

//     <form onSubmit={handleLoginSubmit}>
//       <label>Email:</label>
//       <input type="email" name="email" value={email} onChange={handleEmail} />

//       <label>Password:</label>
//       <input
//         type="password"
//         name="password"
//         value={password}
//         onChange={handlePassword}
//       />

//       <button type="submit">Login</button>
//     </form>
//     {errorMessage && <p className="error-message">{errorMessage}</p>}

//     <p>Don't have an account yet?</p>
//     <Link to={"/signup"}> Sign Up</Link>
//   </div>
// );
