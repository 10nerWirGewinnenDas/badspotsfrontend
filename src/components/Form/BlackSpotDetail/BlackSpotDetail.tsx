import React, { useEffect, useRef, useState } from 'react';

import ApiService from 'src/api/api.service';
import './BlackSpotDetail.css';
import {GetBlackSpotDto} from "../../../api/api";
import {AxiosError} from "axios";

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
	const [votes, setVotes] = useState(0)
	const [voted, setVoted] = useState(false)

	const loadSpot = async () => {
		try {
			setVotes(spot!._count.votes)
			setVoted((spot!.votes?.length ?? 0) !== 0)
			const imageRes = await ApiService.api.blackSpotsControllerGetImage(spot!.id, {
			  format: 'blob'
			});
		  
			setImageUrl(URL.createObjectURL(imageRes.data));
		  } catch (error) {
			console.error('Error getting image:', error);
		  }
		
	}

	const handleUpvote = async () => {
		const voterId = window.localStorage.getItem('voterId');
	
		try {
			const vote = await ApiService.api.blackSpotsControllerVote(spot!.id, {
					type: 'UP',
				blackSpotId: spot!.id,
				voterId: voterId ?? undefined
			})	

			if(!voterId){
				window.localStorage.setItem('voterId', vote.data.voterId);
			}

			setVotes(votes + 1);
			setVoted(true);
		} catch (error) {
			
			if(error instanceof AxiosError){
				if(error.response!.status === 400){
					
					// unvote
					await ApiService.api.blackSpotsControllerUnVote(spot!.id, {
						type: 'UP',
						blackSpotId: spot!.id,
						voterId: voterId ?? undefined
					})
								
					setVotes(votes - 1);
					setVoted(false);
				}
			}
			console.error('Error upvoting:', error);
		}
	}

	useEffect(() => {
		
		loadSpot()

		// DO NOT CHANGE DEPENDECNCYS!!!
	}, [])

	return (
		<div className={`blackSpotDescription container ${className}`} id='report-form'>
			{imageUrl ? <img alt='bild von meldung' src={imageUrl}/> : <p></p>}
			<h2>{spot!.name}</h2>
			 <b>Beschreibung</b>
			<p>{spot!.description}</p>

			<div className='votingSection'>
				<b>Votes</b>
				<button onClick={handleUpvote}>{votes}  - {voted ? 'Vote entfernen' : 'Vote hinzufügen'}</button>
			</div>
			<ul>
				{spot!.comments.map((comment, index) => <li>{comment.text}</li>)}
			</ul>
		</div>
	);
};

export default BlackSpotDetail;
