import React, { Suspense, lazy, useMemo, useRef } from 'react';
import {
    LngLatBoundsLike,
    LngLatLike,
    MapRef,
    Marker,
} from 'react-map-gl/maplibre';

import MarkerContainer from './Markers/MarkerContainer';
import LocationMarker from './Markers/Classes/LocationMarker/LocationMarker';

import './Map.css';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = lazy(() => import('react-map-gl/maplibre'));

interface MapsProps {
    openModal: () => void;
    formSubmitted: boolean;
    userPosition: { lng: number, lat: number } | null | null;
    setUserPosition: (position: { lng: number, lat: number } | null) => void;
    isFirstOpen: boolean;
    newMarkerLocation: { lng: number | null, lat: number | null };
    setNewMarkerLocation: (position: { lng: number | null, lat: number | null }) => void;
}

export const berlinViewPosition: { lng: number, lat: number } = { lng: 13.388, lat: 52.5162 };

const BadspotsMap: React.FC<MapsProps> = ({
    openModal,
    formSubmitted,
    userPosition,
    setUserPosition,
    isFirstOpen,
    newMarkerLocation,
    setNewMarkerLocation
}) => {

    const SouthWestBounds: LngLatLike = { lng: 12.8364646484805, lat: 52.23115511676795 }
    const NorthEastBounds: LngLatLike = { lng: 13.88044556529124, lat: 52.77063424239867 }

    const maxBounds: LngLatBoundsLike = [SouthWestBounds, NorthEastBounds];

    const map = useRef<MapRef>(null);    
    
    useMemo(() => {
        if (userPosition) {
            map.current?.flyTo({
                center: [userPosition.lng, userPosition.lat],
                zoom: 14,
            });
        }
    }, [userPosition])

    return (
        <div id='map-container' data-testid='map-container'>
            <Map
                reuseMaps
                data-testid='map'
                ref={map}
                id='map'
                initialViewState={{
                    longitude: (userPosition?.lng) ? userPosition.lng  : berlinViewPosition.lng ,
                    latitude:  (userPosition?.lat) ? userPosition.lat  : berlinViewPosition.lat ,
                    zoom: 11,
                }}
                maxZoom={14}
                minZoom={10}

                maxBounds={maxBounds}

                mapStyle={`https://api.jawg.io/styles/f3354f40-2334-41b6-a537-c72decb830b2.json?access-token=${process.env.REACT_APP_JAWG_ACCESS_TOKEN}`}
            >
                <Suspense fallback={<div>Loading...</div>}>
                    {!isFirstOpen && <LocationMarker userPosition={userPosition} setUserPosition={setUserPosition} />}
                    <MarkerContainer  isFirstOpen={isFirstOpen} formSubmitted={formSubmitted} />
                </Suspense>


                
                {(newMarkerLocation.lat != null && newMarkerLocation.lng != null) && 
                   ( <Marker 
                        latitude={newMarkerLocation.lat as number} 
                        longitude={newMarkerLocation.lng as number}
                        draggable={true}
                        onDragEnd={(event) => {
                            setNewMarkerLocation({ lat: event.lngLat.lat, lng: event.lngLat.lng});
                            openModal();
                        }}
                   
                   >

                   </Marker>)}

                    
            </Map>
        </div>
    );
};

export default BadspotsMap;
