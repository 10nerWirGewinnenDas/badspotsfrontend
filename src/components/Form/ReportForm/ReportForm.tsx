import React, { useEffect, useRef, useState } from 'react';

import ApiService from 'src/api/api.service';
import { LinesList, StationList } from '../../../utils/dbUtils';
import { highlightElement, createWarningSpan } from '../../../utils/uiUtils';
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
	userPosition?: { lat: number, lng: number } | null;
}

export interface selectOption {
	value: string;
	label: string;
}

type reportFormState = {
	categorySelectedOption: selectOption;
	categoryOptions: selectOption[];
};

const initialState: reportFormState = {

	categorySelectedOption: '' as unknown as selectOption,
	categoryOptions: [],
};

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

	const [markerNote, setMarkerNote] = useState(''); // State variable for the marker note

	const [reportFormState, setReportFormState] = useState<reportFormState>(initialState);
	const [image, setImage] = useState<string | ArrayBuffer | null>(null);

	const [title, setTitle] = useState('');
	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onloadend = () => {
			setImage((reader.result));
		};

		if (file) {
			reader.readAsDataURL(file);
		} else {
			setImage(null);
		}
	};

	const emptyOption = '' as unknown as selectOption;

	// const validateReportForm = async () => {
	// 	let hasError = false;

	// 	// Check for last report time to prevent spamming
	// 	const lastReportTime = localStorage.getItem('lastReportTime');

	// 	if (lastReportTime && Date.now() - parseInt(lastReportTime) < 15 * 60 * 1000) {

	// 		highlightElement('report-form');
	// 		createWarningSpan('station-select-div', 'Du kannst nur alle 15 Minuten eine Meldung abgeben!');
	// 		hasError = true;
	// 	}

	// 	if (reportFormState.stationInput === undefined || reportFormState.stationInput === emptyOption) {

	// 		highlightElement('station-select-component__control');
	// 		hasError = true;
	// 	}

	// 	if (!(document.getElementById('privacy-checkbox') as HTMLInputElement).checked) {
	// 		highlightElement('privacy-label');
	// 		hasError = true;
	// 	}

	// 	const locationError = await verifyUserLocation(reportFormState.stationInput, reportFormState.stationsList);
	// 	if (locationError) {
	// 		hasError = true;
	// 	}

	// 	return hasError; // Return true if there's an error, false otherwise
	// };

	const handleSubmit = () => {

		if (newMarkerLocation.lat && newMarkerLocation.lng) {
			ApiService.api.blackSpotsControllerCreate({
				description: markerNote,
				latitude: newMarkerLocation.lat,
				longitude: newMarkerLocation.lng,
				categoryId: reportFormState.categorySelectedOption.value,
				name: '',
				archived: false
			}).then(() => {
				onFormSubmit();
			});
		}


	};

	useEffect(() => {
		ApiService.api.categoriesControllerFindAll().then((response) => {
			const categories = response.data.map((category: any) => {
				return { value: category.id, label: category.name };
			});
			setReportFormState({ ...reportFormState, categoryOptions: categories });
		});

	}, []);
	// async function verifyUserLocation(
	// 	stationInput: selectOption | undefined,
	// 	stationsList: StationList
	// ): Promise<boolean> {
	// 	if (!stationInput) return false;

	// 	const station = stationsList[stationInput.value];
	// 	if (!station) return false;

	// 	const distance = userPosition ? calculateDistance(userPosition.lat, userPosition.lng, station.coordinates.latitude, station.coordinates.longitude) : 0;

	// 	// Checks if the user is more than 1 km away from the station
	// 	if (distance > 1) {
	// 		highlightElement('report-form');
	// 		createWarningSpan('station-select-div', 'Du bist zu weit von der Station entfernt. Bitte wähle die richtige Station!');
	// 		return true; // Indicates an error
	// 	}

	// 	return false;
	// }


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


	const handleNoteChange = (event: any) => {
		setMarkerNote(event.target.value); // Update the note whenever the user types into the field
	};


	const fileInput = useRef(null);

	const handleButtonClick = () => {
		// trigger the file input click event
		(fileInput as any).current.click();
	};

	const handleTitleChange = (event: any) => {
		setTitle(event.target.value);
	}


	return (
		<div className={`report-form container ${className}`} id='report-form'>
			<form onSubmit={(event) => {
				event.preventDefault();
				handleSubmit();
			}}>

				<input
					type="file"
					name="image"
					ref={fileInput}
					style={{ display: 'none' }} // hide the default file input
					onChange={handleFileChange}
				/>

					<div>
					<textarea maxLength={31} id="markerTitle" placeholder='Titel' value={title} onChange={(e) =>  handleTitleChange(e)} />
				</div>

				<button
					type="button"
					onClick={handleButtonClick}
					style={{
						backgroundImage: `url(${image})`,
						backgroundSize: 'cover',
						width: '100%',
						height: '20rem',
					}}
				>
					<p>{image ? ' ' : '📷'}</p>
				</button>

				<div id='setNewMarkerButton'>
					<button disabled={
						!userPosition
					}
						onClick={(event) => {
							event.preventDefault();
							setNewMarker();
						}}>{(newMarkerLocation.lat && newMarkerLocation.lng) ? 'Spot neusetzen 🔎' : 'Spot setzen  🔎'}</button>

				</div>
				<div>
					<textarea id="markerNote" placeholder='Beschreibung' value={markerNote} onChange={handleNoteChange} />
				</div>

				<Select options=
					{reportFormState.categoryOptions}
					placeholder='Kategorie'
					value={reportFormState.categorySelectedOption}
					onChange={(selectedOption) => setReportFormState({ ...reportFormState, categorySelectedOption: { label: selectedOption?.label as unknown as string, value: selectedOption?.value as unknown as string } })}
				></Select>



				<div id="submitOrCleanButtons-container">
					<button id="submitButton" type='submit'>Meldung abgeben</button>
				</div>
			</form>
		</div>
	);
};

export default ReportForm;
