const rooms = new Map();
let roomId = null;

function createRoom() {
    roomId = Math.random().toString(36).substr(2, 6); // Generate a random ID
    document.getElementById("roomIdDisplay").innerText = roomId;

}

function joinRoom() {
    roomId = document.getElementById("roomIdInput").value;
    let playerName = document.getElementById("playerNameInput").value;

    if (!roomId || !playerName) {
        alert("Enter a valid Room ID and Name");
        return;
    }

    let players = JSON.parse(localStorage.getItem(roomId)) || [];
    players.push(playerName);
    localStorage.setItem(roomId, JSON.stringify(players));

    updatePlayerList(players);
}

function updatePlayerList(players) {
    let playerList = document.getElementById("playerList");
    playerList.innerHTML = "";
    players.forEach(player => {
        let li = document.createElement("li");
        li.innerText = player;
        playerList.appendChild(li);
    });
}

function startGame() {
    if (!roomId) {
        alert("No room created or joined!");
        return;
    }

    window.location.href = `../main.html?room=${roomId}`;
}

// If there's a stored room, display players
let storedRoomId = document.getElementById("roomIdInput").value;
if (storedRoomId) {
    let players = JSON.parse(localStorage.getItem(storedRoomId)) || [];
    updatePlayerList(players);
}
