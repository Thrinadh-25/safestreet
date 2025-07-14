import React, { useEffect, useState } from "react";
import RepairItem from "../components/RepairManagement/Repairitem";
import { getAllRepairs, completeRepair } from '../utils/api'; 


const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const data = await getAllRepairs(); // ✅ using api helper
      setRepairs(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching repairs:", err);
      setLoading(false);
    }
  };

  const handleComplete = async (repairId) => {
    try {
      const updated = await completeRepair(repairId); // ✅ using api helper
      setRepairs((prev) =>
        prev.map((r) =>
          r._id === repairId
            ? { ...r, status: "completed", completedAt: new Date() }
            : r
        )
      );
      alert("Marked as completed and user notified!");
    } catch (err) {
      console.error("Error updating repair:", err);
    }
  };

  const pendingRepairs = repairs.filter((r) => r.status === "pending");
  const completedRepairs = repairs.filter((r) => r.status === "completed");

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.page}>
      <h2>🛠️ Pending Repairs</h2>
      {pendingRepairs.length === 0 ? (
        <p>No pending repairs.</p>
      ) : (
        pendingRepairs.map((repair) => (
          <RepairItem
            key={repair._id}
            repair={repair}
            onComplete={handleComplete}
          />
        ))
      )}

      <h2 style={{ marginTop: "40px" }}>✅ Completed Repairs</h2>
      {completedRepairs.length === 0 ? (
        <p>No completed repairs.</p>
      ) : (
        completedRepairs.map((repair) => (
          <RepairItem key={repair._id} repair={repair} />
        ))
      )}
    </div>
  );
};

const styles = {
  page: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
};

export default Repairs;
