
export function getAppointmentsForDay(state, day) {
  
  const dayObject = state.days.find((elm) => {
    return elm.name === day;
  });

  if(dayObject) {
    const appointmentsForDay = dayObject.appointments.map(appointment => {
      return state.appointments[appointment]
    });

    return appointmentsForDay;
  }
  
  return [];
}

export function getInterviewersForDay(state, day) {
  const interviewerObject = state.days.find((elm) => {
    return elm.name === day;
  });

  if (interviewerObject) {
    const interviewersForDay = interviewerObject.interviewers.map(interviewer => {
      return state.interviewers[interviewer]
    });

    return interviewersForDay;
  }

  return [];
}

export function getInterview(state, interviewObj){
  if (interviewObj) {
    return { ...interviewObj, interviewer: state.interviewers[interviewObj.interviewer] };
  }
  return null;
}