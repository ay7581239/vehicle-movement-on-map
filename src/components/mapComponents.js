import { useState, useRef } from "react";
import markerImage from "../assets/marker.webp";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useGeoLocation from "../customHooks/useGeoLocation";
import RoutingComponent from "./routingComponents";

const center = { lat: 17.385044, lng: 78.486671 };
const markerIcon = new L.Icon({
  iconUrl: markerImage,
  iconSize: [45, 45],
  popupAnchor: [0, -20],
});

const MapComponent = () => {
  const [position] = useState(center);
  const [routes, setRoutes] = useState({
    start: [],
    end: [],
  });
  const [startLat, setStartLat] = useState("");
  const [startLng, setStartLng] = useState("");
  const [endLat, setEndLat] = useState("");
  const [endLng, setEndLng] = useState("");
  const mapRef = useRef();
  const ZOOM = 9;

  const myLocation = useGeoLocation();

  const showMyLocation = () => {
    if (myLocation.loaded) {
      mapRef.current.flyTo(
        [myLocation.coordinates.lat, myLocation.coordinates.lng],
        ZOOM,
        { animate: true }
      );
    } else {
      alert(myLocation.error);
    }
  };
  const handleSetStart = () => {
    if (startLat && startLng) {
      setRoutes({
        ...routes,
        start: [parseFloat(startLat), parseFloat(startLng)],
      });
    }
  };

  const handleSetEnd = () => {
    if (endLat && endLng) {
      setRoutes({
        ...routes,
        end: [parseFloat(endLat), parseFloat(endLng)],
      });
    }
  };
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;

        if (routes.start.length === 0) {
          setRoutes({
            ...routes,
            start: [lat, lng],
          });
        } else {
          setRoutes({
            ...routes,
            end: [lat, lng],
          });
        }
      },
    });
    return null;
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center bg-gradient-to-br from-gray-700 via-gray-900 to-black p-8 rounded-2xl shadow-2xl">
  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 mb-4 drop-shadow-lg animate-bounce">
    Vehicle Movement Tracker
  </h1>
  
  <p className="text-lg text-gray-300 text-center max-w-lg bg-gray-800 p-4 rounded-lg shadow-md">
        Click on any two points on the map or input their latitude and longitude to set a route. 
        You can clear the route by clicking on the <strong>Reset the Route</strong> button below.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl">
        <div className="flex gap-4">
          <input
            type="number"
            step="any"
            value={startLat}
            onChange={(e) => setStartLat(e.target.value)}
            placeholder="Start Latitude"
            className="w-1/2 p-2 border border-gray-500 rounded-lg"
          />
          <input
            type="number"
            step="any"
            value={startLng}
            onChange={(e) => setStartLng(e.target.value)}
            placeholder="Start Longitude"
            className="w-1/2 p-2 border border-gray-500 rounded-lg"
          />
          <button
            onClick={handleSetStart}
            className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
          >
            Set Start
          </button>
        </div>
        <div className="flex gap-4">
          <input
            type="number"
            step="any"
            value={endLat}
            onChange={(e) => setEndLat(e.target.value)}
            placeholder="End Latitude"
            className="w-1/2 p-2 border border-gray-500 rounded-lg"
          />
          <input
            type="number"
            step="any"
            value={endLng}
            onChange={(e) => setEndLng(e.target.value)}
            placeholder="End Longitude"
            className="w-1/2 p-2 border border-gray-500 rounded-lg"
          />
          <button
            onClick={handleSetEnd}
            className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
          >
            Set End
          </button>
        </div>
      </div>
  
  <MapContainer
    center={position}
    zoom={ZOOM}
    ref={mapRef}
    className="w-full h-[500px] rounded-lg shadow-2xl border-2 border-teal-500"
  >
    <TileLayer
      attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=tnJjWx0rdsXDXVYRkvPC"
    />
    <MapClickHandler />
    {myLocation.loaded && (
      <Marker
        position={[myLocation.coordinates.lat, myLocation.coordinates.lng]}
        icon={markerIcon}
      ></Marker>
    )}
    {routes.start.length !== 0 && routes.end.length !== 0 && (
      <RoutingComponent
        map={mapRef.current}
        start={routes.start}
        end={routes.end}
      />
    )}
  </MapContainer>
  
  <div className="flex gap-8 mt-6">
    <button
      onClick={showMyLocation}
      className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-110 transition duration-300 ease-in-out"
    >
      Show My Location 🌐
    </button>
    
    <button
      onClick={() => setRoutes({ start: [], end: [] })}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-110 transition duration-300 ease-in-out"
    >
      Reset the Route
    </button>
  </div>
</div>

  );
};

export default MapComponent;
