import React, { useState } from 'react';

import InterviewerList from "components/InterviewerList"
import Button from "components/Button"


export default function Form(props){
  const [name, setName] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");
  
  const reset = () => {
    setName("");
    setInterviewer(null);
    setError("");
  }

  const cancel = () => {
    reset();
    props.onCancel();
  }

  const validate = () => {
    if (error) {    //toggle the missing student name error
      setError("")
    }
    if (name === "") {
      setError(["Student name cannot be blank", ...error])
      return;
    }
    
    if (interviewer === null) {
      alert("Please select an interviewer")
      return;
    }

    props.onSave(name, interviewer);
    setError("");
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            data-testid="student-name-input"
            className="appointment__create-input text--semi-bold"
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            type="text"
            placeholder="Enter Student Name"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        
        <InterviewerList 
          interviewers={props.interviewers} 
          interviewer={interviewer} 
          setInterviewer={setInterviewer} 
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>Cancel</Button>
          <Button onClick={() => validate()} confirm>Save</Button>
        </section>
      </section>
    </main>
  );
}