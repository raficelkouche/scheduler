import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";
import PropTypes from 'prop-types';

export default function InterviewerList(props) {
  const {interviewers, interviewer, setInterviewer} = props;

  const interviewersArray = interviewers.map(elm => {
    return (
      <InterviewerListItem 
        key={elm.id}
        selected={interviewer===elm.id}
        name={elm.name}
        avatar={elm.avatar}
        setInterviewer={() => setInterviewer(elm.id)}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewersArray}</ul>
    </section>
  );
};
//ensure the data passed to this component is an array
InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};