import { useEffect, useState } from "react";
import API from "../services/api";

export default function Home() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    API.get("/cars").then(res => setCars(res.data));
  }, []);

  return (
    <>
      <h1>Cars</h1>
      {cars.map(c => (
        <div key={c.id}>
          <h3>{c.name}</h3>
          <p>{c.price}</p>
        </div>
      ))}
    </>
  );
}
