import { useEffect, useState } from "react";

export default function Admin() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/pending")
      .then(res => res.json())
      .then(setCars);
  }, []);

  const approve = (id) => {
    fetch(`http://localhost:8080/api/admin/approve/${id}`, {
      method: "PATCH"
    }).then(() => window.location.reload());
  };

  return (
    <>
      <h2>Admin</h2>
      {cars.map(c => (
        <div key={c.id}>
          {c.name}
          <button onClick={() => approve(c.id)}>Approve</button>
        </div>
      ))}
    </>
  );
}
