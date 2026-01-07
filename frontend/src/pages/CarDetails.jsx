import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles.css';

const BASE_UPLOAD_URL = "http://localhost:8080/uploads/";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('exterior');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cars/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCar(data);
      } else {
        setError('Car not found');
      }
    } catch (err) {
      console.error('Error fetching car details:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentImages = () => {
    if (!car) return [];
    switch (selectedTab) {
      case 'exterior':
        return car.exteriorImages || [];
      case 'interior':
        return car.interiorImages || [];
      default:
        return car.exteriorImages || [];
    }
  };

  const getCurrentImage = () => {
    const images = getCurrentImages();
    if (images.length > 0 && currentImageIndex < images.length) {
      return BASE_UPLOAD_URL + images[currentImageIndex];
    }
    return null;
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedTab]);

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Test Drive Request for ${car.title}: ${formData.message}`
        })
      });
      if (response.ok) {
        alert('Test drive request submitted successfully!');
        setShowTestDriveModal(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      alert('Failed to submit request');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message || `Interested in ${car.title}`
        })
      });
      if (response.ok) {
        alert('Contact request submitted successfully!');
        setShowContactModal(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      alert('Failed to submit request');
    }
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
          <p>Loading car details...</p>
        </div>
      </>
    );
  }

  if (error || !car) {
    return (
      <>
        <NavBar />
        <div style={styles.errorContainer}>
          <h2>{error || 'Car not found'}</h2>
          <button onClick={() => navigate('/home')} className="btn-primary">
            Back to Listings
          </button>
        </div>
      </>
    );
  }

  const images = getCurrentImages();
  const currentImage = getCurrentImage();

  return (
    <>
      <NavBar />
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Left Side - Images */}
          <div style={styles.imageSection}>
            <div style={styles.mainImageContainer}>
              {currentImage ? (
                <>
                  <img
                    src={currentImage}
                    alt={`${car.title} - ${selectedTab}`}
                    style={styles.mainImage}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23f0f0f0" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                        disabled={currentImageIndex === 0}
                        style={{
                          ...styles.navButton,
                          left: '16px',
                          opacity: currentImageIndex === 0 ? 0.5 : 1
                        }}
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                        disabled={currentImageIndex === images.length - 1}
                        style={{
                          ...styles.navButton,
                          right: '16px',
                          opacity: currentImageIndex === images.length - 1 ? 0.5 : 1
                        }}
                      >
                        ›
                      </button>
                      <div style={styles.imageCounter}>
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div style={styles.noImage}>No {selectedTab} image available</div>
              )}
            </div>

            {/* Image Tabs */}
            <div style={styles.tabs}>
              <button
                onClick={() => setSelectedTab('exterior')}
                style={{
                  ...styles.tab,
                  ...(selectedTab === 'exterior' ? styles.tabActive : {})
                }}
              >
                Exterior
              </button>
              <button
                onClick={() => setSelectedTab('interior')}
                style={{
                  ...styles.tab,
                  ...(selectedTab === 'interior' ? styles.tabActive : {})
                }}
              >
                Interior
              </button>
            </div>
          </div>

          {/* Right Side - Details */}
          <div style={styles.detailsSection}>
            <h1 style={styles.title}>{car.title || 'Car Listing'}</h1>

            <div style={styles.specsGrid}>
              {car.kmDriven > 0 && (
                <div style={styles.specItem}>
                  <div style={styles.specLabel}>Kilometers</div>
                  <div style={styles.specValue}>{car.kmDriven.toLocaleString()} km</div>
                </div>
              )}
              {car.transmission && (
                <div style={styles.specItem}>
                  <div style={styles.specLabel}>Transmission</div>
                  <div style={styles.specValue}>{car.transmission}</div>
                </div>
              )}
              {car.fuelType && (
                <div style={styles.specItem}>
                  <div style={styles.specLabel}>Fuel Type</div>
                  <div style={styles.specValue}>{car.fuelType}</div>
                </div>
              )}
              {car.regYear && (
                <div style={styles.specItem}>
                  <div style={styles.specLabel}>Year</div>
                  <div style={styles.specValue}>{car.regYear}</div>
                </div>
              )}
            </div>

            {car.location && (
              <div style={styles.location}>
                {car.location}
              </div>
            )}

            <div style={styles.priceBox}>
              <div style={styles.priceLabel}>Price</div>
              <div style={styles.price}>{formatPrice(car.price)}</div>
              {car.price >= 100000 && (
                <div style={styles.priceNote}>+ other charges</div>
              )}
            </div>

            {/* Features */}
            {(car.spareKey || car.noAccident || car.fuelEfficient) && (
              <div style={styles.features}>
                <h3 style={styles.featuresTitle}>Key Features</h3>
                <div style={styles.featuresList}>
                  {car.spareKey && <div style={styles.featureItem}>Spare Key Available</div>}
                  {car.noAccident && <div style={styles.featureItem}>No Accident History</div>}
                  {car.fuelEfficient && <div style={styles.featureItem}>Fuel Efficient</div>}
                  {car.noRepaint && <div style={styles.featureItem}>No Repaint</div>}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={styles.actions}>
              <button
                onClick={() => setShowTestDriveModal(true)}
                className="btn-primary"
                style={styles.primaryButton}
              >
                Book Free Test Drive
              </button>
              <button
                onClick={() => setShowContactModal(true)}
                className="btn-secondary"
                style={styles.secondaryButton}
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      {showTestDriveModal && (
        <div style={styles.modalOverlay} onClick={() => setShowTestDriveModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Book Test Drive</h2>
            <form onSubmit={handleTestDriveSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                style={styles.input}
              />
              <textarea
                placeholder="Message (optional)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="4"
                style={styles.textarea}
              />
              <div style={styles.modalActions}>
                <button type="submit" className="btn-primary">Submit Request</button>
                <button type="button" onClick={() => setShowTestDriveModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div style={styles.modalOverlay} onClick={() => setShowContactModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Contact Seller</h2>
            <form onSubmit={handleContactSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                style={styles.input}
              />
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="4"
                required
                style={styles.textarea}
              />
              <div style={styles.modalActions}>
                <button type="submit" className="btn-primary">Send Message</button>
                <button type="button" onClick={() => setShowContactModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  mainImageContainer: {
    width: '100%',
    height: '450px',
    position: 'relative',
    backgroundColor: '#F3F4F6',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  imageCounter: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500'
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9CA3AF',
    fontSize: '16px'
  },
  tabs: {
    display: 'flex',
    gap: '12px'
  },
  tab: {
    flex: 1,
    padding: '12px',
    background: '#F3F4F6',
    color: '#6B7280',
    border: '2px solid #E5E7EB',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tabActive: {
    background: '#FF6B35',
    color: 'white',
    borderColor: '#FF6B35'
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1F2937',
    margin: 0
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    padding: '20px',
    background: '#F9FAFB',
    borderRadius: '12px'
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  specLabel: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  specValue: {
    fontSize: '16px',
    color: '#1F2937',
    fontWeight: '600'
  },
  location: {
    fontSize: '16px',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  priceBox: {
    padding: '24px',
    background: '#F9FAFB',
    borderRadius: '12px',
    border: '2px solid #E5E7EB'
  },
  priceLabel: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '8px',
    fontWeight: '500'
  },
  price: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: '4px'
  },
  priceNote: {
    fontSize: '14px',
    color: '#6B7280'
  },
  features: {
    padding: '20px',
    background: '#F9FAFB',
    borderRadius: '12px'
  },
  featuresTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1F2937'
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  featureItem: {
    fontSize: '15px',
    color: '#1F2937',
    padding: '8px 0',
    borderBottom: '1px solid #E5E7EB'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  primaryButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px'
  },
  secondaryButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  input: {
    marginBottom: '16px'
  },
  textarea: {
    marginBottom: '16px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  }
};

export default CarDetails;
