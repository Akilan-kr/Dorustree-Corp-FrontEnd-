import React from "react";

const ConfirmModal = ({
  show,
  title = "Confirm Action",
  message = "Are you sure?",
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h4 style={{ marginBottom: "10px" }}>{title}</h4>
        <p style={{ color: "#555" }}>{message}</p>

        <div style={buttonContainer}>
          <button onClick={onCancel} style={cancelBtn}>
            Cancel
          </button>

          <button onClick={onConfirm} style={confirmBtn}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "350px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const buttonContainer = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "space-between",
};

const cancelBtn = {
  padding: "8px 15px",
  borderRadius: "6px",
  border: "none",
  background: "#7f8c8d",
  color: "#fff",
  cursor: "pointer",
};

const confirmBtn = {
  padding: "8px 15px",
  borderRadius: "6px",
  border: "none",
  background: "#e74c3c",
  color: "#fff",
  cursor: "pointer",
};

export default ConfirmModal;
