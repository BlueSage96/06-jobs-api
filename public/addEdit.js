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
        enableInput(false);
        let method = "POST";
        let url = "/api/v1/sudoku/game";
        try {
           const response = await fetch(url, {
              method: method,
              headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                 difficulty: difficulty.value,
                 mistakes: mistakes.value,
                 hints: hints.value,
                 status: status.value,
              }),
           });
           const data = await response.json();
           if (response.status === 201) {
              // 201 indicates a successful create
              message.textContent = "The game entry was created";
              difficulty.value = "";
              mistakes.value = "";
              hints.value = "";
              status.value = "";
              showGames();
           } else {
              message.textContent = data.msg;
           }
        } catch (err) {
           console.log(err);
           message.textContent = "A communications error occurred";
        }
        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showGames();
      }
    }
  });
};

export const showAddEdit = (game) => {
  message.textContent = "";
  setDiv(addEditDiv);
};