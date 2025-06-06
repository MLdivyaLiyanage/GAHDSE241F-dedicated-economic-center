import { useState, useEffect } from 'react';

function App() {
  const [map, setMap] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);                                                                                                                       
  
  // Sri Lanka coordinates (center of the country)
  const sriLankaCoords = { lat: 7.8731, lng: 80.7718 };

  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsAPI = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDZennffc4I2wa2NDZeSi233YpTRl6P18g&libraries=places`;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => setErrorMsg('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      try {
        // Create new Google Map centered on Sri Lanka
        const mapInstance = new window.google.maps.Map(document.getElementById('google-map'), {
          center: sriLankaCoords,
          zoom: 8,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [{ "color": "#f5f5f5" }]
            },
            {
              "elementType": "labels.icon",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#616161" }]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#f5f5f5" }]
            },
            {
              "featureType": "administrative.country",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#2563eb" }, { "weight": 2 }]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#bdbdbd" }]
            },
            {
              "featureType": "administrative.province",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#8B4513" }]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{ "color": "#eeeeee" }]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#757575" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [{ "color": "#c1e7c3" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#9e9e9e" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [{ "color": "#dadada" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#75CFF0" }]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#3d5a80" }]
            }
          ]
        });

        // Add a marker for the center of Sri Lanka
        new window.google.maps.Marker({
          position: sriLankaCoords,
          map: mapInstance,
          title: 'Dedicated Economic Centre Sri Lanka',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#DC2626',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        // Draw Sri Lanka outline with polygon (simplified coordinates)
        const sriLankaBoundary = [
          {lat: 9.8358, lng: 80.2041}, // Northern point
          {lat: 8.7925, lng: 81.1787}, // Eastern point
          {lat: 7.8731, lng: 81.8593}, // East coast
          {lat: 6.9271, lng: 81.7917}, // Southeast
          {lat: 6.0350, lng: 81.1159}, // Southern point
          {lat: 6.0542, lng: 80.2504}, // Southwest coast
          {lat: 7.2374, lng: 79.8708}, // Western coast
          {lat: 8.7261, lng: 79.8989}, // Northwestern area
          {lat: 9.8358, lng: 80.2041}  // Back to Northern point
        ];

        const sriLankaPolygon = new window.google.maps.Polygon({
          paths: sriLankaBoundary,
          strokeColor: '#2563EB',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#93C5FD',
          fillOpacity: 0.35
        });
        
        sriLankaPolygon.setMap(mapInstance);
        
        // Add some initial markers for key cities
        const initialMarkers = [
          { id: 1, name: 'Colombo', lat: 6.9271, lng: 79.8612 },
          { id: 2, name: 'Kandy', lat: 7.2906, lng: 80.6337 },
          { id: 3, name: 'Galle', lat: 6.0535, lng: 80.2210 },
          { id: 4, name: 'Jaffna', lat: 9.6615, lng: 80.0255 },
          { id: 5, name: 'Trincomalee', lat: 8.5922, lng: 81.2143 }
        ];
        
        initialMarkers.forEach(location => {
          const marker = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: mapInstance,
            title: location.name,
            animation: window.google.maps.Animation.DROP
          });
          
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="font-weight:bold">${location.name}</div>`
          });
          
          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
          });
        });
        
        setMap(mapInstance);
        setMarkers(initialMarkers);
        setIsLoading(false);
      } catch (error) {
        setErrorMsg(`Error initializing map: ${error.message}`);
        setIsLoading(false);
      }
    };

    loadGoogleMapsAPI();

    return () => {
      // Cleanup function
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !map) return;
    
    setIsLoading(true);
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ 
      address: searchQuery + ', Sri Lanka',
      bounds: new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(5.9, 79.4),  // SW corner of Sri Lanka
        new window.google.maps.LatLng(9.9, 81.9)   // NE corner of Sri Lanka
      )
    }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const newLocation = {
          id: Date.now(),
          name: searchQuery,
          lat: location.lat(),
          lng: location.lng()
        };
        
        // Add marker to map
        const marker = new window.google.maps.Marker({
          position: { lat: newLocation.lat, lng: newLocation.lng },
          map: map,
          title: newLocation.name,
          animation: window.google.maps.Animation.DROP
        });
        
        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="font-weight:bold">${newLocation.name}</div>`
        });
        
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
        
        // Pan to the location
        map.panTo(location);
        map.setZoom(11);
        
        setMarkers([...markers, newLocation]);
        setSearchQuery('');
      } else {
        alert(`Location not found in Sri Lanka: ${status}`);
      }
      setIsLoading(false);
    });
  };

  const clearMarkers = () => {
    // Reset the map view to entire Sri Lanka
    if (map) {
      map.setCenter(sriLankaCoords);
      map.setZoom(8);
    }
    setMarkers([]);
  };

  return (
    <>
      {/* Inline CSS - Optimized for full screen */}
      <style>
        {`
:root {
  /* Sri Lanka-inspired color palette */
  --primary-color: #2563eb;      /* Blue from the flag */
  --primary-hover: #1d4ed8;
  --accent-color: #dc2626;       /* Red from the flag */
  --accent-hover: #b91c1c;
  
  /* Two main background colors */
  --bg-primary: #f8fafc;         /* Main background */
  --bg-secondary: #e2e8f0;       /* Secondary background for cards, boxes, etc. */
  
  --text-color: #334155;
  --light-text: #f1f5f9;
  --success: #10b981;
  --warning: #f59e0b; 
  --error: #ef4444;
  --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --transition-fast: 0.2s ease;
  --transition-standard: 0.3s ease;
}

/* Reset and base styles with improved accessibility */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: 'Inter', 'Roboto', 'Segoe UI', system-ui, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bg-primary);
}

/* Sri Lanka-styled header with decorative elements */
header {
  text-align: center;
  padding: 1.5rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-primary);
  border-bottom: 1px solid #e2e8f0;
  z-index: 10;
}

header h1 {
  color: var(--primary-color);
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  position: relative;
  display: inline-block;
}

header h1::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 25%;
  width: 50%;
  height: 3px;
  background-color: var(--accent-color);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.5s ease;
}

header:hover h1::after {
  transform: scaleX(1);
}

.header-info {
  font-size: 1.1rem;
  color: #64748b;
  margin-top: 0.75rem;
}

/* Flag-inspired decorative element */
.flag-colors {
  display: flex;
  margin-top: 1rem;
  border-radius: 4px;
  overflow: hidden;
  width: 200px;
}

.flag-colors div {
  height: 6px;
}

.color-yellow {
  background-color: #F9BC24;
  flex: 2;
}

.color-green {
  background-color: #018749;
  flex: 1;
}

.color-orange {
  background-color: #FF7722;
  flex: 2;
}

.color-maroon {
  background-color: #800000;
  flex: 1;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.dashboard-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.sidebar {
  width: 30%;
  max-width: 450px;
  min-width: 300px;
  padding: 1.5rem;
  overflow-y: auto;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: var(--bg-primary);
}

.map-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Enhanced search section with better spacing and visual feedback */
.search-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: var(--bg-primary);
}

.search-row {
  display: flex;
  gap: 0.5rem;
}

form {
  display: flex;
  flex: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05));
}

input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem 0 0 0.5rem;
  outline: none;
  transition: border-color var(--transition-standard);
  background-color: white;
}

input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

input::placeholder {
  color: #94a3b8;
}

/* Improved button styling with better hover states */
button {
  padding: 0.75rem 1.25rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0 0.5rem 0.5rem 0;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color var(--transition-fast), transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

button:hover {
  background-color: var(--primary-hover);
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}

.clear-btn {
  background-color: #64748b;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

.clear-btn:hover {
  background-color: #475569;
}

/* Enhanced map container with depth and visual interest */
.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-secondary);
}

#google-map {
  width: 100%;
  height: 100%;
}

.map-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  background-color: rgba(30, 41, 59, 0.85);
  color: var(--light-text);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1;
}

.map-info-details {
  display: flex;
  flex-direction: column;
}

/* Better loading and error states */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--primary-color);
  z-index: 20;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(37, 99, 235, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
  color: var(--error);
  text-align: center;
  font-size: 1.2rem;
  gap: 1rem;
  background-color: var(--bg-secondary);
}

.error-message button {
  margin-top: 1rem;
  border-radius: 0.5rem;
}

/* Enhanced location list with hover effects */
.content-section {
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.content-section h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.country-info {
  background-color: var(--bg-secondary);
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.country-info h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-size: 1.25rem;
  font-weight: 600;
}

.facts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.fact-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  background-color: var(--bg-primary);
  transition: transform var(--transition-standard);
}

.fact-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--card-shadow);
}

.fact-title {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.location-list {
  background-color: var(--bg-secondary);
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.location-list h3 {
  margin-bottom: 1.25rem;
  color: var(--primary-color);
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-list ul {
  list-style: none;
  max-height: 400px;
  overflow-y: auto;
}

.location-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.875rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color var(--transition-fast);
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  background-color: var(--bg-primary);
}

.location-list li:hover {
  background-color: var(--bg-secondary);
}

.location-list li:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.location-name {
  font-weight: 500;
}

footer {
  text-align: center;
  color: #64748b;
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  background-color: var(--bg-primary);
}

.footer-note {
  font-style: italic;
}

/* Advanced responsive design */
@media (max-width: 1200px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    max-width: none;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem;
    flex: 0 0 auto;
    max-height: 40vh;
    overflow-y: auto;
  }
  
  .map-column {
    flex: 1;
  }
}

@media (max-width: 768px) {
  header {
    padding: 1rem;
  }
  
  header h1 {
    font-size: 2rem;
  }
  
  .search-row {
    flex-direction: column;
  }
  
  form {
    width: 100%;
  }
  
  input, button {
    border-radius: 0.5rem;
  }
  
  .clear-btn {
    width: 100%;
  }
  
  .sidebar {
    max-height: 50vh;
  }
}

/* Dark mode support with only two background colors */
@media (prefers-color-scheme: dark) {
  :root {
    /* Two main background colors for dark mode */
    --bg-primary: #0f172a;   /* Main dark background */
    --bg-secondary: #1e293b; /* Secondary darker background */
    --text-color: #e2e8f0;
    --light-text: #f8fafc;
  }
  
  input {
    background-color: var(--bg-primary);
    border-color: #334155;
    color: #f1f5f9;
  }
  
  input::placeholder {
    color: #64748b;
  }
  
  .location-list li {
    border-color: #334155;
  }
  
  footer {
    border-color: #334155;
    color: #94a3b8;
  }
}
        `}
      </style>
    
      {/* App Content - Restructured for full screen */}
      <div className="app-container">
        <header>
          <h1>Dedicated Economic Centre Sri Lanka</h1>
          <div className="header-info">Discover the Pearl of the Indian Ocean</div>
          <div className="flag-colors">
            <div className="color-maroon"></div>
            <div className="color-orange"></div>
            <div className="color-yellow"></div>
            <div className="color-green"></div>
          </div>
        </header>
        
        <main>
          <div className="search-section">
            <div className="search-row">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search for a location in Sri Lanka..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoading || !map}
                />
                <button type="submit" disabled={isLoading || !searchQuery.trim() || !map}>
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </form>
              {markers.length > 0 && (
                <button className="clear-btn" onClick={clearMarkers}>
                  Reset Map
                </button>
              )}
            </div>
          </div>

          <div className="dashboard-layout">
            <div className="sidebar">
              <div className="country-info">
                <h3>About Sri Lanka</h3>
                <div className="facts-grid">
                  <div className="fact-card">
                    <div className="fact-title">Capital</div>
                    <div>Colombo (commercial)<br/>Sri Jayawardenepura Kotte (administrative)</div>
                  </div>
                  <div className="fact-card">
                    <div className="fact-title">Languages</div>
                    <div>Sinhala, Tamil, English</div>
                  </div>
                  <div className="fact-card">
                    <div className="fact-title">Population</div>
                    <div>Approximately 22 million</div>
                  </div>
                  <div className="fact-card">
                    <div className="fact-title">Famous For</div>
                    <div>Ceylon Tea, Cinnamon, Ancient Ruins, Beaches</div>
                  </div>
                </div>
              </div>

              {markers.length > 0 && (
                <div className="location-list">
                  <h3>Marked Locations</h3>
                  <ul>
                    {markers.map((marker) => (
                      <li key={marker.id}>
                        <strong className="location-name">{marker.name}</strong>
                        <span>Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="map-column">
              <div className="map-container">
                {isLoading && (
                  <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <div>Loading map of Sri Lanka...</div>
                  </div>
                )}
                
                {errorMsg ? (
                  <div className="error-message">
                    <div>{errorMsg}</div>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                  </div>
                ) : (
                  <div id="google-map"></div>
                )}
                
                <div className="map-info">
                  <div>Sri Lanka Explorer</div>
                  <div>Total locations: {markers.length}</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer>
          <p>Sri Lanka Explorer © 2025</p>
        </footer>
      </div>
    </>
  );
}

export default App;