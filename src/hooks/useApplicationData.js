import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {

  const [state, setState] = useState({ day: "Monday", days: [], appointments: {}, interviewers: {} });
  const setDay = day => setState({ ...state, day });
  
  //load the initial data from the api server
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then(res => {
        setState(prev => ({
          ...prev, days: res[0].data, appointments: res[1].data, interviewers: res[2].data
        }));
      })
      .catch(err => console.log(err))
  }, [])
  //helper function to calculate remaining spots on a given day
  const updateSpotsForDay = (id, appointments) => {
    let indexOfDay; //tracking the index of the day will help in the map function below
    
    const actualDay = state.days.find((elm,index) => {
      indexOfDay = index
      return elm.name === state.day
    })
    
    const day = {...actualDay, spots: 0}; //this variable is to avoid mutating state directly
    
    day.appointments.forEach((appointment) => {
      if (!appointments[appointment].interview) {   //increment if null only
        day.spots++;
      }
    });
    
    const days = state.days.map((elm,index) => {
      return (index === indexOfDay) ? day : elm
    });

    return days
  };

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
      axios.put(`/api/appointments/${id}`, { interview })
      .then(response => {
        const days =updateSpotsForDay(id, appointments)     //update the days object with the proper spots
        setState(prev => ({ ...prev, appointments, days }))
     
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
      axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const days = updateSpotsForDay(id, appointments)
        setState(prev => ({ ...prev, appointments, days }))
      })
    )
  };

  return { state, setDay, bookInterview, cancelInterview}
}