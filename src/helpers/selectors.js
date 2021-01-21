
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