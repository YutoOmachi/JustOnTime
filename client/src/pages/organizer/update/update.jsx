import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './update.css'
import logo from '../../../logo_cropped.png'

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
                const res = await axios.get('/api/event/organizerEvents').then(res => res.data.events.filter(event => event.name === eventId));
				setEventState(res);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        })
        fetchData();
    }, [])

	const handleUpdate = (e) => {
		e.preventDefault();
		let tempData = [...e.currentTarget.elements]
			.filter((field) => field.type !== "submit" && field.type !=="file" && field.value !== undefined)
			.map((field) => {
				return {
					[field.id]: field.value
				};
			});

		var data = {}
		for (const field of tempData) {
			data = Object.assign(data, field)
		}

		for(const [key, value] of Object.entries(data)) {
			if (value === "") {
				if (["street", "city", "country", "postalCode"].includes(key)) {
					data[key] = (eventState[0]["address"][key])
				}
				else {
					data[key] = (eventState[0][key])
				}
			}
		}
		data["id"] = data["name"]

		if (!e.currentTarget.hasOwnProperty("files") || e.currentTarget.files[0] === "") {
			data["path"] = eventState[0]["eventImagePath"]
		} else {
			data["path"] = e.currentTarget.files[0]
		}
		
		const config = {
			headers: { "content-type": "multipart/form-data" }
		}

		var form = new FormData();

		for (var key in data) {
			form.append(key, data[key]);
		}

		const updateEvent = async () => {
			console.log(data)
			await axios.post("/api/event/updateEvent", form, config)
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
                    eventState.map(event =>
                        <button className="event">
                           	<img src={event.eventImagePath} alt={event.name}></img><br/>
                            {event.name}<br/>
                            {event.hasOwnProperty('address') && event.address.hasOwnProperty('street') && event.address.street}<br/>
                            {event.hasOwnProperty('address') && event.address.hasOwnProperty('city') && event.address.city}<br/>
                            {event.hasOwnProperty('address') && event.address.hasOwnProperty('country') && event.address.country}
                        </button>
                    )
                }

				{/* Remove when events are obtained from the database */}
				{
					eventState.length === 0 &&
						<button className="event">
							<img id="logo" src={logo} alt='JustOnTime' width="200" height="50"/><br/>
							Default Event<br/>
							123 Main Street<br/>
							Toronto<br/>
							Canada
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
					{/* Add this again when getOrganizerEvents returns the time as a field */}
					{/* <tr>
						<td><label htmlFor="time" className="label">Time:</label></td>
						<td><input type="text" id="time"></input></td>
					</tr> */}
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