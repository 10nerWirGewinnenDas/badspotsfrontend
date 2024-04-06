import React, { useEffect, useRef, useState } from 'react';

import ApiService from 'src/api/api.service';
import './BlackSpotDetail.css';
import {GetBlackSpotDto} from "../../../api/api";

interface ReportFormProps {
	closeModal: () => void;
	className?: string;
	spot?: GetBlackSpotDto;
	onFormSubmit: () => void;
}


type BlackSpotDetailState = {
	blackSpotDetail: GetBlackSpotDto | undefined;
};

const initialState: BlackSpotDetailState = {
	blackSpotDetail: undefined
};

const BlackSpotDetail: React.FC<ReportFormProps> = ({
	closeModal,
	className,
	spot,
	onFormSubmit
}) => {
	const [imageUrl, setImageUrl] = useState<string>();
	const [comments, setComments] = useState()

	const loadSpot = async () => {
		try {
			const imageRes = await ApiService.api.blackSpotsControllerGetImage(spot!.id, {
			  format: 'blob'
			});
		  
			setImageUrl(URL.createObjectURL(imageRes.data));
		  } catch (error) {
			console.error('Error getting image:', error);
		  }
		
	}

	const handleUpvote = async () => {
		console.log(spot!.id)
		try {
			await ApiService.api.blackSpotsControllerVote(spot!.id, {
				type: 'UP',
				blackSpotId: ''
			},)
			loadSpot()
		} catch (error) {
			console.error('Error upvoting:', error);
		}
	}

	useEffect(() => {
		
		loadSpot()

		// DO NOT CHANGE DEPENDECNCYS!!!
	}, [])

	return (
		<div className={`blackSpotDescription container ${className}`} id='report-form'>
			{imageUrl ? <img alt='bild von meldung' src={imageUrl}/> : <p>Loading...</p>}
			<h2>{spot!.name}</h2>
			 <b>Beschreibung</b>
			<p>{spot!.description}</p>

			<div className='votingSection'>
				<b>Votes</b>
				<button onClick={handleUpvote}>{spot!._count.votes}</button>
			</div>
			<ul>
				{spot!.comments.map((comment, index) => <li>{comment.text}</li>)}
			</ul>
		</div>
	);
};

export default BlackSpotDetail;