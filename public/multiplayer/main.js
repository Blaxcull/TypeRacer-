let mistakeCount = 0
const ws = new WebSocket('ws://localhost:3000');

let rank;
const completedClients = new Set();
let isCompleted = false;



let wpmList = []
let cList;
let wpmMap = []
let cTimeElements = [];

let s = 0
let cTime = document.createElement('span')
wpmMap.push(0)
let currTime = 0

let num = 0;
let startAll = document.createElement("button")
startAll.className = 'start-all-button'; // Add class for styling

let roomID;
let clientLst = []
const rooms = new Map();
let clientTime = 0;
let roomId = null;
let playerName;

function createHeader() {
  const header = document.createElement('header');
  header.className = 'header';

  header.innerHTML = `
    <div class="container">
      <div class="logo">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="keyboard-icon">
            <rect width="20" height="16" x="2" y="4" rx="2" ry="2"></rect>
            <path d="M6 8h.01"></path>
            <path d="M10 8h.01"></path>
            <path d="M14 8h.01"></path>
            <path d="M18 8h.01"></path>
            <path d="M8 12h.01"></path>
            <path d="M12 12h.01"></path>
            <path d="M16 12h.01"></path>
            <path d="M7 16h10"></path>
          </svg>
        </div>
        <a href="../mainpage/main.html" style="all: unset;">
          <span id="speed">SpeedType Master</span>
        </a>
      </div>
      <nav class="nav">
        <ul class="nav-list">
          <li><a href="" class="nav-link btn-signup" id="LogOut">LogOut</a></li>
        </ul>
        <button class="mobile-menu-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </div>
  `;

  document.body.prepend(header);
}



const texts = {
  easy: [
  "Sometimes the smallest step in the right direction ends up being the biggest step of your life"
  ]
}

// Load chat system
document.addEventListener('DOMContentLoaded', function() {
  const chatScript = document.createElement('script');
  chatScript.src = 'chat.js';
  document.body.appendChild(chatScript);

  chatScript.onload = function() {
    if (window.chatSystem) {
    }
  };
});

playerName = document.getElementById('PlayerNameInput')
let joinNameInput = document.getElementById('JoinPlayerNameInput');

if (playerName && playerName.value === '' && joinNameInput) {
  playerName.value = joinNameInput.value;
}

let createRoom = document.getElementById('create_room')

let compvar = 0;


if (createRoom) {
  createRoom.onclick = () => {
    roomId = Math.random().toString(36).substr(2, 6); // Generate a random ID

    // Save player name
    localStorage.setItem('playerName', playerName.value);

    // Clear everything except header
    Array.from(document.body.children).forEach(function(el) {
      if (el.tagName !== 'HEADER') {
        el.remove();
      }
    });

    // Create game content area
    const gameContentArea = document.createElement('div');
    gameContentArea.className = 'game-content-area';
    document.body.appendChild(gameContentArea);

    // Create container for room ID, copy button, and start button
    const roomIdDisplay = document.createElement("div");
    roomIdDisplay.className = "room-id-display";

    const containerdiv = document.createElement('div');
    containerdiv.id = 'copyContainer'; // Flexbox container

    const roomIdText = document.createElement("h4");
    roomIdText.innerHTML = `Room id - ${roomId}`;

    const copyButton = document.createElement("button");
    copyButton.innerHTML = "Copy";
    copyButton.className = "copy-button";

    const startRaceButton = document.createElement("button");
    startRaceButton.textContent = "Start Race";
    startRaceButton.className = "start-all-button";

    // Assign existing startAll behavior to the new button
    startRaceButton.onclick = startAll.onclick;

    // Copy to clipboard
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(roomId).catch(err => {
        alert("Failed to copy: " + err);
      });
    });

    // Build the layout
    containerdiv.appendChild(roomIdText);
    containerdiv.appendChild(copyButton);
    containerdiv.appendChild(startRaceButton);
    roomIdDisplay.appendChild(containerdiv);
    gameContentArea.prepend(roomIdDisplay);

    // Set up room
    rooms.set(roomId, new Set());

    ws.send(JSON.stringify({
      type: 'new_room',
      playerValue: playerName.value,
      room: Array.from(rooms.entries())
    }));

    ws.send(JSON.stringify({ type: 'lst', id: clientId }));

    // Initialize chat system
    if (window.chatSystem) {
      window.chatSystem.initChatSystem();
      window.chatSystem.addSystemMessage(`Room "${roomId}" created. Waiting for others to join.`);
    } else {
      const chatScript = document.createElement('script');
      chatScript.src = 'chat.js';
      document.body.appendChild(chatScript);

      chatScript.onload = function () {
        window.chatSystem.initChatSystem();
        window.chatSystem.addSystemMessage(`Room "${roomId}" created. Waiting for others to join.`);
      };
    }
  };
}





startAll.onclick = () => {

  ws.send(JSON.stringify({type: 'startAll', id: clientId}))
    
  // Remove chat container after game starts
 const chatContainer = document.querySelector('.chat-container'); // Update the class if needed
  if (chatContainer) {
    chatContainer.remove();
  } else {
  }
}

let isClicked = false;

if (createRoom) {
  createRoom.addEventListener("click", () => {
    isClicked = true;
  });
}

const returnButton = document.createElement('div');
returnButton.textContent = 'host has left'
returnButton.className = 'return-button'

let joinRoom = document.getElementById('joinRoom')

let clientId;

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // Handle chat messages
  if (data.type === 'chat_message') {
    if (window.chatSystem) {
      window.chatSystem.processIncomingChatMessage(data);
    }
  }

  if (data.type === 'start') {
    startGame();
  }

let kickButton;

if (data.type === 'lst') {
  
  // Update player list using the chat system
  if (window.chatSystem && data.lst && data.lst.length > 0) {
    window.chatSystem.updatePlayerList(data.lst);
  }
  
  // Create client container if it doesn't exist
  let clientContainer = document.querySelector('.client-container');
  if (!clientContainer) {
    clientContainer = document.createElement('div');
    clientContainer.className = 'client-container';
    document.body.appendChild(clientContainer);
  }

  // Loop through the clients list
  data.lst.forEach(client => {
    // Check if the client container already exists, to avoid adding it again
    let existingClientContainer = clientContainer.querySelector(`.client-display[data-client="${client}"]`);
    if (!existingClientContainer) {
      // Create container for client and kick button
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'space-between';
      container.style.width = '100%';
      container.style.maxWidth = '600px';
      container.style.margin = '0 auto';
      container.style.padding = '5px'; // Optional: To give space between client name and button

      // Create client display div
      let divClient = document.createElement('div');
      divClient.innerText = client;
      divClient.className = 'client-display';
      divClient.setAttribute('data-client', client); // Add a custom attribute to identify this client
      container.appendChild(divClient);

      // Create kick button
      kickButton = document.createElement('button');
      kickButton.textContent = 'Leave Room';

      if (!isClicked) {
        if (divClient.innerText == joinNameInput.value) {
          kickButton.className = 'leave-room-button';
          
          // Append kick button to the container (inside the same div as the client display)
          container.appendChild(kickButton);
        }

        kickButton.onclick = () => {
          let RoomId = data.roomId;

          if (isClicked) {
            ws.send(JSON.stringify({
              type: 'kickedHost',
              Id: divClient.innerText,
              roomID: RoomId
            }));
          }

          ws.send(JSON.stringify({
            type: 'kickClient',
            Id: divClient.innerText,
            roomID: RoomId
          }));

          location.reload();
        };
      }

      if (isClicked) {
        if (divClient.innerText != playerName.value) {
          kickButton.innerText = "kick";
          kickButton.className = 'kick-button';
          container.appendChild(kickButton);
        }

        if (kickButton.textContent != "kick") {
          kickButton.className = 'leave-room-button';
        }

        kickButton.onclick = () => {
          let RoomId = data.roomId;
          ws.send(JSON.stringify({
            type: 'kickClient',
            Id: divClient.innerText,
            roomID: RoomId
          }));
          kickButton.remove();
        };
      }

      // Append the container (which now holds both the client display and kick button) to the main client container
      clientContainer.appendChild(container);
    }
  });

  clientLst = data.lst;
  
  // Add system message for new joiners
  if (window.chatSystem && data.lst.length > 0) {
    const newClients = data.lst.filter(client => !clientLst.includes(client));
    if (newClients.length > 0) {
      newClients.forEach(client => {
        window.chatSystem.addSystemMessage(`${client} has joined the room.`);
      });
    }
  }
}





  if (data.type == "kickedHost") {


    if (playerName.value == data.removedClient) {
      location.reload();
    }

    if (data.removedClient == data.host) {
      const gameContent = document.querySelector('.game-content-area') || document.body;
      gameContent.appendChild(returnButton);
      
      if (window.chatSystem) {
        window.chatSystem.addSystemMessage("The host has left the room!");
      }
    }
  }

  if (data.type == "kick") {
    if (!isClicked) {

      if (joinNameInput.value == data.removedClient) {
        location.reload();
      }

      document.querySelectorAll('div').forEach(el => {
        if (el.textContent.trim() === data.removedClient) {
          const kickButton = el.nextElementSibling;
          if (kickButton && kickButton.tagName === 'BUTTON' && kickButton.textContent.toLowerCase().includes('Leave Room')) {
            kickButton.remove();
          }
          el.remove();
        }
      });

      if (data.removedClient == data.host) {
        const gameContent = document.querySelector('.game-content-area') || document.body;
        gameContent.appendChild(returnButton);
        
        if (window.chatSystem) {
          window.chatSystem.addSystemMessage("The host has left the room!");
        }
      }
    } else {


      if (playerName.value == data.removedClient) {
        location.reload();
      }

      document.querySelectorAll('div').forEach(el => {
        if (el.textContent.trim() === data.removedClient) {
          const kickButton = el.nextElementSibling;
          el.remove();
          if (kickButton) kickButton.remove();
        }
      });

      
      if (window.chatSystem) {
        window.chatSystem.addSystemMessage(`${data.removedClient} has been removed from the room.`);
      }
      
      // Update player list if needed
      if (window.chatSystem && clientLst) {
        const updatedList = clientLst.filter(client => client !== data.removedClient);
        window.chatSystem.updatePlayerList(updatedList);
      }
    }
  }

  if (data.type === 'client_id') {
    clientId = data.clientId;
  }

  if (data.type === "room") {
    for (let [key, values] of data.dataId) {
      if (!rooms.has(key)) {
        rooms.set(key, new Set(values)); // Initialize key if missing
      }

      values.forEach(value => rooms.get(key).add(value)); // Add values to the existing Set
    }
  }
}

if (joinRoom) {
  joinRoom.onclick = () => {

    let roomIdInput = document.getElementById('roomIdInput')

    if (rooms.has(roomIdInput.value)) {
      rooms.get(roomIdInput.value).add(playerName.value)
    };

    localStorage.setItem('playerName', joinNameInput.value);

    ws.send(JSON.stringify({
      type: 'addValue',  
      clientId: clientId,
      roomValue: roomIdInput.value, 
      playerValue: joinNameInput.value
    }))

      Array.from(document.body.children).forEach(function(el) {
      if (el.tagName !== 'HEADER') {
        el.remove();
      }
    });
  // Create game content area
    const gameContentArea = document.createElement('div');
    gameContentArea.className = 'game-content-area';
    document.body.appendChild(gameContentArea);

    ws.send(JSON.stringify({type: 'lst', id: clientId}))

    let roomIdDisplay = document.createElement("div");
    let roomID = document.createElement('h4')


roomID.textContent = `Room id - ${roomIdInput.value}`;
    roomId = roomIdInput.value; // Save the room ID globally

    roomID.className = "room-id-display"; // Add class for styling

    let containerdiv = document.createElement('div')
    containerdiv.id = 'copyContainer'
    let copyButton = document.createElement("button");
    copyButton.innerHTML = "Copy";
    copyButton.className = "copy-button"; // Add class for styling

    // Copy functionality
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(roomId).then(() => {
      }).catch(err => {
        alert("Failed to copy: " + err);
      });
    });

    roomID.appendChild(copyButton)
    roomIdDisplay.appendChild(roomID);
    roomIdDisplay.appendChild(containerdiv);
    gameContentArea.prepend(roomIdDisplay);

    // Initialize chat after joining room
    if (window.chatSystem) {
      window.chatSystem.initChatSystem();
      window.chatSystem.addSystemMessage(`Joined room "${roomId}"`);
    } else {
      // If chat system isn't loaded yet, create a script to load it
      const chatScript = document.createElement('script');
      chatScript.src = 'chat.js';
      document.body.appendChild(chatScript);
      
      chatScript.onload = function() {
        window.chatSystem.initChatSystem();
        window.chatSystem.addSystemMessage(`Joined room "${roomId}"`);
      };
    }
  }
}

function startGame() {
  // Get the game content area or create it if it doesn't exist
  let gameContentArea = document.querySelector('.game-content-area');
   const chatContainer = document.querySelector('.chat-container'); // Update the class if needed
  if (chatContainer) {
    chatContainer.remove();
  } else {
  }
    let clientContainer = document.querySelector('.client-container');
  
  // If the client container exists, clear its contents
  if (clientContainer) {
      clientContainer.remove()
  }

  // Other game start logic goes here (e.g., triggering the game state)

  // Your logic to start the game goes here...
  if (!gameContentArea) {
    gameContentArea = document.createElement('div');
    gameContentArea.className = 'game-content-area';
    document.body.appendChild(gameContentArea);
  } else {
    gameContentArea.innerHTML = ""; // Clear existing content
  }

  let messages = document.createElement('div')
  messages.id = "messages";

  let h3 = document.createElement('h3')
  h3.id = 'text_to_complete'
  const randomIndex = Math.floor(Math.random() * texts.easy.length);
  const selectedText = texts.easy[randomIndex];
  h3.textContent = selectedText;

  gameContentArea.appendChild(messages);
  gameContentArea.appendChild(h3)

  let text_to = document.getElementById('text_to_complete'); // Get the text to complete
  const container = document.getElementById("messages");

  // Create spans for each character in the text
  let newHTML = "";
  for (let n of text_to.textContent) {
    newHTML += `<span id="curr-${num}">${n}</span>`;
    num += 1;
  }

  num = 0; 
  text_to.innerHTML = newHTML;

  // Initialize chat for the game screen if needed

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // Handle chat messages
    if (data.type === 'chat_message') {
      if (window.chatSystem) {
        window.chatSystem.processIncomingChatMessage(data);
      }
    }

    let br = document.createElement("br");
    if (data.type === 'w') {

      cList = data.cList;
      for (let index = 0; index < data.num; index++) {
        const bar = document.createElement('div');
        bar.id = 'bar';

        // Creating the break element
        let br = document.createElement("br");

        // Creating the Cname span
        let Cname = document.createElement('span');
        Cname.textContent = data.cList[index];
        Cname.className = 'cname';  // Add class for styling

        // Creating the timeSpan span
        let timeSpan = document.createElement('span');
        timeSpan.textContent = '0  wpm'; // initially 0
        timeSpan.className = 'timeSpan';  // Add class for styling

        // Append the Cname and timeSpan to the bar container
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container'; // This will hold both elements

        barContainer.appendChild(Cname);
        barContainer.appendChild(timeSpan);

        container.appendChild(barContainer);

        // Append break line if not first index
        if (index > 0) {
          container.appendChild(br);
        }

        container.appendChild(bar);
      }

    }



if (data.type === 'client_states') {
  container.innerHTML = ""; // Clear existing bars
  cTimeElements = []; // Clear previous references

  let z = 0;

  data.states.forEach((state) => {
    const clientBar = document.createElement('div');
    const bar = document.createElement('div');
    bar.id = 'bar';

    clientBar.id = `client-${state.clientID}`;
    clientBar.className = 'client-bar';
    clientBar.style.width = `${(state.progress / text_to.textContent.length) * 100}%`;

    if (clientBar.style.width === '100%') {
      ws.send(JSON.stringify({
        type: 'completed',
        id_comp: state.clientID,
        len: state.progress,
        time: Math.floor(wpmMap[wpmMap.length - 1])
      }));
        isCompleted = true;
    }

    bar.appendChild(clientBar);

    let Cname = document.createElement('span');
    Cname.textContent = cList[z];
    wpmList.push(0);

    let cTime = document.createElement('span');
    cTime.id = 'cTime';
    cTime.textContent = `${wpmList[z] || 0} wpm`;

    cTimeElements.push({ element: cTime, index: z }); // Save reference

    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';
    textContainer.appendChild(Cname);
    textContainer.appendChild(cTime);

    container.appendChild(textContainer);
    container.appendChild(bar);

    z += 1;
  });
}

// Update cTime every second
// Inside the setInterval loop
// Inside the setInterval loop
// Add a map to store final WPM and ranks
const completedClientsInfo = new Map();

// Inside the 'completed' message handler
if (data.type === 'completed') {
    // Store final WPM and rank for completed client
    completedClientsInfo.set(data.id_comp, {
        wpm: data.time,
        rank: completedClients.size + 1 // Rank based on completion order
    });
    completedClients.add(data.id_comp);
}

// Modified interval loop
setInterval(() => {
    cTimeElements.forEach(({ element, index }) => {
        
        const clientId = cList[index];
        
        if (completedClients.has(clientId)) {
            // Use stored completion data if available
            const info = completedClientsInfo.get(clientId);
            element.textContent = `${info.wpm} wpm • Rank ${info.rank}`;
            return;
        }

        // Only update for active clients

        const currentWpm = wpmList[index] || 0;

        const currentRank = rank?.[index] || 0;

        element.textContent = `${currentWpm} wpm${currentRank ? ` • Rank ${currentRank}` : ''}`;
    });
}, 1000);




if (data.type == 'wpm') {
  wpmList = data.cList;
}

if (data.type == 'completed') {
  rank = data.rankList || [];

  let clientDiv = document.createElement('div');
  let y = document.createElement('span');
  let z = document.createElement('span');

  y.textContent = `${data.lst} `;
  z.textContent = `${data.tLst} wpm`;

  compvar++;

  if (window.chatSystem) {
    window.chatSystem.addSystemMessage(`${data.lst} completed with ${data.tLst} WPM!`);
  }
}





  }

  // Outside your ws.onmessage handler
  document.addEventListener('keydown', function(event) {
    // Check if the pressed key is the spacebar (keyCode 32)
    if (event.key === " " || event.code === "Space") {
      event.preventDefault(); // Prevent the default action (scrolling)
    }
  });

  const valid_key = [" ", ",", ".", ...Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")];
  let madeMistake = false;

  let curr = document.getElementById(`curr-${num}`);
  if (curr) curr.className = 'to_be_entered';

  document.addEventListener("keydown", function(event) {
    if (valid_key.includes(event.key)) {
      if (mistakeCount < 8) {
        let curr = document.getElementById(`curr-${num}`);
        if (!curr) return;

        if (!madeMistake && event.key === text_to.textContent[num]) {
          curr.className = 'highlight-green';
          num += 1;
          ws.send(JSON.stringify({ type: 'progress', progress: num }));
        } else {
          curr.className = 'highlight-red';
          madeMistake = true;
          mistakeCount += 1 
          num += 1;
        }

        let curr_ = document.getElementById(`curr-${num}`);
        if (curr_) {
          curr_.className = 'to_be_entered';
        }

        if (num === 1) {
          const timeset = setInterval(() => {
            currTime++;
          
            
            

            wpmMap.push((num - mistakeCount) * 12 / currTime)

let pname = '';

if (playerName && playerName.value.trim() !== '') {
  pname = playerName.value.trim();
} else if (joinNameInput && joinNameInput.value.trim() !== '') {
  pname = joinNameInput.value.trim();
}

            ws.send(JSON.stringify({ 
              type: 'client_time', 
              progress: Math.floor(wpmMap[wpmMap.length - 1]), 
                name:pname
            }));

            let x = num - mistakeCount
            if (x === h3.textContent.length) {
              

                const chartContainer = document.createElement('div');
chartContainer.className = 'chart-container';
              const canvas = document.createElement('canvas');
              canvas.id = "myChart";
              canvas.style.width = "100%";
              canvas.style.maxWidth = "700px";
chartContainer.appendChild(canvas);


gameContentArea.appendChild(chartContainer);

              // Assuming wpmMap is defined and populated with the data
              var xyValues = [];

              // Loop to populate xyValues with x and y pairs
              for (let i = 0; i < currTime; i++) {
                let xValue = i;
                let yValue = Math.floor(wpmMap[i+1]);  // assuming wpmMap has values for every i
                xyValues.push({x: xValue, y: yValue});
              }

              // Log xyValues to see the data

              // Create the chart
              new Chart("myChart", {
                type: "scatter",
                data: {
                  datasets: [{
                    label: "WPM over Time",
                    data: xyValues,
                    pointBackgroundColor: "rgb(0,0,255)",
                    pointRadius: 0,
                    pointBorderColor: "transparent",
                    pointBackgroundColor: "transparent",
                    borderColor: "rgb(0,0,255)",
                    fill: false,
                    borderWidth: 2,
                    lineTension: 0.1,
                    showLine: true,
                    pointRadius: 4,
                    pointBorderWidth: 2,
                  }]
                },
                options: {
                  plugins: {
                    legend: { display: false }
                  },
                  responsive: false,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      min: 0,
                      max: currTime - 1,
                      grid: {
                        display: false, // Remove x-axis grid lines
                      },
                      ticks: {
                        display: true
                      }
                    },
                    y: {
                      min: 0,
                      max: 140,
                      grid: {
                        display: false, // Remove y-axis grid lines
                      },
                      ticks: {
                        display: true
                      }
                    }
                  },
                  backgroundColor: "rgba(0,0,0,0)"
                }
              });
              
              let leave = document.createElement('button');
              leave.textContent = 'Leave Room';
              leave.className = 'leave-room-button';

              leave.onclick = () => {
                location.reload()
              }

              gameContentArea.appendChild(leave)
              
              if (window.chatSystem) {
                window.chatSystem.addSystemMessage("You've completed the typing challenge!");
              }
              
              clearInterval(timeset);
            }
          }, 1000);
        }
      }
    }

    if (event.key === 'Backspace') {
      // Check if all previous characters are green
      let hasMistake = false;
      for (let i = 0; i < num; i++) {
        let el = document.getElementById(`curr-${i}`);
        if (el && el.className === 'highlight-red') {
          hasMistake = true;
          break;
        }
      }

      // If everything is green, block backspace
      if (!hasMistake) {
        event.preventDefault(); // stop default backspace behavior
        return;
      }

      // Otherwise allow backspace
      num -= 1;
      mistakeCount -= 1
      if (num < 0) { num = 0; }

      let curr_ = document.getElementById(`curr-${num}`);
      if (curr_) {
        curr_.className = 'to_be_entered';
      }

      let next_curr = document.getElementById(`curr-${num + 1}`);
      if (next_curr) {
        next_curr.className = '';
      }

      // Recalculate mistake state
      madeMistake = false;
      for (let i = 0; i < num; i++) {
        let el = document.getElementById(`curr-${i}`);
        if (el && el.className === 'highlight-red') {
          madeMistake = true;
          break;
        }
      }
    }
  });
}

function updatePlayerList(players) {
  if (window.chatSystem) {
    window.chatSystem.updatePlayerList(players);
  }
}

// If there's a stored room, display players
let roomIdInput = document.getElementById("roomIdInput");
if (roomIdInput && roomIdInput.value) {
  let players = JSON.parse(localStorage.getItem(roomIdInput.value)) || [];
  updatePlayerList(players);
}

let userMail = ""; // Declare globally
let intervalId;    // Track interval for clearing

const getProtectedData = async () => {
  const token = localStorage.getItem("token");

  const signUpButton = document.getElementById("signUp");
  const logoutButton = document.getElementById("LogOut");

  if (token) {
    if (signUpButton) signUpButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "inline-block";

    try {
      const response = await fetch("https://racetyper.onrender.com/dashboard", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        userMail = data.user.email;
      } else {
        console.log("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.log("Error:", error);
    }

  } else {

      window.location.href = "../mainpage/main.html";

    if (logoutButton) logoutButton.style.display = "none";
    if (signUpButton) signUpButton.style.display = "inline-block";
  }
};

const logout = () => {
  localStorage.removeItem("token");
  clearInterval(intervalId); // Stop checking for token

  const logoutButton = document.getElementById("LogOut");
  const signUpButton = document.getElementById("signUp");

  if (logoutButton) logoutButton.style.display = "none";
  if (signUpButton) signUpButton.style.display = "inline-block";


  // Optional: redirect to login page
  // window.location.href = "./login.html";
};

// Add event listener to the Logout button
const logoutButton = document.getElementById("LogOut");
if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}

// Initial token check

getProtectedData()
// Start polling only if token is present
// c
if (localStorage.getItem("token")) {
  intervalId = setInterval(getProtectedData, 5000);
}
