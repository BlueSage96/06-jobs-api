import { inputEnabled, setDiv, message, setToken, token, enableInput } from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

export let gamesDiv = null;
let gamesTable = null;
let gamesTableHeader = null;

export const handleGames = () => {
  gamesDiv = document.getElementById("games");
  const logoff = document.getElementById("logoff");
  const addGame = document.getElementById("add-game");
  gamesTable = document.getElementById("games-table");
  gamesTableHeader = document.getElementById("games-table-header");

  gamesDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      const target = e.target;
      if (target === addGame) {
        showAddEdit(null);
        /*
        Note that logoff involves no communication with the back end. 
        The user is logged off by deleting the JWT from memory.
        */
      } else if (target === logoff) {
        setToken(null);
        message.textContent = `You have been logged off`;
        gamesTable.replaceChildren([gamesTableHeader]);
        showLoginRegister();
      } 
       /* 
        The dataset.id contains the id of the entry to be edited. 
        That is then passed on to the showAddEdit function. 
        So we need to change that function to do something with this parameter.
      */
      else if (target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(target.dataset.id);
      } else if (target.classList.contains("deleteButton")) {
         message.textContent = "";
         const gameId = target.dataset.id;
          if (!confirm("Are you sure you want to delete this game?")) return;
          const row = target.closest("tr");
          const url = `/api/v1/sudoku/game/${gameId}`;
          try {
           const response = await fetch(url, {
              method: "DELETE",
              headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`,
              }, body: JSON.stringify({ id: gameId })
           });
           const data = await response.json();
           if (response.status === 200 || response.status === 201) {
              //a 200 is expected for a successful update
                 message.textContent = "The game entry was deleted";
                if (row) row.remove();//deletes game
              showGames();
           } else {
               // 201 indicates a successful delete
                 message.textContent = "An error has occurred" || data.msg;
           }
        } catch (err) {
           console.log(err);
           message.textContent = "A communications error has occurred";
        }
        enableInput(true);
      }
    }
  });
};

export const showGames = async () => {
  try {
     enableInput(false);
     const response = await fetch("/api/v1/sudoku/game", {
        method: "GET",
        headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        },
     });
     const data = await response.json();
     let children = [gamesTableHeader];
     if (response.status === 200) {
        if (data.count === 0) {
           gamesTable.replaceChildren(...children);//clear this for safety
        } else {
           for (let i = 0; i < data.games.length; i++) {
              let rowEntry = document.createElement("tr");
              let editButton = `<td><button type="button" class="editButton" data-id=${data.games[i]._id}>edit</button></td>`;
              let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.games[i]._id}>delete</button></td>`;
              let rowHTML = `
            <td>${data.games[i].difficulty}</td>
            <td>${data.games[i].mistakes}</td>
            <td>${data.games[i].usedHints}</td>
            <td>${data.games[i].status}</td>
            <div>${editButton}${deleteButton}</div>`;

             rowEntry.innerHTML = rowHTML;
             children.push(rowEntry);
           }
           gamesTable.replaceChildren(...children);
        }
     } else {
       message.textContent = data.msg;
     }
  } catch (err) {
     console.log(err);
     message.textContent = "A communications error has occurred.";
  }
  enableInput(true);
  setDiv(gamesDiv);
};