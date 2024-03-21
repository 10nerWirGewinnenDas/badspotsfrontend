import React, { useEffect, useState } from 'react';

import './ReportForm.css';
import {

	LinesList,
	StationList,
	getAllLinesList,
	getAllStationsList,
	reportInspector,
} from '../../functions/dbUtils';
import AutocompleteInputForm, {
	Option,
} from '../AutocompleteInputForm/AutocompleteInputForm';
import { highlightElement, redefineDirectionOptions, redefineLineOptions, redefineStationOptions } from '../../functions/uiUtils';
import { ActionMeta } from 'react-select/';

interface ReportFormProps {
  closeModal: () => void;
  onFormSubmit: () => void;
  className?: string;
}

type reportFormState = {
	hasNoStationInput: boolean;
	lineInput: Option | undefined;
	stationInput: Option | undefined;
	directionInput: Option | undefined;
	lineOptions: Option[];
	stationOptions: Option[];
	directionOptions: Option[];
	stationsList: StationList;
	linesList: LinesList;
	isLoadingLines: boolean;
	isLoadingStations: boolean;
};

const initialState: reportFormState = {
	hasNoStationInput: false,
	lineInput: undefined,
	stationInput: undefined,
	directionInput: undefined,
	lineOptions: [],
	stationOptions: [],
	directionOptions: [],
	stationsList: {},
	linesList: {},
	isLoadingLines: true,
	isLoadingStations: true,
};

const ReportForm: React.FC<ReportFormProps> = ({
	closeModal,
	onFormSubmit,
	className,
}) => {

	const [reportFormState, setReportFormState] = useState<reportFormState>(initialState);

	const emptyOption = '' as unknown as Option;

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		let hasError = false;

		if (reportFormState.stationInput === undefined || reportFormState.stationInput === emptyOption) {
			setReportFormState(prevState => ({ ...prevState, hasNoStationInput: true }));
			hasError = true;
		} else {
			setReportFormState(prevState => ({ ...prevState, hasNoStationInput: false }));
			hasError = false;
		}

		if (
			!(document.getElementById('privacy-checkbox') as HTMLInputElement)
				.checked
		) {
			highlightElement('privacy-label'); // Highlight the 'privacy-checkbox' input field
			hasError = true;
		}

		if (hasError) return; // If there is an error, do not proceed with the submission

		const { lineInput, stationInput, directionInput } = reportFormState;

		console.log('direction', directionInput)
		await reportInspector(lineInput!, stationInput!, directionInput!);

		closeModal();
		onFormSubmit(); // Notify App component about the submission
	};

	const refreshLineOptions = async () => {
		try {
			setReportFormState(prevState => ({ ...prevState, isLoadingLines: true }));

			const LinesList: LinesList = await getAllLinesList();
			const LineOptions = Object.keys(LinesList).map(line => ({ value: line, label: line }));

			setReportFormState(prevState => ({ ...prevState, linesList: LinesList, lineOptions: LineOptions }));

			return LinesList
		} catch (error) {
			console.error('Failed to fetch lines:', error);
		} finally {
			setReportFormState(prevState => ({ ...prevState, isLoadingLines: false }));

		}
	}

	const refreshStationOptions = async () => {
		try {
			setReportFormState(prevState => ({ ...prevState, isLoadingStations: true }));

			const StationsList: StationList = await getAllStationsList();
			const StationOptions = Object.keys(StationsList).map(station => ({ value: station, label: StationsList[station].name }));

			setReportFormState(prevState => ({ ...prevState, stationsList: StationsList, stationOptions: StationOptions }));

		} catch (error) {
			console.error('Failed to fetch stations and lines:', error);
		} finally {
			setReportFormState(prevState => ({ ...prevState, isLoadingStations: false }));
		}
	};

	const handleOnLineChange = (option: Option, action: ActionMeta<unknown>) => {
		if (action.action === 'clear') {
			setReportFormState(prevState => ({ ...prevState, lineInput: emptyOption, directionInput: emptyOption, directionOptions: [] }));
			refreshStationOptions();
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

	const handleOnStationChange = (option: Option, action: ActionMeta<unknown>) => {
		if (action.action === 'clear') {
			setReportFormState(prevState => ({ ...prevState, stationInput: emptyOption, lineInput: emptyOption, directionInput: emptyOption }));
			refreshLineOptions();
			refreshStationOptions();

			return;
		}

		setReportFormState(prevState => ({ ...prevState, stationInput: option, lineOptions: redefineLineOptions(option, reportFormState.stationsList) }));
	}

	useEffect(() => {
		const fetchData = async () => {
			await refreshStationOptions();
			await refreshLineOptions();
		};

		fetchData();
	}, []);

	return (
		<div className={`report-form container ${className}`}>
			<h1>Neue Meldung</h1>
			<form onSubmit={handleSubmit}>

				<div>
					<AutocompleteInputForm
						className='station-select'
						options={reportFormState.stationOptions}
						placeholder='Station'
						defaultInputValue={reportFormState.stationInput}
						hasNoStationInput={reportFormState.hasNoStationInput}
						onChange={(value, action) => handleOnStationChange(value as Option, action)}
						isLoading={reportFormState.isLoadingStations}
						isDisabled={reportFormState.isLoadingStations}
					/>

				</div>
				<div className='report-form-container'>
					<div className='line-select-container'>
						<AutocompleteInputForm
							className='line-select'
							options={reportFormState.lineOptions}
							defaultInputValue={reportFormState.lineInput}
							placeholder='Linie'
							onChange={(value, action) => handleOnLineChange(value as Option, action)}
							isDropdownIndicator={false}
							isIndicatorSeparator={false}
							isLoading={reportFormState.isLoadingLines}
							isDisabled={reportFormState.isLoadingLines}
						/>
					</div>
					<div className='direction-select-container'>
						<AutocompleteInputForm
							className='direction-select'
							options={reportFormState.directionOptions}
							placeholder='Richtung'
							defaultInputValue={reportFormState.directionInput}
							onChange={(option) => setReportFormState(prevState => ({ ...prevState, directionInput: option as Option }))}
							isDropdownIndicator={false}
							isIndicatorSeparator={false}
							isLoading={reportFormState.isLoadingStations}
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
						<span className='red-highlight'>*</span>
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
