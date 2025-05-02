// Chat system for SpeedType Master
let chatContainer = null;
let chatMessages = null;
let chatInput = null;
let isChatVisible = true;
let unreadCount = 0;

// Initialize chat UI
function initializeChat() {
  // Create chat container
  chatContainer = document.createElement('div');
  chatContainer.className = 'chat-container';
  chatContainer.innerHTML = `
    <div class="chat-header">
      <h3 class="chat-title">Room Chat</h3>
    </div>
    <div class="chat-messages"></div>
    <div class="chat-input-container">
      <input type="text" class="chat-input" placeholder="Type a message..." autocomplete="off">
      <button class="chat-send-btn" title="Send">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>
  `;
  document.body.appendChild(chatContainer);

  // Get references to chat elements
  chatMessages = chatContainer.querySelector('.chat-messages');
  chatInput = chatContainer.querySelector('.chat-input');
  const sendBtn = chatContainer.querySelector('.chat-send-btn');

  // Add event listeners
  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Add system message
  addSystemMessage('Welcome to the chat! You can communicate with other players in this room.');
  
  // Initialize player list
  initializePlayerList();
}

// Initialize player list UI
function initializePlayerList() {
  // Create player list container if it doesn't exist
  let playerListContainer = document.querySelector('.player-list');
  
  if (!playerListContainer) {
    playerListContainer = document.createElement('div');
    playerListContainer.className = 'player-list';
    
    // Add header to player list
    
    document.body.appendChild(playerListContainer);
  }
}

// Get current player name from localStorage or input fields
function getCurrentPlayerName() {
  // First try localStorage
  let playerName = localStorage.getItem('playerName');
  
  // If not in localStorage, try input fields
  if (!playerName) {
    const playerNameElement = document.getElementById('PlayerNameInput');
    const joinNameElement = document.getElementById('JoinPlayerNameInput');
    
    playerName = 
      (playerNameElement && playerNameElement.value) ||
      (joinNameElement && joinNameElement.value) ||
      'Anonymous';
  }
  
  return playerName;
}

// Send a message
function sendMessage() {
  const messageText = chatInput.value.trim();
  if (messageText === '') return;

  const senderName = getCurrentPlayerName();
  
  // Send the message to the WebSocket server
  ws.send(JSON.stringify({
    type: 'chat_message',
    sender: senderName,
    text: messageText,
    roomId: roomId
  }));

  // Clear the input field
  chatInput.value = '';
}

// Add a message to the chat
function addMessage(sender, text, isOwnMessage = false) {
  const messageEl = document.createElement('div');
  messageEl.className = isOwnMessage ? 'message own' : 'message other';

  const time = new Date();
  const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

  messageEl.innerHTML = `
    <div class="message-sender">${sender}</div>
    <div class="message-content">${text}</div>
    <div class="message-time">${timeStr}</div>
  `;

  chatMessages.appendChild(messageEl);
  scrollToBottom();
}

// Add a system message
function addSystemMessage(text) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message system';
  messageEl.textContent = text;
  chatMessages.appendChild(messageEl);
  scrollToBottom();
}

// Scroll chat to bottom
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process incoming chat message from WebSocket
function processIncomingChatMessage(data) {
  if (data.roomId === roomId) {
    const currentPlayerName = getCurrentPlayerName();
    const isOwnMessage = data.sender === currentPlayerName;
    
    addMessage(data.sender, data.text, isOwnMessage);
  }
}

// Update player list
function updatePlayerList(players) {
  const playerListContainer = document.querySelector('.player-list');
  if (!playerListContainer) return;
  
  // Clear existing elements after the header
  const header = playerListContainer.querySelector('.player-list-header');
  while (playerListContainer.firstChild && playerListContainer.firstChild !== header) {
    playerListContainer.removeChild(playerListContainer.firstChild);
  }
  
  // Add new player entries
  players.forEach(player => {
    if (!player) return; // Skip empty player names
    
    const initial = player.charAt(0).toUpperCase();
    
    
  });
}

// Initialize when entering a room
function initChatSystem() {
  initializeChat();
}

// Export functions for use in main.js
window.chatSystem = {
  initChatSystem,
  processIncomingChatMessage,
  addSystemMessage,
  updatePlayerList
};
