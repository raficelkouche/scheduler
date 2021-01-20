import React from "react";
import classNames from "classnames"

import "components/InterviewerListItem.scss"

export default function InterviewerListItem (props){
  const { name, avatar, selected, setInterviewer } = props;
  const interviewersClass = classNames("interviewers__item", { "interviewers__item--selected": selected });
  
  return (
    <li className={interviewersClass} onClick={setInterviewer}>
      <img 
        className="interviewers__item-image"
        src={avatar} 
        alt={name}
      />
      {selected && name}
    </li>
  );
}