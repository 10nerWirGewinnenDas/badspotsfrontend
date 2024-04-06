import React, { useEffect, useRef, useState } from 'react';

import ApiService from 'src/api/api.service';
import './BlackSpotDetail.css';
import {GetBlackSpotDto} from "../../../api/api";

interface ReportFormProps {
	closeModal: () => void;
	className?: string;
	spot?: GetBlackSpotDto;
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
	spot
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
		console.log(spot?.description + " description")
		console.log(spot?.name + " name")
	}

	useEffect(() => {
		
		loadSpot()

		// DO NOT CHANGE DEPENDECNCYS!!!
	}, [])

	return (
		<div className={`blackSpotDescription container ${className}`} id='report-form'>
			{imageUrl ? <img alt='bild von meldung' src={imageUrl}/> : <p>Loading...</p>}
			<h2>{spot!.name}</h2>
			<ul>
				{spot!.comments.map((comment, index) => <li>{comment.text}</li>)}
			</ul>
		</div>
	);
};

export default BlackSpotDetail;
