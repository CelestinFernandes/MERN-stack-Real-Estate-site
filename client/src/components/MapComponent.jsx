// components/MapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

const MapView = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return null; // This component does not render anything itself
};

const MapComponent = ({ address }) => {
  const [position, setPosition] = useState([20.5937, 78.9629]); // Default location (India)

  // Function to fetch coordinates from a geocoding service
  const fetchCoordinates = async (address) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
    const data = await response.json();

    if (data && data.length > 0) {
        return [data[0].lat, data[0].lon];
    }
    return null; // Return null if no data found
  };

  useEffect(() => {
    const getCoordinates = async () => {
      const coords = await fetchCoordinates(address);
      if (coords) {
        setPosition(coords);
      }
    };
    getCoordinates();
  }, [address]);

  return (
    <div>
      <MapContainer
        center={position}
        zoom={5} 
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={position}>
          <Popup>{address}</Popup>
        </Marker>
        <MapView position={position} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
