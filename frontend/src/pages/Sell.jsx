import React, { useState } from "react";
import API from "../services/api";

export default function Sell() {
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
  });
  const [file, setFile] = useState(null);

  async function submit(e) {
    e.preventDefault();

    const payload = {
      make: form.make,
      model: form.model,
      yearOfManufacture: Number(form.year),
      price: Number(form.price),
    };

    try {
      if (file) {
        const fd = new FormData();
        fd.append("file", file);

        const upload = await API.post("/upload", fd);
        if (upload?.url) {
          payload.photoUrls = [upload.url];
        }
      }

      await API.post("/cars", payload);
      alert("Submitted for approval");

      setForm({ make: "", model: "", year: "", price: "" });
      setFile(null);
    } catch {
      alert("Failed to submit car");
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>Sell Car</h2>

      <input placeholder="Make" value={form.make}
        onChange={(e) => setForm({ ...form, make: e.target.value })} />

      <input placeholder="Model" value={form.model}
        onChange={(e) => setForm({ ...form, model: e.target.value })} />

      <input placeholder="Year" value={form.year}
        onChange={(e) => setForm({ ...form, year: e.target.value })} />

      <input placeholder="Price" value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })} />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button type="submit">Submit</button>
    </form>
  );
}
