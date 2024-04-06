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

    const maxBounds: LngLatBoundsLike = [SouthWestBounds, NorthEastBounds];

    const map = useRef<MapRef>(null);

    // [height, width]
    const [markerSizes, setMarkerSizes] = useState<[number, number][]>([]);

    useEffect(() => {
        const fetchSpots = async () => {
          try {
            const spots = (await ApiService.api.blackSpotsControllerFindAll({
              voterId: window.localStorage.getItem('voterId') ?? undefined
            })).data;
            setBlackSpots(spots)
                            // map over blackspots ordered by vote counts

            setMarkerSizes(spots.map(bs => {
                 // first element (highest vote count) is 100% of the max width
                    // last element (lowest vote count) is 10% of the max width
                    // size of medium is relation of 41px height, 27px width
                    // max element has 150% of medium size, minimum is 50% of medium

              const percentage = (bs._count.votes / spots[0]._count.votes) * 100;
              const mediumSize = 27;
              const mediumHeight = 41;
              const mediumPercentage = (mediumSize / mediumHeight) * 100;
              const width = (percentage / 100) * mediumSize;
              const height = (percentage / 100) * mediumHeight;
              return [height, width];
            }))
          } catch (e) {
            console.error(e)
          }
        };
      
        fetchSpots(); // Fetch spots immediately when the component mounts
      
        const intervalId = setInterval(fetchSpots, 5000); // Fetch spots every 5 seconds
      
        return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
      }, [formSubmitted]);


    /*
    useMemo(() => {
        if (userPosition) {
            map.current?.flyTo({
                center: [userPosition.lng, userPosition.lat],
                zoom: 12,
            });
        }
    }, [userPosition])
     */

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
                    longitude: userPosition?.lng ?? berlinViewPosition.lng,
                    latitude:  userPosition?.lat ?? berlinViewPosition.lat,
                    zoom: 15,
                }}
                maxZoom={19}
                minZoom={12}

                maxBounds={maxBounds}

                mapStyle={`https://api.jawg.io/styles/jawg-streets.json?access-token=${process.env.REACT_APP_JAWG_ACCESS_TOKEN}`}
            >
                    {!isFirstOpen && <LocationMarker userPosition={userPosition} setUserPosition={setUserPosition} />}
                {blackSpots?.map((value, index) => (
                  <Marker className={"blackspot " + (value.finished ? 'green-marker' : 'black-marker')} style={{height: markerSizes[index][0], width: markerSizes[index][1]}} longitude={value.longitude} latitude={value.latitude} key={value.id} onClick={() => openDetailModal(value)}/>
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
                    <h1>Please move your marker</h1>
                    <div id="buttons-container">
                        <span><button id="popupExitButton" onClick={handlePopupExit}>Cancel</button></span>
                        <span><button id="popupSubmitButton" onClick={handlePopupSubmit}>Done</button></span>
                    </div>
                    </div>

                    </>)}
            </Map>
        </div>
    );
};

export default BadspotsMap;
