import React, { useEffect, useState, useRef } from 'react';

import { getRecentTicketInspectorInfo } from '../../../functions/dbUtils';
import { OpacityMarker } from './Classes/OpacityMarker/OpacityMarker';

export interface MarkersProps {
  formSubmitted: boolean;
}

export type MarkerData = {
  timestamp: string;
  station: {
      id: string;
      name: string;
      coordinates: {
          latitude: number;
          longitude: number;
      };
  };
  direction: {
      id: string;
      name: string;
      coordinates: {
          latitude: number;
          longitude: number;
      };
  };
  line: string;
};

const MarkerContainer: React.FC<MarkersProps> = ({ formSubmitted }) => {
  const [ticketInspectorList, setTicketInspectorList] = useState<MarkerData[]>([]);
  const lastRecievedInspectorTimestamp = useRef<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        const newTicketInspectorList = await getRecentTicketInspectorInfo(lastRecievedInspectorTimestamp.current) || [];

        // Only reset the markers if we are getting new data
        if (Array.isArray(newTicketInspectorList) && newTicketInspectorList.length > 0) {
            setTicketInspectorList(newTicketInspectorList);

            // Update lastUpdateTime in local storage with the most recent timestamp
            lastRecievedInspectorTimestamp.current = newTicketInspectorList[0].timestamp;
        }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
}, [formSubmitted, ticketInspectorList]);

  return (
    <div>
      {ticketInspectorList.map((ticketInspector, index) => {
            return (
              <OpacityMarker markerData={ticketInspector} index={index} key={ticketInspector.station.id}/>
            );

        })}
    </div>
  );
};

export default MarkerContainer;
