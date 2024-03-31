export function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
		Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) *
		Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c; // Distance in km
	return distance;
}

function deg2rad(deg: number) {
	return deg * (Math.PI / 180);
}

// this streams the position of the user, meaning we have to split getPosition and watchPosition
export const watchPosition = async (
	onPositionChanged: (position: { lng: number; lat: number } | null) => void
): Promise<() => void> => {
	const watchId = navigator.geolocation.watchPosition(
		(position) => {
			onPositionChanged({
				lng: position.coords.longitude,
				lat: position.coords.latitude,
			});
		},
		() => {
			onPositionChanged(null); // Handle the case where getting position fails
		}
	);
	return () => navigator.geolocation.clearWatch(watchId);
};

export const getStationDistanceMessage = (stationDistance: number | null) => {
	if (!stationDistance) return '';
	return `<div>${
		stationDistance > 1
			? `<strong>${stationDistance} Stationen`
			: '<strong>eine Station'
	}</strong> von dir entfernt</div>`;
};

export const elapsedTimeMessage = (
	elapsedTime: number,
	isHistoric: boolean
): string => {
	if (elapsedTime > 10 * 60 * 1000 || isHistoric) {
		return 'Vor mehr als <strong>10 Minuten</strong> gemeldet.';
	} else {
		const minutes = Math.max(1, Math.floor(elapsedTime / (60 * 1000)));
		return formatElapsedTime(minutes);
	}
};

const formatElapsedTime = (minutes: number) => {
	const minuteWord = minutes === 1 ? 'Minute' : 'Minuten';
	const minuteCount = minutes === 1 ? 'einer' : minutes;
	return `Vor <strong>${minuteCount} ${minuteWord}</strong> gemeldet.`;
};
