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

        if (addingGame.textContent === "update") {
           method = "PATCH";
           url = `/api/v1/sudoku/game/${addEditDiv.dataset.id}`
        }
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
                 usedHints: hints.value,
                 status: status.value,
              }),
           });
           const data = await response.json();
           if (response.status === 200 || response.status === 201) {
              if (response.status === 200) {
                 //a 200 is expected for a successful update
                 message.textContent = "The game entry was updated";
              } else {
                 // 201 indicates a successful create
                 message.textContent = "The game entry was created";
              }
              
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
           message.textContent = "A communications error has occurred";
        }
        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showGames();
      }
    }
  });
};

export const showAddEdit = async (gameId) => {
  if (!gameId) {
     difficulty.value = "";
     mistakes.value = "";
     hints.value = "";
     status.value = "";
     addingGame.textContent = "add";
     message.textContent = "";
     setDiv(addEditDiv);
  } else {
     enableInput(false);
     try {
       const response = await fetch(`/api/v1/sudoku/game/${gameId}`, {
          method: "GET",
          headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`
          },
       });
       const data = await response.json();
       if (response.status === 200) {
          difficulty.value = data.game.difficulty;
          mistakes.value = data.game.mistakes;
          hints.value = data.game.usedHints;
          status.value = data.game.status;
          addingGame.textContent = "update";
          message.textContent = "";
          addEditDiv.dataset.id = gameId;
          setDiv(addEditDiv);
       } else {
        // might happen if the list has been updated since last display
         message.textContent = "The games entry was not found";
         showGames();
       }
     } catch (err) {
        console.log(err);
        message.textContent = "A communications error has occurred";
        showGames();
     }
     enableInput(true);
  }
};