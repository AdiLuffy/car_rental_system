import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "../styles.css";

export default function Admin() {
  const [pendingCars, setPendingCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingCars();
  }, []);

  const fetchPendingCars = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/pending");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPendingCars(data);
    } catch (err) {
      console.error("Error fetching cars:", err);
      alert("Failed to load pending cars");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (carId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/approve/${carId}`, {
        method: "POST"
      });
      
      if (!res.ok) throw new Error("Failed to approve");
      
      alert("Car approved successfully!");
      fetchPendingCars(); // Refresh list
    } catch (err) {
      console.error("Error approving car:", err);
      alert("Failed to approve car");
    }
  };

  const handleReject = async (carId) => {
    if (!window.confirm("Are you sure you want to reject this car listing?")) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:8080/api/admin/reject/${carId}`, {
        method: "DELETE"
      });
      
      if (!res.ok) throw new Error("Failed to reject");
      
      alert("Car rejected successfully!");
      fetchPendingCars(); // Refresh list
    } catch (err) {
      console.error("Error rejecting car:", err);
      alert("Failed to reject car");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loading}>
          <h2>Loading pending cars...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Admin Dashboard - Car Approval</h1>
          <p style={styles.subtitle}>
            Review and approve pending car listings
          </p>
        </div>

        {pendingCars.length === 0 ? (
          <div style={styles.empty}>
            <h2>No pending cars to review</h2>
            <p>All caught up! New submissions will appear here.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {pendingCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onApprove={() => handleApprove(car.id)}
                onReject={() => handleReject(car.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function CarCard({ car, onApprove, onReject }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div style={styles.card}>
      {/* Main Image */}
      {car.exteriorImages?.[0] && (
        <img
          src={`http://localhost:8080/uploads/${car.exteriorImages[0]}`}
          alt={car.title}
          style={styles.mainImage}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="240"%3E%3Crect fill="%23f0f0f0" width="400" height="240"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
      )}

      {/* Car Title & Price */}
      <div style={styles.cardContent}>
        <h3 style={styles.title}>{car.title}</h3>
        <p style={styles.price}>₹ {car.price?.toLocaleString()}</p>
        <p style={styles.location}>{car.location}</p>
        
        {/* Quick Info */}
        <div style={styles.quickInfo}>
          <span>{car.transmission || "N/A"}</span>
        </div>

        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={styles.detailsBtn}
        >
          {showDetails ? "Hide Details ▲" : "Show Details ▼"}
        </button>

        {/* Expanded Details */}
        {showDetails && (
          <div style={styles.details}>
            <h4 style={styles.sectionTitle}>Car Condition Checklist</h4>
            <CheckList
              items={[
                { label: "Spare Key Available", value: car.spareKey },
                { label: "No Accident History", value: car.noAccident },
                { label: "No Repaint", value: car.noRepaint },
                { label: "Fuel Efficient", value: car.fuelEfficient },
                { label: "No Water Damage", value: car.noWaterDamage },
                { label: "No Odometer Tampering", value: car.noOdometerTampering }
              ]}
            />

            {/* All Exterior Images */}
            {car.exteriorImages?.length > 1 && (
              <>
                <h4 style={styles.sectionTitle}>Exterior Images ({car.exteriorImages.length})</h4>
                <div style={styles.imageGrid}>
                  {car.exteriorImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:8080/uploads/${img}`}
                      alt={`Exterior ${idx + 1}`}
                      style={styles.thumbnail}
                      onClick={() => window.open(`http://localhost:8080/uploads/${img}`, '_blank')}
                    />
                  ))}
                </div>
              </>
            )}

            {/* All Interior Images */}
            {car.interiorImages?.length > 0 && (
              <>
                <h4 style={styles.sectionTitle}>Interior Images ({car.interiorImages.length})</h4>
                <div style={styles.imageGrid}>
                  {car.interiorImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:8080/uploads/${img}`}
                      alt={`Interior ${idx + 1}`}
                      style={styles.thumbnail}
                      onClick={() => window.open(`http://localhost:8080/uploads/${img}`, '_blank')}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Additional Info */}
            <div style={styles.infoBox}>
              <p><strong>Submitted:</strong> {new Date(car.createdAt).toLocaleDateString()}</p>
              {car.seller && <p><strong>Seller:</strong> {car.seller.name || car.seller.email}</p>}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={styles.actions}>
          <button onClick={onApprove} style={styles.approveBtn}>
            Approve
          </button>
          <button onClick={onReject} style={styles.rejectBtn}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckList({ items }) {
  return (
    <div style={styles.checkList}>
      {items.map((item, idx) => (
        <div key={idx} style={styles.checkItem}>
          <span style={item.value ? styles.checkYes : styles.checkNo}>
            {item.value ? "✓" : "✗"}
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 80px)",
    background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
    padding: "40px 20px"
  },
  header: {
    maxWidth: "1200px",
    margin: "0 auto 30px",
    textAlign: "center"
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "16px",
    marginTop: "10px"
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh"
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "16px",
    maxWidth: "600px",
    margin: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "auto"
  },
  card: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: "transform 0.3s"
  },
  mainImage: {
    width: "100%",
    height: "240px",
    objectFit: "cover",
    cursor: "pointer"
  },
  cardContent: {
    padding: "20px"
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#1f2937"
  },
  price: {
    fontSize: "26px",
    color: "#10b981",
    fontWeight: "bold",
    marginBottom: "8px"
  },
  location: {
    color: "#6b7280",
    marginBottom: "12px",
    fontSize: "14px"
  },
  quickInfo: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    fontSize: "14px",
    color: "#4b5563"
  },
  detailsBtn: {
    width: "100%",
    padding: "12px",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "15px",
    fontSize: "14px",
    transition: "background 0.2s"
  },
  details: {
    borderTop: "2px solid #e5e7eb",
    paddingTop: "15px",
    marginBottom: "15px"
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
    marginTop: "15px",
    color: "#374151"
  },
  checkList: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "8px",
    marginBottom: "15px"
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    padding: "6px",
    background: "#f9fafb",
    borderRadius: "6px"
  },
  checkYes: {
    color: "#10b981",
    fontWeight: "bold",
    fontSize: "18px"
  },
  checkNo: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: "18px"
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginBottom: "15px"
  },
  thumbnail: {
    width: "100%",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    cursor: "pointer",
    transition: "transform 0.2s"
  },
  infoBox: {
    background: "#f9fafb",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginTop: "15px"
  },
  actions: {
    display: "flex",
    gap: "10px"
  },
  approveBtn: {
    flex: 1,
    padding: "14px",
    background: "#10B981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.2s ease"
  },
  rejectBtn: {
    flex: 1,
    padding: "14px",
    background: "#EF4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.2s ease"
  }
};