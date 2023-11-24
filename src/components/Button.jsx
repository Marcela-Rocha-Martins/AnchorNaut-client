import React from "react";
import { useMediaQuery } from "react-responsive";


export const Button = ({ color = "white", onClick, icon, ...props }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" }); //to responsiveness page

  return (
    <button
      onClick={onClick}
      className="pressAnimation"
      style={{
        backgroundColor: color,
        border: "2px solid black",
        cursor: "pointer",
        borderRadius: "9px",
        padding: "8px",
        fontWeight: "bold",
        display: "flex",
        textDecoration: "none",
        fontSize: isMobile ? "12px" : "16px",
        alignItems:"center",
        justifyContent: isMobile ? "center" : "flex-start", 

      }}
    >
      {icon ? <span className="material-icons-round">{icon}</span> : null}
      {props.children}
    </button>
  );
};
