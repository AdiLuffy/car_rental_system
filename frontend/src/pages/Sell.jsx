import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import '../styles.css';

export default function Sell() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);

    const checkboxFields = [
      "spareKey",
      "noAccident",
      "noRepaint",
      "fuelEfficient",
      "noWaterDamage",
      "noOdometerTampering"
    ];

    checkboxFields.forEach((field) => {
      if (!formData.has(field)) {
        formData.append(field, false);
      }
    });

    try {
      const res = await fetch("http://localhost:8080/api/cars", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to post car" }));
        setError(errorData.error || "Failed to post car. Please check all fields.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      alert("Car posted successfully! Waiting for admin approval.");
      e.target.reset();
      navigate("/home");
    } catch (err) {
      console.error("Error posting car:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1>Sell Your Car</h1>
            <p style={styles.subtitle}>List your car and reach thousands of buyers</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={submit} style={styles.form}>
            <Section title="Basic Information">
              <Input name="title" placeholder="Car Title (e.g., 2018 Honda City VX)" required />
              <Input name="price" type="number" placeholder="Price (₹)" required min="0" />
              <Input name="location" placeholder="Location (City, State)" required />
              <Input name="transmission" placeholder="Transmission (Manual / Automatic)" />
              <Input name="model" placeholder="Model" />
              <Input name="fuelType" placeholder="Fuel Type (Petrol / Diesel / Electric)" />
              <Input name="regYear" type="number" placeholder="Registration Year" min="1900" max="2026" />
              <Input name="kmDriven" type="number" placeholder="Kilometers Driven" min="0" />
              <Input name="engineCc" type="number" placeholder="Engine CC" min="0" />
              <Input name="ownership" placeholder="Ownership (1st / 2nd / 3rd)" />
              <Input name="regNumber" placeholder="Registration Number" />
              <Input name="insurance" placeholder="Insurance Details" />
            </Section>

            <Section title="Car Condition">
              <Checkbox name="spareKey" label="Spare Key Available" />
              <Checkbox name="noAccident" label="No Accident History" />
              <Checkbox name="noRepaint" label="No Repaint" />
              <Checkbox name="fuelEfficient" label="Fuel Efficient" />
              <Checkbox name="noWaterDamage" label="No Water Damage" />
              <Checkbox name="noOdometerTampering" label="No Odometer Tampering" />
            </Section>

            <Section title="Upload Images">
              <UploadBox
                label="Exterior Images"
                name="exteriorImages"
                required
              />
              <UploadBox
                label="Interior Images"
                name="interiorImages"
              />
            </Section>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={styles.submitButton}
            >
              {loading ? (
                <>
                  <span className="loading-spinner" style={{ width: '20px', height: '20px', marginRight: '8px' }}></span>
                  Posting Car...
                </>
              ) : (
                'Post Car for Sale'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <div style={styles.sectionGrid}>
        {children}
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <div style={styles.inputWrapper}>
      <input
        {...props}
        style={styles.input}
      />
    </div>
  );
}

function Checkbox({ label, name }) {
  return (
    <label style={styles.checkbox}>
      <input type="checkbox" name={name} value="true" style={styles.checkboxInput} />
      <span style={styles.checkboxLabel}>{label}</span>
    </label>
  );
}

function UploadBox({ label, name, required }) {
  return (
    <div style={styles.uploadBox}>
      <label style={styles.uploadLabel}>{label}</label>
      <input
        type="file"
        name={name}
        multiple
        accept="image/*"
        required={required}
        style={styles.fileInput}
      />
      <p style={styles.uploadHint}>You can upload multiple images</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 80px)",
    background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
    padding: "40px 20px"
  },
  card: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  subtitle: {
    fontSize: "16px",
    color: "#6B7280",
    marginTop: "8px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "32px"
  },
  section: {
    marginBottom: "32px"
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "2px solid #E5E7EB"
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px"
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    padding: "14px 16px",
    fontSize: "16px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    transition: "all 0.2s ease"
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "#F9FAFB",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  checkboxInput: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
    accentColor: "#FF6B35"
  },
  checkboxLabel: {
    fontSize: "15px",
    color: "#374151",
    fontWeight: "500"
  },
  uploadBox: {
    border: "2px dashed #FF6B35",
    padding: "24px",
    borderRadius: "12px",
    textAlign: "center",
    background: "#FFF5F2",
    transition: "all 0.2s ease"
  },
  uploadLabel: {
    display: "block",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#1F2937",
    fontSize: "15px"
  },
  fileInput: {
    marginBottom: "8px",
    cursor: "pointer"
  },
  uploadHint: {
    fontSize: "13px",
    color: "#6B7280",
    margin: "8px 0 0 0"
  },
  submitButton: {
    width: "100%",
    padding: "18px",
    fontSize: "18px",
    fontWeight: "700",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};
