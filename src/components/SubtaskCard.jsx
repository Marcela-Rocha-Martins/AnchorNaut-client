import React from "react";
import { Button } from "./Button";


export const SubtaskCard = ({
  subtask,
  handleEditSubtask,
  handleDeleteSubtask,
  handleSaveNewSubtasks,
  handleSubTaskChange,
  handleStatusChange,
  handleSubtaskStatusChange,
  handleCancelSubTask,
  handleSaveSubTask,
  editingSubTaskIndex,
  editedSubTask,
  index,
  handleDisapprove,
}) => {

  return (
    <div
      style={{
        backgroundColor: subtask.unsaved ? "white" : "#ECECEC",
        borderRadius: "8px",
        padding: "5px",
        marginTop: "5px",
        border: subtask.unsaved ? "2px dotted black" : "none",
      }}
    >
      {/* edditing subtasks --------------------------------------------------------------------------- */}
      {editingSubTaskIndex === index ? (
        <div>
          <form>
          <div
          style={{
            display: "flex",
            justifyContent:"center",
            alignItems: "center",
          }}
        >
            <input
              type="text"
              name="subTask"
              value={editedSubTask.subTask}
              onChange={handleSubTaskChange}
              style={{width:"95%", alignSelf: "center"}}
            />
            <div style={{display: "flex"}}>
            <Button icon="save" type="button" onClick={handleSaveSubTask}>
            </Button>
            <Button icon="" type="button" onClick={handleCancelSubTask}>
              Cancel
            </Button>
            </div>
            </div>
          </form>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto",
            alignItems: "center",
          }}
        >
          {!subtask.unsaved ? (
            <input
              onChange={() => handleSubtaskStatusChange(index)}
              type="checkbox"
              checked={subtask.status === "done"}
              style={{width: "24px", height: "24px", border: "1px black solid"}}
            ></input>
          ) : null}

          <p
            style={{
              textDecoration:
                subtask.status === "done" ? "line-through" : "none",
                textAlign: "left"
            }}
          >
            {subtask.subTask}
          </p>

          <p>
            {subtask.deadline && subtask.deadline.length > 0
              ? new Date(subtask.deadline[0]).toLocaleDateString()
              : null}
          </p>
          <div style={{ display: "flex", gap: "5px" }}>
            {!subtask.unsaved && (
              <div style={{ display: "flex", gap: "2px" }}>
                <Button icon="edit" onClick={() => handleEditSubtask(index)}></Button>
                <Button icon="delete" onClick={() => handleDeleteSubtask(index)}>
                </Button>
              </div>
            )}
            {subtask.unsaved ? (
          <div style={{ display: "flex", gap: "5px" }}>
          <Button icon="save" onClick={() => handleSaveNewSubtasks(index)}>
                </Button>
                <Button icon="delete" onClick={() => handleDisapprove(index)}></Button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
