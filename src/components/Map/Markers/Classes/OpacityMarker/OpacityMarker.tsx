import React, { useEffect, useState, useMemo } from 'react';

import './OpacityMarker.css';
import { MarkerData } from '../../MarkerContainer';
import { Marker } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';

interface OpacityMarkerProps {
    markerData: MarkerData;
    index: number;
    isFirstOpen: boolean;
}

export const OpacityMarker: React.FC<OpacityMarkerProps> = ({ markerData, index, isFirstOpen }) => {

    const [ opacity, setOpacity ] = useState(0);
    const { timestamp, station, line, direction, isHistoric } = markerData;

    // By using useMemo, we can avoid recalculating the timestamp on every render
    const Timestamp = useMemo(() => {
        const tempTimestamp = new Date(timestamp);
        tempTimestamp.setHours(tempTimestamp.getHours() - 1); // Adjust for UTC to local
        return tempTimestamp;
    }, [timestamp]);

    useEffect(() => {
        let intervalId : NodeJS.Timeout;
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

                intervalId = setInterval(calculateOpacity,  1 * 1000); // every 5 seconds to avoid excessive rerenders
                } else {
                setOpacity(1);
                }
                return () => clearInterval(intervalId);
        }
    }, [Timestamp, isHistoric, isFirstOpen]);

    const elapsedTimeMessage = (elapsedTime:number, isHistoric:boolean): string => {
        if (elapsedTime > 10 * 60 * 1000 || isHistoric) {
            return 'Vor mehr als <strong>10 Minuten</strong> gemeldet. (Historisch)';
        }
        else {
            const minutes = Math.max(1, Math.floor(elapsedTime / (60 * 1000)));
            return `Vor <strong>${minutes === 1 ? 'einer' : minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}</strong> gemeldet.`;
        }
    };

    const MarkerPopup = useMemo(() => new maplibregl.Popup()
        .setHTML(`
            ${line} ${direction.name ? direction.name + ' - ' : ''} <strong>${station.name}</strong>
            <div>${elapsedTimeMessage(new Date().getTime() - Timestamp.getTime(), isHistoric)}</div>
                `),
        [line, direction.name, station.name, Timestamp, isHistoric]);

    if (opacity <= 0) {
        return null;
    }

    return (
        <div>
            <Marker
                key={`${line}-${index}`}
                className='inspector-marker'
                latitude={station.coordinates.latitude}
                longitude={station.coordinates.longitude}
                popup={MarkerPopup}
                style={{ opacity: opacity }}
            >
                <span></span>
            </Marker>
        </div>
    );
};
