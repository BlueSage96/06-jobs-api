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
        showGames();
       
      } else if (e.target === registerCancel) {
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