import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import anchorNautGIF from "../assets/iconBlackBG.png";
import { useMediaQuery } from "react-responsive";


function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" }); //to responsiveness page

  return (
    <nav className="sticky top-0 z-50 w-full bg-black py-6 px-4 flex justify-between items-center" style={{ backgroundColor: "black", position: "sticky", top: 0, zIndex: "1000" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "right", padding: "10px" }}>
        <img src={anchorNautGIF} alt="AnchorNaut" className="mr-auto" style={{ width: "80px", height: "80px" }} />

        <div style={{ justifyContent: "right", alignContents: "center" }}>
          <Link to="/">
            <button className="btn-menu" style={{ fontSize: isMobile ? "12px" : "15px" }}>
              <i className="fas fa-home"></i> Home
            </button>
          </Link>

          {isLoggedIn ? (
            <>
              {/* <Link to="/assistant">
                <button className="btn-menu">About AnchorNaut</button>
              </Link>  */}

              {/* <Link to="/projects">
                <button className="btn-menu">Projects</button>
              </Link> */}

              <button className="btn-menu" style={{ fontSize: isMobile ? "12px" : "15px"}} onClick={logOutUser}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup">
                {" "}
                <button className="btn-menu" style={{ fontSize: isMobile ? "12px" : "15px"}}>Sign Up</button>{" "}
              </Link>
              <Link to="/login">
                {" "}
                <button className="btn-menu" style={{ fontSize: isMobile ? "12px" : "15px"}}>Login</button>{" "}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
