import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles.css';

const BASE_UPLOAD_URL = "http://localhost:8080/uploads/";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      } else {
        setError('Failed to fetch cars');
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCarClick = (carId) => {
    navigate(`/car/${carId}`);
  };

  const getCarImage = (car) => {
    if (car.exteriorImages && car.exteriorImages.length > 0) {
      return BASE_UPLOAD_URL + car.exteriorImages[0];
    }
    if (car.interiorImages && car.interiorImages.length > 0) {
      return BASE_UPLOAD_URL + car.interiorImages[0];
    }
    return null;
  };

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div style={styles.loadingContainer}>
          <div className="loading-spinner"></div>
          <p style={styles.loadingText}>Loading cars...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Buy Used Cars</h1>
          <p style={styles.subtitle}>Find your perfect car from verified sellers</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {cars.length === 0 && !error ? (
          <div style={styles.emptyState}>
            <h2>No cars available</h2>
            <p>Check back later for new listings</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {cars.map((car) => {
              const imageUrl = getCarImage(car);
              const price = formatPrice(car.price);

              return (
                <div
                  key={car.id}
                  onClick={() => handleCarClick(car.id)}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={styles.imageContainer}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={car.title}
                        style={styles.carImage}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="240"%3E%3Crect fill="%23f0f0f0" width="400" height="240"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div style={styles.placeholderImage}>
                        <span>No Image</span>
                      </div>
                    )}
                    <div style={styles.assuredBadge}>VERIFIED</div>
                  </div>

                  <div style={styles.cardContent}>
                    <h3 style={styles.carTitle}>{car.title || 'Car Listing'}</h3>
                    
                    <div style={styles.specs}>
                      {car.kmDriven > 0 && (
                        <span style={styles.specTag}>
                          {(car.kmDriven / 1000).toFixed(1)}k km
                        </span>
                      )}
                      {car.fuelType && (
                        <span style={styles.specTag}>{car.fuelType}</span>
                      )}
                      {car.transmission && (
                        <span style={styles.specTag}>{car.transmission}</span>
                      )}
                    </div>

                    <div style={styles.location}>
                      {car.location}
                    </div>

                    <div style={styles.priceSection}>
                      <div style={styles.price}>{price}</div>
                      {car.price >= 100000 && (
                        <div style={styles.emi}>+ other charges</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
    minHeight: 'calc(100vh - 80px)'
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '18px',
    color: '#6B7280',
    marginTop: '8px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px'
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#6B7280'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  imageContainer: {
    width: '100%',
    height: '220px',
    position: 'relative',
    backgroundColor: '#F3F4F6',
    overflow: 'hidden'
  },
  carImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9CA3AF',
    fontSize: '14px',
    backgroundColor: '#F3F4F6'
  },
  assuredBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: '#2563EB',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  cardContent: {
    padding: '20px'
  },
  carTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '12px',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  specs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '12px'
  },
  specTag: {
    background: '#F3F4F6',
    color: '#4B5563',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  location: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '16px'
  },
  priceSection: {
    borderTop: '1px solid #E5E7EB',
    paddingTop: '16px'
  },
  price: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '4px'
  },
  emi: {
    fontSize: '12px',
    color: '#6B7280'
  }
};

export default Home;
