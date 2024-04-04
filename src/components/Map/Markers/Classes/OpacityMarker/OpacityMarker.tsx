import React, { useEffect, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import { Marker } from 'react-map-gl/maplibre';

import { MarkerData } from '../../MarkerContainer';
import { elapsedTimeMessage } from '../../../../../utils/mapUtils';

import './OpacityMarker.css';

interface OpacityMarkerProps {
    markerData: MarkerData;
    index: number;
    isFirstOpen: boolean;
}

export const OpacityMarker: React.FC<OpacityMarkerProps> = ({ markerData, index, isFirstOpen }) => {
    const [opacity, setOpacity] = useState(0);
    const { timestamp, station, line, direction, isHistoric } = markerData;
    const [now, setNow] = useState(new Date().getTime());

    // By using useMemo, we can avoid recalculating the timestamp on every render
    const Timestamp = useMemo(() => {
        const tempTimestamp = new Date(timestamp);
        tempTimestamp.setHours(tempTimestamp.getHours() - 2); // Adjust for UTC to local

        return tempTimestamp;
    }, [timestamp]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (!isFirstOpen) {
            if (!isHistoric) {
                const calculateOpacity = () => {
                    const currentTime = new Date().getTime();
                    const elapsedTime = currentTime - Timestamp.getTime();
                    const newOpacity = Math.max(0, 1 - (elapsedTime / (15 * 60 * 1000)));
                    setOpacity(newOpacity);
                    if (newOpacity === 0) {
                        clearInterval(intervalId);
                    }
                };
                calculateOpacity(); // Initial calculation

                intervalId = setInterval(calculateOpacity, 5 * 1000); // every 5 seconds to avoid excessive rerenders
            } else {
                setOpacity(1);
            }
            return () => clearInterval(intervalId);
        }
    }, [Timestamp, isHistoric, isFirstOpen, opacity, station.name]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(new Date().getTime());
        }, 60 * 1000); // Update every minute

        return () => clearInterval(intervalId); // Clean up on unmount
    }, []);

    const MarkerPopup = useMemo(() => new maplibregl.Popup().setHTML(`
        ${line} ${direction.name ? direction.name + ' - ' : ''} <strong>${station.name}</strong>
        <div>${elapsedTimeMessage(now - Timestamp.getTime(), isHistoric)}</div>
      `), [line, direction.name, station.name, Timestamp, isHistoric, now]);

    if (opacity <= 0) {
        return null;
    }

    return (

        <Marker
            key={`${line}-${index}`}
            className='inspector-marker'
            latitude={station.coordinates.latitude}
            longitude={station.coordinates.longitude}
            popup={MarkerPopup}
            opacity={opacity.toString()}
        >
            <span className='live' />
        </Marker>

    );
};
