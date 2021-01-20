import React from 'react';

import DayListItem from '../components/DayListItem'

export function DayList(props) {
  const { days, day, setDay } = props;
  const daysArray = days.map((elm) => {
    elm.selected = (elm.name === day)
    return (
      <DayListItem key={elm.id} {...elm} setDay={setDay}/>
      )
    })
 return daysArray;
};