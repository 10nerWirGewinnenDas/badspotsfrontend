import React, { useEffect, useState } from 'react';

import Map from '../../components/Map/Map';
import ReportButton from '../../components/Buttons/ReportButton/ReportButton';
import ReportForm from '../../components/Form/ReportForm/ReportForm';
import UtilButton from '../../components/Buttons/UtilButton/UtilButton';
import UtilModal from '../../components/Modals/UtilModal/UtilModal';
import StatsPopUp from '../../components/Miscellaneous/StatsPopUp/StatsPopUp';
import { highlightElement } from '../../utils/uiUtils';

import Backdrop from '../../components/Miscellaneous/Backdrop/Backdrop';
import './App.css';

type AppUIState = {
	isReportFormOpen: boolean;
	formSubmitted: boolean;
	isUtilFormOpen: boolean;
	isFirstOpen: boolean;
	isStatsPopUpOpen: boolean;
	isSettingMarker: boolean;
};

const initialAppUIState: AppUIState = {
	isReportFormOpen: false,
	formSubmitted: false,
	isUtilFormOpen: false,
	isFirstOpen: false,
	isStatsPopUpOpen: false,
	isSettingMarker: false,
};

function App() {
	const [appUIState, setAppUIState] = useState<AppUIState>(initialAppUIState);
	const [newMarkerId, setNewMarkerId] = useState<{lng: number | null , lat: number | null;}>({lng: null, lat: null});
	const [isNewMarkerPopupOpen, setIsNewMarkerPopupOpen] = React.useState<boolean>(true);
	const [userPosition, setUserPosition] = useState<{
		lng: number;
		lat: number;
	} | null>(null);
	

	const handleFormSubmit = () => {
		setAppUIState((appUIState) => ({
			...appUIState,
			formSubmitted: !appUIState.formSubmitted,
		}));
	};

	
	function closeLegalDisclaimer() {
		setAppUIState({
			...appUIState,
			isFirstOpen: false,
			isStatsPopUpOpen: true,
		});
	}

	return (
		<div className="App">
			{appUIState.isUtilFormOpen && (
				<>
					<UtilModal className={'open'} />
					<Backdrop
						onClick={() =>
							setAppUIState({
								...appUIState,
								isUtilFormOpen: false,
							})
						}
					/>
				</>
			)}
			{appUIState.isReportFormOpen && (
				<>
					<ReportForm
						isNewMarkerPopupOpen={isNewMarkerPopupOpen}
						setIsNewMarkerPopupOpen={setIsNewMarkerPopupOpen}
						newMarkerLocation={newMarkerId}
						setNewMarkerLocation={setNewMarkerId}
						closeModal={() =>
							setAppUIState({
								...appUIState,
								isReportFormOpen: false,
							})
						}
						openModal={() =>
							setAppUIState({
								...appUIState,
								isReportFormOpen: true,
							})
						}
						onFormSubmit={handleFormSubmit}
						className={'open'}
						userPosition={userPosition}
					/>
					<Backdrop
						onClick={() =>
							{setAppUIState({
								...appUIState,
								isReportFormOpen: false,
							})
							setIsNewMarkerPopupOpen(true);
							}
						}
					/>
				</>
			)}

			<Map
				isNewMarkerPopupOpen={isNewMarkerPopupOpen}
				setIsNewMarkerPopupOpen={setIsNewMarkerPopupOpen}
				openModal={() =>
					setAppUIState({
						...appUIState,
						isReportFormOpen: true,
					})
				}
				newMarkerLocation={newMarkerId}
				setNewMarkerLocation={setNewMarkerId}
				isFirstOpen={appUIState.isFirstOpen}
				formSubmitted={appUIState.formSubmitted}
				userPosition={userPosition}
				setUserPosition={setUserPosition}
			/>

			{/* <UtilButton
				onClick={() =>
					setAppUIState({
						...appUIState,
						isUtilFormOpen: !appUIState.isUtilFormOpen,
					})
				}
			/> */}
			<ReportButton
				newMarkerLocation={newMarkerId}
				setNewMarkerLocation={setNewMarkerId}
				userPosition={userPosition}
				onClick={() =>
					setAppUIState({
						...appUIState,
						isReportFormOpen: !appUIState.isReportFormOpen,
					})
				}
			/>
			{appUIState.isStatsPopUpOpen && <StatsPopUp className={'open'} />}
		</div>
	);
}

export default App;
