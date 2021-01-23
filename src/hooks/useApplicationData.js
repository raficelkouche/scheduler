import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {

  const [state, setState] = useState({ day: "Monday", days: [], appointments: {}, interviewers: {} });
  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ])
      .then(res => {
        setState(prev => ({
          ...prev, days: res[0].data, appointments: res[1].data, interviewers: res[2].data
        }));
      })
      .catch(err => console.log(err))
  }, [])
  
  /*This will be called once the save button on the Form is clicked
  It will take in the appointment id and the interview object*/
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    //push the new appointment data to the database
    return (
      axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(response => {
        console.log(response.status)
        setState(prev => ({ ...prev, appointments }))
      })
      );
    };
    
    //Function to delete an appointment
    const cancelInterview = (id) => {
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      return (
        axios.delete(`http://localhost:8001/api/appointments/${id}`)
        .then(() => {
          setState(prev => ({ ...prev, appointments }))
        })
        )
      };
  return { state, setDay, bookInterview, cancelInterview}
}