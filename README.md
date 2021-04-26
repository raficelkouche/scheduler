# Interview Scheduler
A single-page application that allows users to book and manage interviews, built using React. The application has been deployed to Netlify and can be reached on the following URLs:

Netlify: https://tender-goldberg-b41ce6.netlify.app/

## Features
- Schedule an interview based on availability.
- Pick an interviewer from the list.
- Delete an interview.

## Screenshots
!["Main View"](https://github.com/raficelkouche/scheduler/blob/master/docs/scheduler-home.png)

!["New Appointment Form"](https://github.com/raficelkouche/scheduler/blob/master/docs/scheduler-new.png)

!["Display Booked Appointment"](https://github.com/raficelkouche/scheduler/blob/master/docs/scheduler-show.png)

![Demo](docs/demo.gif)

## Setup
- Fork and clone the following repository since it contains all the server-side code: [scheduler-api](https://github.com/lighthouse-labs/scheduler-api).

- After making sure that the server is running, install the dependencies on the client-side:
 ```sh 
npm install
``` 

- Rename the `.env.development.sample` to `.env.development` and change the PORT based on the settings on your local machine.

- Run the development server
```sh
npm start
```
- To run the Jest testing framework:
```sh
npm test
```
- To run the Storybook visual testbed: 
```sh
npm run storybook
```

## Dependecies
- React v16.9.0
- Axios v0.21.1
- Classnames v2.2.6

## Future plans
- User management (authentication, sessions, etc...)
- Ability to add interviewers to the list.
- Integration of web sockets to enable multiple users to use the app at once.

