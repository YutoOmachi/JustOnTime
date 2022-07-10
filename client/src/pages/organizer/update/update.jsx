import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { store } from '../../../store.js'
import { getEventImage } from "../../../services/event/eventService";
import './update.css'

function OrganizerUpdate() {
    const [eventState, setEventState] = useState({})
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
	const eventId = window.location.pathname.split("/").pop()

    const Heading = () => {
        return (
            <div className="top">
                <h1 id="title"> Update Event </h1>
            </div>
        )
    }

    useEffect(() => {
        const fetchData = (async () => {
            try {
                await axios.get('/api/event/organizerEvents', {params: {"id": store.getState().auth.user._id}}).then(function(res) {
					const event = (res.data.events.filter(event => event.name === eventId))[0];
					event["blob"] = getEventImage(event.id);
					setEventState(event);
				}
				);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        })
        fetchData();
    }, [eventId])

	const handleUpdate = (e) => {
		e.preventDefault();

		let tempData = [...e.currentTarget.elements]
			.filter((field) => field.type !== "submit")
			.map((field) => {
				return {
					[field.id]: field.value
				};
			});

		var data = {}
		for (const field of tempData)
			data = Object.assign(data, field)

		for(const [key, value] of Object.entries(data)) {
			if (value === "") {
				if (["street", "city", "country", "postalCode"].includes(key))
					data[key] = (eventState["address"][key])
				else
					data[key] = (eventState[key])
			}
		}

		if (e.target[6].files[0] !== undefined)
			data["image"] = e.target[6].files[0];

		// default values
		data["time"] = "0:00"
		data["date"] = "jan 1 2022"
		data["location"] = "eventImages"
		data["tags"] = []
		data["bidHistory"] = []
		delete data["path"]

		const config = {
			headers: { "content-type": "multipart/form-data" }
		}

		var form = new FormData();

		for (var key in data)
			form.append(key, data[key]);

		const updateEvent = async () => {
			try {
				await axios.post(`/api/event/updateEvent/?eventId=${eventState.id}`, form, config)
			} catch(e) {
				console.log(e)
			}
		}
		updateEvent();

		navigate("/organizer/main");
	}

    if (error) {
        return (
            <div>
                <Heading/>
                <p id="error">An error occurred while trying to load the events</p>
            </div>
    )} else if (loading) { 
        return (
            <div>
                <Heading/>
                <div className="row justify-content-center">
                    <div id="loader" className="spinner-border text-primary" role="status"></div>
                </div>
            </div>
        ) 
    } else {
        return (
        <div>
            <Heading/>
            <div className="list">
                {
					<button className="event">
						<img id="image" src={URL.createObjectURL(new Blob([eventState.blob], {type:"image/jpeg"}))} alt={eventState.name}></img><br/>
						{eventState.name}<br/>
						{eventState.hasOwnProperty('address') && eventState.address.hasOwnProperty('street') && eventState.address.street}<br/>
						{eventState.hasOwnProperty('address') && eventState.address.hasOwnProperty('city') && eventState.address.city}<br/>
						{eventState.hasOwnProperty('address') && eventState.address.hasOwnProperty('country') && eventState.address.country}
					</button>
                }
            </div>
			
			<form id="form" action="" onSubmit={handleUpdate} method="post" encType="multipart/form-data">
				<table>
					<tbody>
					<tr>
						<td><label htmlFor="name" className="label">Name:</label></td>
						<td><input type="text" id="name"></input></td>
					</tr>
					<tr>
						<td><label htmlFor="description" className="label">Description:</label></td>
						<td><input type="text" id="description"></input></td>
					</tr>
					<tr>
						<td><label htmlFor="street" className="label">Street:</label></td>
						<td><input type="text" id="street"></input></td>
					</tr>
					<tr>
						<td><label htmlFor="city" className="label">City:</label></td>
						<td><input type="text" id="city"></input></td>
					</tr>
					<tr>
						<td><label htmlFor="country" className="label">Country:</label></td>
						<td><input type="text" id="country"></input></td>
					</tr>
					<tr>
						<td><label htmlFor="postalCode" className="label">Postal Code:</label></td>
						<td><input type="text" id="postalCode"></input></td>
					</tr>
					<tr>
						<td><label htmlFor="path" className="label">Image Path:</label></td>
						<td><input type="file" id="path" name="Image" accept="image/*"></input></td>
					</tr>
					</tbody>
				</table>
				<div className="text-center">
				<input type="submit" id="submit"></input>
				</div>
			</form>
        </div>
        )
    }
}

export default OrganizerUpdate