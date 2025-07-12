import React from "react";

const RepairItem = ({ repair, onComplete }) => {
  return (
    <div style={styles.container}>
      <div>
        <p><strong>Report ID:</strong> {repair.reportId}</p>
        <p><strong>Email:</strong> {repair.email}</p>
        <p><strong>Status:</strong> {repair.status}</p>
        {repair.completedAt && (
          <p><strong>Completed At:</strong> {new Date(repair.completedAt).toLocaleString()}</p>
        )}
      </div>

      {repair.status === "pending" && (
        <input
          type="checkbox"
          onChange={() => onComplete(repair._id)}
          title="Mark as completed"
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "10px",
  },
};

export default RepairItem;
