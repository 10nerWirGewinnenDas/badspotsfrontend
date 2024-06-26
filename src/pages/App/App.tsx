import React, { useEffect, useState } from 'react';

import Map from '../../components/Map/Map';
import ReportButton from '../../components/Buttons/ReportButton/ReportButton';
import ReportForm from '../../components/Form/ReportForm/ReportForm';
import UtilModal from '../../components/Modals/UtilModal/UtilModal';
import StatsPopUp from '../../components/Miscellaneous/StatsPopUp/StatsPopUp';
import LeaderBoard from 'src/components/LeaderBoard';

import Backdrop from '../../components/Miscellaneous/Backdrop/Backdrop';
import './App.css';
import {GetBlackSpotDto} from "../../api/api";
import BlackSpotDetail from "../../components/Form/BlackSpotDetail/BlackSpotDetail";
import ApiService from "../../api/api.service";

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
	const [isNewMarkerPopupOpen, setIsNewMarkerPopupOpen] = React.useState<boolean>(false);
	const [userPosition, setUserPosition] = useState<{
		lng: number;
		lat: number;
	} | null>(null);
	const [currentDetailSpot, setCurrentDetailSpot] = useState<GetBlackSpotDto>()
	const [leaderboard, setLeaderboard] = useState<GetBlackSpotDto[]>();
	

	const handleFormSubmit = () => {
		setAppUIState((appUIState) => ({
			...appUIState,
			formSubmitted: !appUIState.formSubmitted,
		}));
	};

	

	return (
		<div className="App">
			{leaderboard && <LeaderBoard isNewMarkerPopupOpen={isNewMarkerPopupOpen	} leaderboard={leaderboard} />}
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

			{currentDetailSpot && (
				<>
					<BlackSpotDetail
						
					    setCurrentDetailSpot={setCurrentDetailSpot}
						onFormSubmit={handleFormSubmit}
						closeModal={() => {
							setCurrentDetailSpot(undefined);
						}}
						className={'open'}
						spot={currentDetailSpot}
					/>
					<Backdrop
						onClick={() =>
						{setCurrentDetailSpot(undefined)}
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
				setUserPosition={(pos) => {
					try {					
						setUserPosition(pos);
						ApiService.api.blackSpotStatsControllerIn10Km({longitude: pos!.lng, latitude: pos!.lat})
						.then(r => setLeaderboard(r.data))
					} catch (error) {
						console.error('Error getting locations:', error);
					}
				}}
				openDetailModal={(spot) => {
					setCurrentDetailSpot(spot)
				}}
			/>

			<ReportButton
				isNewMarkerPopupOpen={isNewMarkerPopupOpen}
				setIsNewMarkerPopupOpen={setIsNewMarkerPopupOpen}
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
