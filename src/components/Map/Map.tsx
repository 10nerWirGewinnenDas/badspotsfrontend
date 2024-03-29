import React, { useRef } from 'react';

import './Map.css';
import Map, {
	LngLatBoundsLike,
	LngLatLike,
	MapRef,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import MarkerContainer from './Markers/MarkerContainer';
import LocationMarker from './Markers/Classes/LocationMarker/LocationMarker';

interface MapProps {
	formSubmitted: boolean;
	userPosition: {lng: number, lat: number} | null | null;
	setUserPosition: (position: {lng: number, lat: number} | null) => void;
}

export const berlinViewPosition: {lng: number, lat: number} = {lng: 13.388, lat: 52.5162};

const FreifahrenMap: React.FC<MapProps> = ({
	formSubmitted,
	userPosition,
	setUserPosition,
}) => {
    const sw: LngLatLike = {lng: 12.8364646484805, lat: 52.23115511676795}
    const ne: LngLatLike = {lng: 13.88044556529124, lat: 52.77063424239867}

	const maxBounds: LngLatBoundsLike = [sw, ne];

    const map = useRef<MapRef>(null);
	return (
        <div id='map-container' data-testid='map-container'>
            <Map
                data-testid='map'
                ref={map}
                id='map'
                initialViewState={{
                    longitude: berlinViewPosition.lng,
                    latitude: berlinViewPosition.lat,
                    zoom: 11,
                }}
                maxZoom={14}
                minZoom={10}
                maxBounds={maxBounds}

                mapStyle={`https://api.jawg.io/styles/jawg-streets.json?access-token=${process.env.REACT_APP_JAWG_ACCESS_TOKEN}`}
            >
                
               {formSubmitted && <LocationMarker userPosition={userPosition} setUserPosition={setUserPosition}/>}
               <MarkerContainer formSubmitted={formSubmitted} />

            </Map>
        </div>
	);
};

export default FreifahrenMap;
