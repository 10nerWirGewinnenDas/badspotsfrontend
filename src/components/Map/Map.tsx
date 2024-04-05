import React, {lazy, useMemo, useRef } from 'react';
import {
    LngLatBoundsLike,
    LngLatLike,
    MapRef,
    Marker,
    Popup
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

export const berlinViewPosition: { lng: number, lat: number } = {lng: 13.124869779929298, lat: 52.39252123352503}

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
    
    const [isNewMarkerPopupOpen, setIsNewMarkerPopupOpen] = React.useState<boolean>(false);

    useMemo(() => {
        if (userPosition) {
            map.current?.flyTo({
                center: [userPosition.lng, userPosition.lat],
                zoom: 14,
            });
        }
    }, [userPosition])

    const handlePopupSubmit = () => {
        openModal();
        setIsNewMarkerPopupOpen(false);
    }

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
                    zoom: 15,
                }}
                maxZoom={18}
                minZoom={14}

                maxBounds={maxBounds}

                mapStyle={`https://api.jawg.io/styles/jawg-streets.json?access-token=${process.env.REACT_APP_JAWG_ACCESS_TOKEN}`}
            >   

               
                    {!isFirstOpen && <LocationMarker userPosition={userPosition} setUserPosition={setUserPosition} />}
                    <MarkerContainer  isFirstOpen={isFirstOpen} formSubmitted={formSubmitted} />
                


                
                {(newMarkerLocation.lat != null && newMarkerLocation.lng != null) && 
                   ( <Marker 
                        latitude={newMarkerLocation.lat as number} 
                        longitude={newMarkerLocation.lng as number}
                        
                        draggable={true}
                        onDragEnd={(event) => {
                            setNewMarkerLocation({ lng: event.lngLat.lng, lat: event.lngLat.lat });
                            setIsNewMarkerPopupOpen(true);

                            // openModal();
                        }}
                        onDrag={() => setIsNewMarkerPopupOpen(false)}
                   >
                    {isNewMarkerPopupOpen && 
                    <Popup 
                        offset={20}
                        latitude={newMarkerLocation.lat as number} 
                        longitude={newMarkerLocation.lng as number}
                        closeButton={false}
                        closeOnClick={false}
                        
                     >
                        <div id="">
                            <button id="popupSubmitButton" onClick={handlePopupSubmit}>Melden</button>
                        </div>
                        </Popup>}
                        
                   </Marker>)}

                    
            </Map>
        </div>
    );
};

export default BadspotsMap;
