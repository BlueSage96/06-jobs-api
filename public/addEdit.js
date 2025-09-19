import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showGames } from "./games.js";

let addEditDiv = null;
let difficulty = null;
let mistakes = null;
let hints = null;
let status = null;
let addingGame = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-game");
  difficulty = document.getElementById("difficulty");
  mistakes = document.getElementById("mistakes");
  hints = document.getElementById("hints");
  status = document.getElementById("status");
  addingGame = document.getElementById("adding-game");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingGame) {
        showGames();
      } else if (e.target === editCancel) {
         showGames();
      }
    }
  });
};

export const showAddEdit = (game) => {
  message.textContent = "";
  setDiv(addEditDiv);
};