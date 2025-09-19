/*
Notice that we’ve now made the click event listener callback function async. 
We then check to see if the user entered matching passwords in the two inputs. 
If they did, disable clicking on the buttons and then make the fetch() call to 
the register endpoint.
If the call is successful, we parse the data from the response, display a message 
to the user, and save the token to local storage using the function exported from 
index.js. We can then display the jobs page. If the call was not successful we will 
continue to show the register page and will display the error message from the response 
to the user. If any errors occur, then we catch them and continue to show the register 
page and show a generic error message to the user.
*/

import { inputEnabled, setDiv, message, token, enableInput, setToken } from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showGames } from "./games.js";

let registerDiv = null;
let name = null;
let email1 = null;
let password1 = null;
let password2 = null;

export const handleRegister = () => {
  registerDiv = document.getElementById("register-div");
  name = document.getElementById("name");
  email1 = document.getElementById("email1");
  password1 = document.getElementById("password1");
  password2 = document.getElementById("password2");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");

  registerDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === registerButton) {
        if (password1.value != password2.value) {
           message.textContent = "The passwords entered do not match";
        } else {
           enableInput(false);
           try {
             const response = await fetch("/api/v1/sudoku/auth/register", {
                method: "POST",
                headers: {
                   "Content-Type": "application/json"
                },
                body: JSON.stringify({
                   name: name.value,
                   email: email1.value,
                   password: password1.value,
                }),
             });
             const data = await response.json();
             if (response.status === 201) {
                message.textContent = `Registration successful! Welcome ${data.user.name}`;
                setToken(data.token);
                name.value = "";
                email1.value = "";
                password1.value = "";
                password2.value = "";
                showGames();
             } else {
                message.textContent = data.msg;
             }
           } catch(err) {
              console.error(err);
              message.textContent = "A communications error occurred.";
           }
           enableInput(true);
        }
       
      } else if (e.target === registerCancel) {
         name.value = "";
         email1.value = "";
         password1.value = "";
         password2.value = "";
         showLoginRegister();
      }
    }
  });
};

export const showRegister = () => {
  email1.value = null;
  password1.value = null;
  password2.value = null;
  setDiv(registerDiv);
};