import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Icon } from 'leaflet';
import { NationalPark } from '../types/park';
import { Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const parkIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedParkIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map layer configurations
const mapLayers = {
  street: {
    name: 'Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics'
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors'
  },
  dark: {
    name: 'Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

interface MapControllerProps {
  selectedPark?: NationalPark;
}

const MapController: React.FC<MapControllerProps> = ({ selectedPark }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPark) {
      map.flyTo([selectedPark.latitude, selectedPark.longitude], 10, {
        duration: 2,
        easeLinearity: 0.25
      });
    }
  }, [selectedPark, map]);

  return null;
};

interface InteractiveMapProps {
  parks: NationalPark[];
  selectedPark?: NationalPark;
  onParkSelect: (park: NationalPark) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  parks, 
  selectedPark, 
  onParkSelect 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [currentLayer, setCurrentLayer] = useState<keyof typeof mapLayers>('street');
  const [showLayerPicker, setShowLayerPicker] = useState(false);

  // Fix: Invalidate map size on selectedPark change or mount
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current?.invalidateSize(), 200);
    }
  }, [selectedPark]);

  const toggleLayerPicker = () => {
    setShowLayerPicker(!showLayerPicker);
  };

  const selectLayer = (layerKey: keyof typeof mapLayers) => {
    setCurrentLayer(layerKey);
    setShowLayerPicker(false);
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        ref={mapRef}
        center={[39.8283, -98.5795]} // Center of US
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          key={currentLayer}
          attribution={mapLayers[currentLayer].attribution}
          url={mapLayers[currentLayer].url}
        />
        
        {parks.map((park) => (
          <Marker
            key={park.id}
            position={[park.latitude, park.longitude]}
            icon={selectedPark?.id === park.id ? selectedParkIcon : parkIcon}
            eventHandlers={{
              click: () => onParkSelect(park),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-semibold text-lg mb-2">{park.name}</h3>
                <p className="text-gray-600 mb-2">{park.state}</p>
                <p className="text-sm text-gray-700 mb-2">{park.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Established: {park.established}</div>
                  <div>Area: {park.area}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapController selectedPark={selectedPark} />
      </MapContainer>
      
      {/* Layer Picker Control */}
      <div className="absolute top-4 right-4 z-[1000]">
        <div className="relative">
          <button
            onClick={toggleLayerPicker}
            className={`bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 ${
              showLayerPicker ? 'bg-emerald-50 border-emerald-300' : ''
            }`}
            aria-label="Map layers"
          >
            <Layers className="w-5 h-5 text-gray-700" />
          </button>
          
          {showLayerPicker && (
            <div className="absolute top-full right-0 mt-2 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 min-w-[160px] overflow-hidden">
              {Object.entries(mapLayers).map(([key, layer]) => (
                <button
                  key={key}
                  onClick={() => selectLayer(key as keyof typeof mapLayers)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-emerald-50 ${
                    currentLayer === key 
                      ? 'bg-emerald-100 text-emerald-800 font-medium' 
                      : 'text-gray-700 hover:text-emerald-700'
                  }`}
                >
                  {layer.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedPark && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {selectedPark.name}
          </h3>
          <p className="text-emerald-600 font-medium mb-2">{selectedPark.state}</p>
          <p className="text-sm text-gray-700 mb-2">{selectedPark.description}</p>
          <div className="text-xs text-gray-500">
            <div>Established: {selectedPark.established}</div>
            <div>Area: {selectedPark.area}</div>
          </div>
        </div>
      )}
    </div>
  );
};