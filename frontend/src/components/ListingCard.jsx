import React from "react";

export default function ListingCard({ car }) {
  return (
    <div className="card">
      <h3>{car.make} {car.model}</h3>

      <p>Year: {car.yearOfManufacture}</p>
      <p>Price: ₹{car.price}</p>

      {car.photoUrls && car.photoUrls.length > 0 && (
        <img
          src={car.photoUrls[0]}
          alt="Car"
          style={{ maxWidth: 200, borderRadius: "6px" }}
          onError={(e) => (e.target.style.display = "none")}
        />
      )}
    </div>
  );
}
