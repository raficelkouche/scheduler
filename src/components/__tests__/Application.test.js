import React from "react";
import { render, cleanup,  fireEvent, prettyDOM, getByAltText, getByPlaceholderText, getByDisplayValue } from "@testing-library/react";
import { waitForElement, getByText, getAllByTestId, queryByText, queryByAltText } from "@testing-library/react";
import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />)
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"))
      expect(getByText("Leopold Silvers")).toBeInTheDocument()
    });
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />)
    await waitForElement(() => getByText(container, "Archie Cohen"))
    const appointment = getAllByTestId(container, "appointment")[0]
    
    //Click on the "add" button
    fireEvent.click(getByAltText(appointment,"Add"));
    //Type in the student name
    fireEvent.change(getByPlaceholderText(appointment,/enter student name/i), {
      target: {value: "Lydia Miller-Jones"}
    });
    //Choose an interviewer
    fireEvent.click(getByAltText(appointment,"Tori Malcolm"));
    //Click on save
    fireEvent.click(getByText(appointment,"Save"));
    //Confirm that the applications goes to SAVING mode
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    //Check that the student's name is shown after the "Saving" indicator is hidden
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))
    //Check that Monday has no spots remaining
    const day = getAllByTestId(container, "day").find((node) => {
         return queryByText(node,"Monday")
    });
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
    
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    //Render the application
    const {container, debug} = render(<Application />);
    //Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //Click on the Delete button and then confirm
    const appointment = getAllByTestId(container, "appointment").find((article) => {
      return queryByAltText(article, "Delete")
    });
    fireEvent.click(getByAltText(appointment,/Delete/i));
    //Check that the confirmation message is shown
    expect(getByText(appointment, /are you sure you would like to delete/i)).toBeInTheDocument()
    //Click the "confirm" button
    fireEvent.click(getByText(appointment, /confirm/i));
    //Check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument()
    //Wait until the element with the "Add" button is displayed
    await waitForElement(() => getByAltText(appointment,"Add"))
    //Check that Monday has 2 spots remaining
    const day = getAllByTestId(container, "day").find(day => {
      return queryByText(day, "Monday")
    })
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining the same", async () => {
    //Render the application component
    const { container, debug } = render(<Application />)
    //wait for the text "Archie Cohen" to be displayed
    await waitForElement(() => getByText(container, "Archie Cohen"))
    //Click the edit button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find((article) => {
      return queryByText(article, "Archie Cohen")
    });

    fireEvent.click(getByAltText(appointment, "Edit"));
    //Type in the student name
    fireEvent.change(getByDisplayValue(appointment, "Archie Cohen"), {
      target: { value: "Rafic El Kouche" }
    });
    //Choose another interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    //Click on save
    fireEvent.click(getByText(appointment, "Save"));
    //Confirm that the applications goes to SAVING mode
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    //Check that the student's name is shown after the "Saving" indicator is hidden
    await waitForElement(() => getByText(appointment, "Rafic El Kouche"))
    //Check that Monday has 1 spot remaining (same as the original)
    const day = getAllByTestId(container, "day").find((node) => {
      return queryByText(node, "Monday")
    });
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    //Render the application
    const { container, debug } = render(<Application />)

    //Wait for the text "Archie Cohen" to be displayed
    await waitForElement(() => getByText(container, "Archie Cohen"))
    const appointment = getAllByTestId(container, "appointment")[0]

    //Click on the "add" button
    fireEvent.click(getByAltText(appointment, "Add"));

    //Type in the student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    //Choose an interviewer
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));

    //Click on save
    await axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Save"));

    //Wait for "Saving" to be displayed
    await waitForElement(() => getByText(appointment,"Saving"))

    //Confirm that the applications displays ERROR
    expect(getByText(appointment, "Could not save appointment")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    //Render the application
    const { container, debug } = render(<Application />);
    //Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //Click on the Delete button and then confirm
    const appointment = getAllByTestId(container, "appointment").find((article) => {
      return queryByAltText(article, "Delete")
    });
    fireEvent.click(getByAltText(appointment, /Delete/i));
    //Check that the confirmation message is shown
    expect(getByText(appointment, /are you sure you would like to delete/i)).toBeInTheDocument()
    //Click the "confirm" button
    await axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, /confirm/i));
    //Check that the element with the text "Deleting" is displayed
    await waitForElement(() => getByText(appointment, "Deleting"))
    
    //Confirm that the applications displays ERROR
    expect(getByText(appointment, "Could not cancel appointment")).toBeInTheDocument();
  });
})
