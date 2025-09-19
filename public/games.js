import { inputEnabled, setDiv, message, setToken, token, enableInput } from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let gamesDiv = null;
let gamesTable = null;
let gamesTableHeader = null;

export const handleGames = () => {
  gamesDiv = document.getElementById("games");
  const logoff = document.getElementById("logoff");
  const addGame = document.getElementById("add-game");
  gamesTable = document.getElementById("games-table");
  gamesTableHeader = document.getElementById("games-table-header");

  gamesDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addGame) {
        showAddEdit(null);
        /*
        Note that logoff involves no communication with the back end. 
        The user is logged off by deleting the JWT from memory.
        */
      } else if (e.target === logoff) {
        showLoginRegister();
      }
    }
  });
};

export const showGames = async () => {
  setDiv(gamesDiv);
};