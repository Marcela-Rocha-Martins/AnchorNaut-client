import React from "react";
import { Link } from "react-router-dom";

function HamburguerMenu({
  isLoggedIn,
  user,
  logOutUser,
  toggleHamburguerMenu,
}) {
  // Função para lidar com o clique em um item do menu hamburguer
  const handleItemClick = () => {
    // Fecha o menu hamburguer após um item ser clicado
    toggleHamburguerMenu();
  };

  return (
    <div
      className="menu-hamburguer-class"
      style={{ display: "grid", gridTemplateColumns:"1fr", position: "absolute", width:"100vw", top:"100px", left: "0", background: "rgba(0, 0, 0, 0.837)",
      backdropFilter: "blur(1rem)"}}
    >
        <Link className="link-menuhamburger" to="/" onClick={handleItemClick}>
          <button className="btn-menu-hamburguer">
            <i className="fas fa-home"></i> Home
          </button>
        </Link>

        {isLoggedIn && (
          <>
            <Link className="link-menuhamburger" to="/assistant" onClick={handleItemClick}>
              <button className="btn-menu-hamburguer">Dream Assistent</button>
            </Link>

            <Link className="link-menuhamburger" to="/projects" onClick={handleItemClick}>
              <button className="btn-menu-hamburguer">Projects</button>
            </Link>

            <Link className="link-menuhamburger" to="/projects" onClick={handleItemClick}>
              <button className="btn-menu-hamburguer">Dream log</button>
            </Link>

            <button
              className="btn-menu-hamburguer"
              onClick={() => {
                logOutUser();
                handleItemClick();
              }}
            >
              Logout
            </button>
            <span>{user && user.name}</span>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link className="link-menuhamburger" to="/signup" onClick={handleItemClick}>
              <button className="btn-menu-hamburguer">Sign Up</button>
            </Link>
            <Link className="link-menuhamburger" to="/login" onClick={handleItemClick}>
              <button className="btn-menu-hamburguer">Login</button>
            </Link>
          </>
        )}
      </div>
  );
}

export default HamburguerMenu;
