import React from "react";

export const Button = ({ color = "white", onClick, icon, ...props }) => {
  

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
      }}
    >
      {icon ? <span className="material-icons-round">{icon}</span> : null}
      {props.children}
    </button>
  );
};
