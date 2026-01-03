import { useEffect, useState } from "react";

export default function Home() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/cars")
      .then(res => res.json())
      .then(setCars);
  }, []);

  return (
    <>
      <h2>Buy Cars</h2>
      {cars.map(c => (
        <div key={c.id}>{c.name}</div>
      ))}
    </>
  );
}
