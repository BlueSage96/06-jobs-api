import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showGames } from "./games.js";

let addDeleteDiv = null;
let difficulty = null;
let mistakes = null;
let hints = null;
let status = null;
let deletingGame = null;

export const handleAddDelete = () => {
    addDeleteDiv = document.getElementById("delete-game");
    difficulty = document.getElementById("difficulty");
    mistakes = document.getElementById("mistakes");
    hints = document.getElementById("hints");
    status = document.getElementById("status");
    deletingGame = document.getElementById("deleting-game");
    const deleteCancel = document.getElementById("delete-cancel");

    addDeleteDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === deletingGame) {
        enableInput(false);
        let method = "POST";
        let url = "/api/v1/sudoku/game";

        if (deletingGame.textContent === "delete") {
           method = "DELETE";
           url = `/api/v1/sudoku/game/${addDeleteDiv.dataset.id}`
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
                 // 201 indicates a successful delete
                 message.textContent = "The game entry was deleted";
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
      } else if (e.target === deleteCancel) {
        message.textContent = "";
        showGames();
      }
    }
  });
}

// kinda works getting a game id error!!
export const showAddDelete = async (gameId) => {
  if (!gameId) {
    difficulty.value = "";
    mistakes.value = "";
    hints.value = "";
    status.value = "";
    deletingGame.textContent = "delete";
    message.textContent = "";
    setDiv(addDeleteDiv);
  } else {
    enableInput(false);
    try {
      const response = await fetch(`/api/v1/sudoku/game/${gameId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        difficulty.value = data.game.difficulty;
        mistakes.value = data.game.mistakes;
        hints.value = data.game.usedHints;
        status.value = data.game.status;
        deletingGame.textContent = "delete";
        message.textContent = "";
        addDeleteDiv.dataset.id = gameId;
        setDiv(addDeleteDiv);
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
