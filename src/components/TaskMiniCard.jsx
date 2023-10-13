import React from "react";

function TaskMiniCard({
  task,
  setCardDetail,
  status,
  deadline,
  subTasks,
  index,
  taskId
}) {

  return (
    <div
    className="pressAnimation"
      style={{
        display: "flex",
        gap: "5px",
        border: "black solid 2px",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#fff",
        alignSelf: "center",
        padding: "24px",
        width:"90%",
        height:"180px",
        justifyContent: "center",
      }}
      onClick={() => setCardDetail(taskId)}
    >
      <div style={{alignSelf:"center", display:"flex", flexDirection:"column", gap: "50px"}}>
        <h3 style={{ marginBottom: "0px", margin:"0px", marginTop:"50px"}}>{task}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap:"32px", alignItems:"center"}}>
          <p style={{ display: "flex", alignItems: "center", gap:"4px", margin: "0px"}}>
            {deadline ? (
              <>
                <span className="material-icons-round">calendar_month</span>
                {new Date(deadline).toLocaleDateString()}
              </>
            ) : null}
          </p>
          
          {subTasks.length > 0
            ? (
              <h3 style={{display: "flex", alignItems: "center", gap:"4px", margin: "0px"}}> <span className="material-icons-outlined">task</span>
              {
                subTasks.filter((subtask) => subtask.status === "done").length
              }/ {subTasks.length}
              </h3> )
            : null}
        
        </div>
        
      </div>
    </div>
  );
}
export default TaskMiniCard;
