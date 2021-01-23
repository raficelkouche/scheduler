import React from "react";

import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Status from "components/Appointment/Status"
import Confirm from "components/Appointment/Confirm"
import Form from "components/Appointment/Form";
import Error from "components/Appointment/Error";
import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props){
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //helper function to save an interview
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVE);
    
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW)
      })
      .catch((error) => {
        console.log("error: ", error.response)
        transition(ERROR_SAVE, true);
    });
  };

  //helper function to delete a booked interview
  const deleteInterview = () => {
    transition(DELETE,true)
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(error => {
        console.log("error:", error.response);
        transition(ERROR_DELETE,true);
      });
  }
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}
      {mode === SHOW && (
        <Show 
          {...props.interview} 
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)} 
          />
      )}
      {mode === SAVE && <Status message="Saving"/>}
      {mode === CONFIRM && (
        <Confirm 
           message="Are you sure you would like to delete?"
           onConfirm={deleteInterview}
           onCancel={back}
        />
      )}
      {mode === DELETE && <Status message="Deleting"/>}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={() => back()}
          onSave={save}
          onDelete={deleteInterview}
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer= {props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save} 
        />
      )}
      {mode === ERROR_SAVE && <Error message="Could not save appointment" onClose={back}/>}
      {mode === ERROR_DELETE && <Error message="Could not cancel appointment" onClose={back}/>}
    </article>
  );
}
