import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import { DayList } from "components/DayList"
import Appointment from "components/Appointment";
import {getAppointmentsForDay, getInterviewersForDay, getInterview} from "../helpers/selectors";


export default function Application(props) {
  
  const [state, setState] = useState({ day: "Monday", days: [], appointments: {}, interviewers: {} });
  const setDay = day => setState({ ...state,day });
  
  //These functions will get both appointments/interviewers for a specific day
  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const interviewers = getInterviewersForDay(state, state.day)
  
  /*This will be called once the save button on the Form is clicked
  It will take in the appointment id and the interview object*/
  const bookInterview = (id,interview) => {
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
      axios.put(`http://localhost:8001/api/appointments/${id}`,{interview})
        .then(response => {
          console.log(response.status)
          setState(prev => ({...prev,appointments}))
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
    return(
      axios.delete(`http://localhost:8001/api/appointments/${id}`)
        .then(() => {
          setState(prev => ({...prev, appointments}))
        })
    )
  };
 
  const appointments =  dailyAppointments.map((appointment) => {
      const interview = getInterview(state, appointment.interview)
      return ( 
        <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={interview}             //The interviewer's id, name and avatar if an interview exists
          interviewers={interviewers}       //Group of interviewers available on that specific day
          bookInterview={bookInterview}     //function that will take in the appointment id and the interview object
          cancelInterview={cancelInterview} //function that will delete an interview
        />
      );
    });
  
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
  
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList 
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments}
        <Appointment key="last" time="5pm"/>
      </section>
    </main>
  );
}
