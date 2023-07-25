import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import anchorNautGIF from "../assets/iconBlackBG.gif";
import { useMediaQuery } from "react-responsive";
import HamburguerMenu from "./NavbarMobile"; 


function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  // Define a media query para o breakpoint 769px
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Estado para controlar a visibilidade do menu hamburguer
  const [showHamburguerMenu, setShowHamburguerMenu] = useState(false);

  // Função para alternar a visibilidade do menu hamburguer
  const toggleHamburguerMenu = () => {
    setShowHamburguerMenu(!showHamburguerMenu);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black py-6 px-4 flex justify-between items-center" style={{ backgroundColor: "black", position: "sticky", top: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "right", padding: "10px" }}>
        <img src={anchorNautGIF} alt="AnchorNaut" className="mr-auto" style={{ width: "80px", height: "80px" }} />

        {/* Renderiza o botão do menu hamburguer para alternar a visibilidade do menu */}
        {isMobile ? (
          <button className="icon-hamburger-menu" onClick={toggleHamburguerMenu} style={{ background: "black", border: "none", fontSize: "20px", color: "white", cursor: "pointer"}}>
            <i className="fas fa-bars"></i>
          </button>
          ) : (

          <div style={{ justifyContent: "right", alignContents: "center" }}>
            <Link to="/">
              <button className="btn-menu">
                <i className="fas fa-home"></i> Home
              </button>
            </Link>

            {isLoggedIn && (
              <>
                <Link to="/assistant">
                  <button className="btn-menu">Dream Assistent</button>
                </Link>

                <Link to="/projects">
                  <button className="btn-menu">Projects</button>
                </Link>

                <Link to="/projects">
                  <button className="btn-menu">Dream log</button>
                </Link>

                <button className="btn-menu" onClick={logOutUser}>
                  Logout
                </button>
                <span className="user-name" style={{ color: 'white' }}>{user && user.name}</span>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link to="/signup">
                  {" "}
                  <button className="btn-menu">Sign Up</button>{" "}
                </Link>
                <Link to="/login">
                  {" "}
                  <button className="btn-menu">Login</button>{" "}
                </Link>
              </>
            )}
          </div>
        )}

        {/* Renderiza o componente HamburguerMenu dentro do menu hamburguer se showHamburguerMenu for true */}
        {showHamburguerMenu && (
          <HamburguerMenu
            isLoggedIn={isLoggedIn}
            user={user}
            logOutUser={logOutUser}
            toggleHamburguerMenu={toggleHamburguerMenu}
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
