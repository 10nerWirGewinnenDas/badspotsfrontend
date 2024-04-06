import React, {lazy, useEffect, useMemo, useRef, useState} from 'react';
import {
    LngLatBoundsLike,
    LngLatLike,
    MapRef,
    Marker,
} from 'react-map-gl/maplibre';

import LocationMarker from './Markers/Classes/LocationMarker/LocationMarker';

import './Map.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import {GetBlackSpotDto} from "../../api/api";
import ApiService from "../../api/api.service";
import { Style } from 'maplibre-gl';

const Map = lazy(() => import('react-map-gl/maplibre'));

interface MapsProps {
    openModal: () => void;
    formSubmitted: boolean;
    userPosition: { lng: number, lat: number } | null | null;
    setUserPosition: (position: { lng: number, lat: number } | null) => void;
    isFirstOpen: boolean;
    newMarkerLocation: { lng: number | null, lat: number | null };
    setNewMarkerLocation: (position: { lng: number | null, lat: number | null }) => void;
    isNewMarkerPopupOpen: boolean;
    setIsNewMarkerPopupOpen: (isOpen: boolean) => void;
    openDetailModal: (spot: GetBlackSpotDto) => void;
}

export const berlinViewPosition: { lng: number, lat: number } = {lng: 13.124869779929298, lat: 52.39252123352503}

const BadspotsMap: React.FC<MapsProps> = ({
    openModal,
    formSubmitted,
    userPosition,
    setUserPosition,
    isFirstOpen,
    newMarkerLocation,
    setNewMarkerLocation,
    isNewMarkerPopupOpen,
    setIsNewMarkerPopupOpen,
  openDetailModal
}) => {

    const SouthWestBounds: LngLatLike = { lng: 12.8364646484805, lat: 52.23115511676795 }
    const NorthEastBounds: LngLatLike = { lng: 13.88044556529124, lat: 52.77063424239867 }
    const [blackSpots, setBlackSpots] = useState<GetBlackSpotDto[]>();
    const [isDragging, setIsDragging] = useState(false);

    const onMapViewportChanged = (ev: any) => {
       
    }

    const maxBounds: LngLatBoundsLike = [SouthWestBounds, NorthEastBounds];

    const map = useRef<MapRef>(null);

    useEffect(() => {
        try {
            (async () => {
                setBlackSpots((await ApiService.api.blackSpotsControllerFindAll({
                    voterId: window.localStorage.getItem('voterId') ?? undefined
                })).data)
            })()
        }catch (e) {
            console.error(e)
        }
    }, [formSubmitted])

    useMemo(() => {
        if (userPosition) {
            map.current?.flyTo({
                center: [userPosition.lng, userPosition.lat],
                zoom: 12,
            });
        }
    }, [userPosition])

    const handlePopupSubmit = () => {
        openModal();
        setIsNewMarkerPopupOpen(false);
    }

    function handlePopupExit() {
        setNewMarkerLocation({ lng: null, lat: null });
        setIsNewMarkerPopupOpen(false);
    }

    useEffect(() => {
        if (newMarkerLocation.lat != null && newMarkerLocation.lng != null) {
          setIsDragging(true);
        }
      }, [newMarkerLocation]);

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
                minZoom={12}
                onZoomEnd={onMapViewportChanged}
                onDragEnd={onMapViewportChanged}

                maxBounds={maxBounds}

                mapStyle={`https://api.jawg.io/styles/jawg-streets.json?access-token=${process.env.REACT_APP_JAWG_ACCESS_TOKEN}`}
            >
                    {!isFirstOpen && <LocationMarker userPosition={userPosition} setUserPosition={setUserPosition} />}
                {blackSpots?.map((value, index) => (
                  <Marker longitude={value.longitude} latitude={value.latitude} key={value.id} onClick={() => openDetailModal(value)}/>
                ))}

                {(newMarkerLocation.lat != null && newMarkerLocation.lng != null) &&
                   (<>
                    <Marker
                        latitude={newMarkerLocation.lat as number}
                        longitude={newMarkerLocation.lng as number}
                        draggable={true}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={(event) => {
                            setIsDragging(false);
                            setNewMarkerLocation({ lng: event.lngLat.lng, lat: event.lngLat.lat });
                        }}
                        style={{ filter: isDragging ? 'hue-rotate(360deg) brightness(100%)' : undefined }}
                        
                        >
                    </Marker>

                   <div className={isNewMarkerPopupOpen ? 'popupSubmitForm container open' : ''}>
                    <h1>Spot Standort melden?</h1>
                    <div id="buttons-container">
                        <span><button id="popupExitButton" onClick={handlePopupExit}>Nein</button></span>
                        <span><button id="popupSubmitButton" onClick={handlePopupSubmit}>Ja</button></span>
                    </div>
                    </div>

                    </>)}
            </Map>
        </div>
    );
};

export default BadspotsMap;
