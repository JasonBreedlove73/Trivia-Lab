This lab was created to show that I have learned how to create seperate components that pass props successfuly in React.

This app uses an Open Trivia Database API.

I created a Home page that loads when the app is called. The Home page displays a form that has a welcome message and instructions for the user.

If the form is not filled out correctly an error displays preventing the user from submitting the form.

Once the form is filled out correctly with name, category, and difficulty the user will click the submit button which will call the trivia question.

The questions are multiple choice with radio buttons for the answers.
A conditional render is called that will show a message if the API call encounters an error.
An error message will display if the user tries to submit without an answer selected.

When the user submits an answer a message will appear containing the users name and if they answered the question correctly or not. This message will also contain a button that will allow the user to start over with another question.
