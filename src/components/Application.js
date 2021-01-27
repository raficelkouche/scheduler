import React from "react";

import "components/Application.scss";
import { DayList } from "components/DayList"
import Appointment from "components/Appointment";
import {getAppointmentsForDay, getInterviewersForDay, getInterview} from "../helpers/selectors";
import useApplicationData from "../../src/hooks/useApplicationData"

export default function Application() {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();
  
  //These functions will get both appointments/interviewers for a specific day
  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const interviewers = getInterviewersForDay(state, state.day)
 
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
