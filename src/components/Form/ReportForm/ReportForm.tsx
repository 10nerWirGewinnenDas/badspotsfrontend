import React, { useState } from 'react';
import { ActionMeta } from 'react-select/';

import { LinesList, StationList, StationProperty, getAllLinesList, getAllStationsList, reportInspector } from '../../../utils/dbUtils';
import { highlightElement, redefineDirectionOptions, redefineLineOptions, redefineStationOptions, createWarningSpan } from '../../../utils/uiUtils';
import { calculateDistance } from '../../../utils/mapUtils';
import './ReportForm.css';
import Select from 'react-select'

interface ReportFormProps {
  closeModal: () => void;
  openModal: () => void;
  onFormSubmit: () => void;
  newMarkerLocation: { lng: number | null, lat: number | null };
  setNewMarkerLocation: (position: { lng: number | null, lat: number | null }) => void;
  className?: string;
  userPosition?: {lat: number, lng: number} | null;
}

export interface selectOption {
	value: string ;
	label: string ;
  }

type reportFormState = {
	lineInput: selectOption | undefined;
	stationInput: selectOption | undefined;
	directionInput: selectOption | undefined;
	lineOptions: selectOption[];
	stationOptions: selectOption[];
	directionOptions: selectOption[];
	stationsList: StationList;
	linesList: LinesList;
	isLoadingLines: boolean;
	isLoadingStations: boolean;
};

const initialState: reportFormState = {
	lineInput: undefined,
	stationInput: undefined,
	directionInput: undefined,
	lineOptions: [],
	stationOptions: [],
	directionOptions: [],
	stationsList: localStorage.getItem('stationsList') ? JSON.parse(localStorage.getItem('stationsList')!) : {} as StationList,
	linesList: localStorage.getItem('linesList') ? JSON.parse(localStorage.getItem('linesList')!) : {} as LinesList,
	isLoadingLines: true,
	isLoadingStations: true,
};

const categoryOptions = [
	{ value: 'category1', label: 'category1' },
	{ value: 'category2', label: 'category2' },
	{ value: 'category3', label: 'category3' },
	{ value: 'category4', label: 'category4' },
	{ value: 'category5', label: 'category5' },
];

const redHighlight = (text: string) => {
	return <>{text}<span className='red-highlight'>*</span></>
}

const ReportForm: React.FC<ReportFormProps> = ({
	closeModal,
	openModal,
	onFormSubmit,
	newMarkerLocation,
	setNewMarkerLocation,
	className,
	userPosition
}) => {

	const [reportFormState, setReportFormState] = useState<reportFormState>(initialState);

	
	const emptyOption = '' as unknown as selectOption;

	const validateReportForm = async () => {
		let hasError = false;

		// Check for last report time to prevent spamming
		const lastReportTime = localStorage.getItem('lastReportTime');

		if (lastReportTime && Date.now() - parseInt(lastReportTime) < 15 * 60 * 1000) {

			highlightElement('report-form');
			createWarningSpan('station-select-div', 'Du kannst nur alle 15 Minuten eine Meldung abgeben!');
			hasError = true;
		}

		if (reportFormState.stationInput === undefined || reportFormState.stationInput === emptyOption) {

			highlightElement('station-select-component__control');
			hasError = true;
		}

		if (!(document.getElementById('privacy-checkbox') as HTMLInputElement).checked) {
			highlightElement('privacy-label');
			hasError = true;
		}

		const locationError = await verifyUserLocation(reportFormState.stationInput, reportFormState.stationsList);
		if (locationError) {
			hasError = true;
		}

		return hasError; // Return true if there's an error, false otherwise
	};

	const handleSubmit = () => {
		// event.preventDefault();

		// const hasError = await validateReportForm();
		// if (hasError) return; // Abort submission if there are validation errors

		// const { lineInput, stationInput, directionInput } = reportFormState;
		// await reportInspector(lineInput!, stationInput!, directionInput!);

		// // Save the timestamp of the report to prevent spamming
		// localStorage.setItem('lastReportTime', Date.now().toString());

		// closeModal();
		// onFormSubmit(); // Notify App component about the submission

	};

	async function verifyUserLocation(
		stationInput: selectOption | undefined,
		stationsList: StationList
	): Promise<boolean> {
		if (!stationInput) return false;

		const station = stationsList[stationInput.value];
		if (!station) return false;

		const distance = userPosition ? calculateDistance(userPosition.lat, userPosition.lng, station.coordinates.latitude, station.coordinates.longitude): 0;

		// Checks if the user is more than 1 km away from the station
		if (distance > 1) {
			highlightElement('report-form');
			createWarningSpan('station-select-div', 'Du bist zu weit von der Station entfernt. Bitte wähle die richtige Station!');
			return true; // Indicates an error
		}

		return false;
	}

	const setNewMarker = () => {
		if (!userPosition) return 0;
		const newMarkerLocation = { lng: userPosition!.lng, lat: userPosition!.lat };
		setNewMarkerLocation(newMarkerLocation);
		closeModal();
		return 1;
	}
	
	const resetNewMarker = () => {
		setNewMarkerLocation({ lng: null, lat: null });
	}

	const [markerNote, setMarkerNote] = useState(''); // State variable for the marker note

	const handleNoteChange = (event: any) => {
	  setMarkerNote(event.target.value); // Update the note whenever the user types into the field
	};

	return (
		<div className={`report-form container ${className}`} id='report-form'>
			<h1>Neue Meldung</h1>
			<form onSubmit={handleSubmit}>

				<div id='setNewMarkerButton'>
					<button disabled={
						!userPosition
					}
					 onClick={(event) =>
					{
						event.preventDefault();
						setNewMarker();
					}}>{(newMarkerLocation.lat && newMarkerLocation.lng) ? 'Spot neusetzen 🔎' : 'Spot setzen  🔎' }</button>

				</div>
				<div>
      				<textarea id="markerNote" placeholder='Beschreibung' value={markerNote} onChange={handleNoteChange} />
				</div>

				<Select options=
					{categoryOptions}
					placeholder='Kategorie'
				></Select>
				<div id="submitOrCleanButtons-container">
				   	<button id="cleanButton"onClick={() => resetNewMarker()}>❌</button>
					<button id="submitButton" type='submit'>✅</button>
				</div>
			</form>
		</div>
	);
};

export default ReportForm;
