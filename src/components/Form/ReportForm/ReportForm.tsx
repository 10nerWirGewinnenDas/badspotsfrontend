import React, { useEffect, useState } from 'react';
import { ActionMeta } from 'react-select/';

import AutocompleteInputForm, { selectOption } from '../AutocompleteInputForm/AutocompleteInputForm';

import { LinesList, StationList, StationProperty, getAllLinesList, getAllStationsList, reportInspector } from '../../../utils/dbUtils';
import { highlightElement, redefineDirectionOptions, redefineLineOptions, redefineStationOptions, createWarningSpan } from '../../../utils/uiUtils';
import { calculateDistance } from '../../../utils/mapUtils';
import './ReportForm.css';

interface ReportFormProps {
  closeModal: () => void;
  onFormSubmit: () => void;
  className?: string;
  userPosition?: {lat: number, lng: number} | null;
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

const redHighlight = (text: string) => {
	return <>{text}<span className='red-highlight'>*</span></>
}

const ReportForm: React.FC<ReportFormProps> = ({
	closeModal,
	onFormSubmit,
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

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const hasError = await validateReportForm();
		if (hasError) return; // Abort submission if there are validation errors

		const { lineInput, stationInput, directionInput } = reportFormState;
		await reportInspector(lineInput!, stationInput!, directionInput!);

		// Save the timestamp of the report to prevent spamming
		localStorage.setItem('lastReportTime', Date.now().toString());

		closeModal();
		onFormSubmit(); // Notify App component about the submission
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

	const refreshOptions = async (type: 'lines' | 'stations') => {
		try {
			setReportFormState(prevState => ({ ...prevState, [type === 'lines' ? 'isLoadingLines' : 'isLoadingStations']: true }));
			let list = (type === 'lines') ? {} as LinesList : {} as StationList;

			const storedList = JSON.parse(localStorage.getItem(`${type}List`) || 'null');

			if (storedList === null || (Date.now() - storedList.timestamp) > 24 * 60 * 60 * 1000) {
				const fetchedList = (type === 'lines') ? await getAllLinesList() : await getAllStationsList();
				if (JSON.stringify(storedList?.list) !== JSON.stringify(fetchedList)) {
					list = fetchedList;
					localStorage.setItem(`${type}List`, JSON.stringify({ list, timestamp: Date.now() }));
				} else {
					list = storedList.list;
				}
			} else {
				list = storedList.list;
			}

			const options = Object.keys(list).map(key => ({ value: key, label: type === 'lines' ? key : (list[key] as StationProperty).name }));

			setReportFormState(prevState => ({
				...prevState, [type === 'lines' ? 'linesList' : 'stationsList']: list,
				[type === 'lines' ? 'lineOptions' : 'stationOptions']: options
			}));

		} catch (error) {
			console.error(`Failed to fetch ${type}:`, error);
		} finally {
			setReportFormState(prevState => ({ ...prevState, [type === 'lines' ? 'isLoadingLines' : 'isLoadingStations']: false }));
		}
	};

	const handleOnLineChange = (option: selectOption, action: ActionMeta<unknown>) => {
		if (action.action === 'clear') {
			setReportFormState(prevState => ({ ...prevState, lineInput: emptyOption, directionInput: emptyOption, directionOptions: [] }));
			refreshOptions('stations');
			return;
		}

		setReportFormState(prevState =>
		({
			...prevState,
			lineInput: option,
			directionOptions: redefineDirectionOptions(option, reportFormState.linesList, reportFormState.stationsList),
			stationOptions: redefineStationOptions(option, reportFormState.linesList, reportFormState.stationsList)
		}));

	}

	const handleOnStationChange = (option: selectOption, action: ActionMeta<unknown>) => {
		if (action.action === 'clear') {
			setReportFormState(prevState => ({ ...prevState, stationInput: emptyOption, lineInput: emptyOption, directionInput: emptyOption }));
			refreshOptions('stations');
			refreshOptions('lines');
			return;
		}

		// Remove the warning span if a new station is selected
		const warningSpan = document.getElementById('warning-span');
		if (warningSpan) {
			warningSpan.remove(); // This will remove the warning span from the DOM
		}

		setReportFormState(prevState => ({ ...prevState, stationInput: option, lineOptions: redefineLineOptions(option, reportFormState.stationsList) }));
	};

	useEffect(() => {
		const fetchData = async () => {
			await refreshOptions('stations');
			await refreshOptions('lines');
		}

		fetchData();
	}, []);

	return (
		<div className={`report-form container ${className}`} id='report-form'>
			<h1>Neue Meldung</h1>
			<form onSubmit={handleSubmit}>

				<div id='station-select-div'>
					<AutocompleteInputForm
						className='station-select'
						classNamePrefix='station-select-component'
						options={reportFormState.stationOptions}
						placeholder={redHighlight('Station')}
						defaultInputValue={reportFormState.stationInput}
						onChange={(value, action) => handleOnStationChange(value as selectOption, action)}
						isDisabled={reportFormState.isLoadingStations}

					/>

				</div>
				<div className='line-direction-container'>
					<div className='line-select-container'>
						<AutocompleteInputForm
							className='line-select'
							options={reportFormState.lineOptions}
							defaultInputValue={reportFormState.lineInput}
							placeholder='Linie'
							onChange={(value, action) => handleOnLineChange(value as selectOption, action)}
							isDropdownIndicator={false}
							isIndicatorSeparator={false}
							isDisabled={reportFormState.isLoadingLines}
						/>
					</div>
					<div className='direction-select-container'>
						<AutocompleteInputForm
							className='direction-select'
							options={reportFormState.directionOptions}
							placeholder='Richtung'
							defaultInputValue={reportFormState.directionInput}
							onChange={(option) => setReportFormState(prevState => ({ ...prevState, directionInput: option as selectOption }))}
							isDropdownIndicator={false}
							isIndicatorSeparator={false}
							isDisabled={reportFormState.isLoadingStations}
						/>
					</div>
				</div>
				<div>
					<label htmlFor='privacy-checkbox' id='privacy-label'>
						<input
							type='checkbox'
							id='privacy-checkbox'
							name='privacy-checkbox'
						/>
						Ich stimme der{' '}
						<a href='/datenschutz'> Datenschutzerklärung </a> zu.{' '}
						{redHighlight('')}
					</label>
				</div>
				<div>
					<button type='submit'>Melden</button>
				</div>
			</form>
		</div>
	);
};

export default ReportForm;
