import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  console.log("called")
  const [state, setState] = useState({ day: "Monday", days: [], appointments: {}, interviewers: {} });
  const setDay = day => setState({ ...state, day });
  
  //load the initial data from the api server
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
      .then(res => {
        setState(prev => ({
          ...prev, days: res[0].data, appointments: res[1].data, interviewers: res[2].data
        }));
      })
      .catch(err => console.log(err))
  }, []);

  useEffect(() =>  {
    console.log("useEffect called")
    const webSocket = new WebSocket("ws://localhost:8001")
    webSocket.onmessage = function (event) {
      const data = JSON.parse(event.data)
      if (data.type === 'SET_INTERVIEW'){ 
        console.log("onmessage called:", state)
        //setState(prev => testFunction(prev,data.id,data.interview))
      }
    }
    return () => {
      console.log("closing socket");
      webSocket.close();
    };
  }, []);

  //helper function to calculate remaining spots on a given day
  const updateSpotsForDay = (prev,id, appointments) => {
    let indexOfDay; //tracking the index of the day will help in the map function below
   
    const actualDay = prev.days.find((elm,index) => {
      indexOfDay = index;
      return elm.name === state.day;
    })
   
    const day = {...actualDay, spots: 0}; //this variable is to avoid mutating state directly
    day.appointments.forEach((appointment) => {
      if (!appointments[appointment].interview) {   //increment if null only
        day.spots++;
      }
    });
    
    const days = prev.days.map((elm,index) => {
      return (index === indexOfDay) ? day : elm
    });

    return days;
  };

  const testFunction = (previousState, id, interview) => {
    //console.log(previousState)
    let appointment = null;
    if (interview) {
      appointment = {
        ...previousState.appointments[id],
        interview: { ...interview }
      }
    }
    else {
      appointment = {
        ...previousState.appointments[id],
        interview: null
      }
    }
    const appointments = {
      ...previousState.appointments,
      [id]: appointment
    };
    
    const days = updateSpotsForDay(previousState,id, appointments);

    return {...previousState, appointments, days}
  }

  const addInterview = (id, interview) => {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
   
    const days = updateSpotsForDay(state,id, appointments);
    
    setState(prev => ({ ...prev, appointments, days}));
  };

  const removeInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    const days = updateSpotsForDay(id, appointments);
    setState(prev => ({ ...prev, appointments, days }));
  }
  /*This will be called once the save button on the Form is clicked
  It will take in the appointment id and the interview object*/
  const bookInterview = (id, interview) => {
    return (
      axios.put(`/api/appointments/${id}`, { interview })
      .then(() => addInterview(id, interview))
    );
  };
    
  //Function to delete an appointment from the server
  const cancelInterview = (id) => {
    return (
      axios.delete(`/api/appointments/${id}`)
      .then(() => removeInterview(id))
    )
  };

  return { state, setDay, bookInterview, cancelInterview};
};