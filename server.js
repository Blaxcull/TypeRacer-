const websocket = require('ws');
const roomCompletionRanks = new Map(); // roomId => array of client IDs in completion order

let pList;
let count = 0;

let host;
const wss = new websocket.Server({ port: 6967 });

const playerMap = new Map()
const timeMap = new Map()
const rooms = new Map();
const ctime= new Map();

let complst = []
let timelst = []

let clients = new Map(); // Use a Map to track clients and their progress

// Add new map to store chat messages for each room
const roomMessages = new Map();

wss.on('connection', (ws) => {
  // Assign a unique ID to the client
  ws._id = Math.random().toString(36).substring(7); // Random ID
  clients.set(ws._id, { progress: 0 }); // Initialize progress for this client
  console.log(`Client ${ws._id} connected`);

  let clientId = ws._id
  ws.send(JSON.stringify({ type: 'client_id',  clientId}));

  ws.send(JSON.stringify({
      type: 'room',
      dataId: Array.from(rooms.entries()).map(([key, values]) => [key, Array.from(values)])
  }));

  // Send the current state of all clients to the newly connected client
  sendClientStates(ws);

  ws.on('close', () => {
      console.log(`Client ${ws._id} disconnected`);
      clients.delete(ws._id); // Remove the client from the Map

      rooms.forEach((clientSet, roomKey) => {
          if(clientSet.has(ws._id)){
              console.log(clientSet)
              clientSet.delete(ws._id)
              const value = playerMap.get(ws._id);

              clientSet.forEach(clientId => {
                  const targetClient = [...wss.clients].find(client => client._id === clientId);
                  if (targetClient) {
                      targetClient.send(JSON.stringify({
                          type: "kick",
                          removedClient: value,
                          host: host
                      }));
                  }
              });
          }
      });

      broadcastClientStates(); // Broadcast the updated state to all clients
  });

  // Broadcast the updated state to all clients
  broadcastClientStates();

  ws.on('message', (message) => {
      const data = JSON.parse(message);

      // Handle chat messages
      if (data.type === 'chat_message') {
          // Store the message in the room's message history
          if (!roomMessages.has(data.roomId)) {
              roomMessages.set(data.roomId, []);
          }
          
          const chatMessage = {
              type: 'chat_message',
              sender: data.sender,
              text: data.text,
              roomId: data.roomId,
              timestamp: new Date().toISOString()
          };
          
          roomMessages.get(data.roomId).push(chatMessage);
          
          // Broadcast chat message to all clients in the room
          broadcastChatMessage(data.roomId, chatMessage);
          return;
      }

      if (data.type === 'clientTime'){
          console.log(ws._id)
          console.log(`time->${data.time}`)
          timeMap.set(ws._id,data.time)
          console.log(timeMap)
      }

      if (data.type === 'new_room') {
          console.log(data);
          for (let [key, value] of data.room) {
              if (!rooms.has(key)) {
                  rooms.set(key, new Set());
                  rooms.get(key).add(ws._id);

                  playerMap.set(ws._id,data.playerValue)
                  host = data.playerValue
                  
                  // Initialize empty message array for the new room
                  roomMessages.set(key, []);
              }
          }
          console.log(rooms);
      }

      if (data.type === 'addValue') {
          const targetClient = [...wss.clients].find(client => client._id === data.clientId);
          console.log("Sending message to:", targetClient?._id);
          console.log(data.clientId);

          if (targetClient && targetClient.readyState === websocket.OPEN) {
              if (rooms.has(data.roomValue)) {
                  console.log(targetClient._id);
                  rooms.get(data.roomValue).add(targetClient._id);

                  playerMap.set(targetClient._id,data.playerValue)

                  console.log(playerMap)
                  targetClient.send(JSON.stringify({
                      type: 'room',
                      dataId: Array.from(rooms.entries()).map(([key, values]) => [key, Array.from(values)])
                  }));
                  console.log(rooms);
                  
                  // Send system message to room about new user
                  const joinMessage = {
                      type: 'chat_message',
                      sender: 'System',
                      text: `${data.playerValue} has joined the room.`,
                      roomId: data.roomValue
                  };
                  broadcastChatMessage(data.roomValue, joinMessage);
                  
              } else {
                  console.log('cant say');
              }
          }
      }

      if (data.type === 'progress') {
          clients.set(ws._id, { progress: data.progress });
          console.log(data);
          broadcastClientStates(data.tList);
      }

      if(data.type == 'lst'){
          let foundKey = null;
          rooms.forEach((clientIds, roomId) => {
              if (clientIds.has(data.id)) {
                  console.log(data.id)
                  foundKey = roomId;
                  console.log(foundKey);
                  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXX");
              }

              if(foundKey){
                  let vals = rooms.get(foundKey);
                  console.log(vals)

                  let clientLst = [] ;
                  vals.forEach(val => {
                      clientLst.push(playerMap.get(val));
                  });
                  
                  vals.forEach(clien=> {
                      const targetClient = [...wss.clients].find(client => client._id === clien);
                      console.log(targetClient._id)

                      targetClient.send(JSON.stringify({
                          type: 'lst',
                          lst: clientLst,
                          roomId: foundKey
                      }))

                      console.log(targetClient._id)
                  });
              }
          });
      }

      if(data.type == 'kickedHost'){
          console.log('hello')
          console.log(playerMap)
          console.log(data.roomID)

          let allMembers;
          if(rooms.has(data.roomID)){
              allMembers = rooms.get(data.roomID)

              allMembers.forEach(clien=> {
                  console.log("")
                  console.log("")
                  console.log("")
                  console.log("")
                  console.log("")

                  const targetClient = [...wss.clients].find(client => client._id === clien);

                  targetClient.send(JSON.stringify({
                      type: "kickedHost",
                      host: host,
                      removedClient:data.Id 
                  }))

                  console.log(targetClient._id)
              });
              
              console.log(allMembers)
              for (let [key, value] of playerMap.entries()) {
                  console.log(playerMap)
                  console.log(value)

                  console.log(data.Id)
                  if (value == data.Id) {
                      rooms.get(data.roomID).delete(key)
                  }
              }
              
              // Send system message about host leaving
              if (data.Id === host) {
                  const hostLeftMessage = {
                      type: 'chat_message',
                      sender: 'System',
                      text: `The host has left the room.`,
                      roomId: data.roomID
                  };
                  broadcastChatMessage(data.roomID, hostLeftMessage);
              }
          } 
      }

      if(data.type == 'kickClient'){
          console.log('hello')
          console.log(playerMap)
          console.log(data.roomID)

          let allMembers;
          if(rooms.has(data.roomID)){
              allMembers = rooms.get(data.roomID)

              allMembers.forEach(clien=> {
                  console.log("")
                  console.log("")
                  console.log("")
                  console.log("")
                  console.log("")

                  const targetClient = [...wss.clients].find(client => client._id === clien);

                  targetClient.send(JSON.stringify({
                      type: "kick",
                      host: host,
                      removedClient:data.Id 
                  }))

                  console.log(targetClient._id)
              });
              
              console.log(allMembers)
              for (let [key, value] of playerMap.entries()) {
                  console.log(playerMap)
                  console.log(value)

                  console.log(data.Id)
                  if (value == data.Id) {
                      rooms.get(data.roomID).delete(key)
                  }
              }
              
              // Send system message about user being kicked
              const kickMessage = {
                  type: 'chat_message',
                  sender: 'System',
                  text: `${data.Id} has been removed from the room.`,
                  roomId: data.roomID
              };
              broadcastChatMessage(data.roomID, kickMessage);
          } 
      }

      if(data.type == 'startAll'){
          let foundKey = null;
          rooms.forEach((clientIds, roomId) => {
              console.log(data.id)

              if (clientIds.has(data.id)) {
                  foundKey = roomId;
                  console.log(foundKey);
                  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXX");

                  if(foundKey){
                      let vals = rooms.get(foundKey);
                      console.log(vals.size)
                      
                      pList = []

                      vals.forEach(val=> {
                          let x = playerMap.get(val)
                          pList.push(x);
                      });

                      vals.forEach(clien=> {
                          const targetClient = [...wss.clients].find(client => client._id === clien);
                          console.log(targetClient._id)

                          targetClient.send(JSON.stringify({
                              type: 'start',
                              text: 'this is starting',
                          }))

                          targetClient.send(JSON.stringify({
                              type: 'w',
                              cList : pList,
                              num: vals.size
                          }))

                          console.log(targetClient._id)
                          console.log('this is starting')
                      });
                      
                      // Send system message about game starting
                      const startMessage = {
                          type: 'chat_message',
                          sender: 'System',
                          text: `Game is starting! Good luck everyone!`,
                          roomId: foundKey
                      };
                      broadcastChatMessage(foundKey, startMessage);
                  }
              }
          });
      }

      if(data.type == 'client_time'){
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          console.log(data.name)

          for (let [key, value] of playerMap.entries()) {
              if (value == data.name) {
                  ctime.set(key ,data.progress)
                  console.log(ctime)

                  let foundkey = null;
                  let timeList = []

                  rooms.forEach((clientIds, roomId) => {
                      if (clientIds.has(key)) {
                          foundkey = roomId;
                          console.log(foundkey);
                          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxx");

                          if (foundkey) {
                              let vals = rooms.get(foundkey);
                              console.log(vals)

                              vals.forEach(val=> {
                                  let x = ctime.get(val)
                                  timeList.push(x)
                              });
                              
                              console.log(timeList)

                              vals.forEach(clien=> {
                                  const targetClient = [...wss.clients].find(client => client._id === clien);
                                  console.log(targetClient._id)

                                  targetClient.send(JSON.stringify({
                                      type: 'wpm',
                                      cList:timeList ,
                                  }))
                              })
                          }
                      }
                  });

                  console.log(ctime)
              }
          }
      }

if (data.type == 'completed' && clients.get(ws._id).progress == data.len) {
    clients.set(ws._id, { progress: data.len + 1 });

    const targetClient = [...wss.clients].find(client => client._id === data.id_comp);
    if (targetClient && targetClient.readyState === websocket.OPEN) {
        console.log("Sending message to:", targetClient._id);
        count++;
        console.log(`completed${count}st`);
        let playerName = playerMap.get(targetClient._id);
        let wpm = timeMap.get(targetClient._id);
        console.log(timeMap);
        console.log(playerMap);
        console.log(`time of target client -> ${targetClient._id}`);
        console.log(`wpm -> ${wpm}`);
        complst.push(playerName);
        timelst.push(data.time);
    }

    let foundKey = null;
    rooms.forEach((clientIds, roomId) => {
        if (clientIds.has(data.id_comp)) {
            foundKey = roomId;
        }

        if (foundKey) {
            // Track completion order
            if (!roomCompletionRanks.has(foundKey)) {
                roomCompletionRanks.set(foundKey, []);
            }
            const ranks = roomCompletionRanks.get(foundKey);
            if (!ranks.includes(data.id_comp)) {
                ranks.push(data.id_comp); // Mark this client's completion
            }

            const clientRank = ranks.indexOf(data.id_comp) + 1; // 1-based rank

            // Build ordered rank list based on playerMap
            const rankList = [];
            for (const [id, name] of playerMap.entries()) {
                if (rooms.get(foundKey)?.has(id)) {
                    const rankIndex = ranks.indexOf(id);
                    rankList.push(rankIndex === -1 ? 0 : rankIndex + 1);
                }
            }

            // Send to everyone in the room
            let vals = rooms.get(foundKey);
            vals.forEach(clien => {
                const targetClient = [...wss.clients].find(client => client._id === clien);
                if (targetClient && targetClient.readyState === websocket.OPEN) {
                    targetClient.send(JSON.stringify({
                        type: 'completed',
                        lst: complst,
                        tLst: timelst,
                        rank: clien === data.id_comp ? clientRank : null,
                        rankList: rankList
                    }));
                }
            });

            // Send system message about the completion
            if (complst.length > 0 && timelst.length > 0) {
                const completionMessage = {
                    type: 'chat_message',
                    sender: 'System',
                    text: `${complst[complst.length - 1]} completed with ${timelst[timelst.length - 1]} WPM!`,
                    roomId: foundKey
                };
                broadcastChatMessage(foundKey, completionMessage);
            }

            // Clear temporary lists
            complst = [];
            timelst = [];
        }
    });
}




  }); 
});

// Function to broadcast chat messages to all clients in a room
function broadcastChatMessage(roomId, message) {
  if (!rooms.has(roomId)) return;

  const roomClients = rooms.get(roomId);
  roomClients.forEach(clientId => {
      const targetClient = [...wss.clients].find(client => client._id === clientId);
      if (targetClient && targetClient.readyState === websocket.OPEN) {
          targetClient.send(JSON.stringify(message));
      }
  });
}

// Function to send the current state of all clients to a specific client
function sendClientStates(ws) {
  const clientStates = Array.from(clients.entries()).map(([clientID, state]) => ({
    clientID,
    progress: state.progress
  }));
  ws.send(JSON.stringify({
    type: 'client_states',
    id: ws._id,
    states: clientStates
  }));
}

// Function to broadcast the current state of all clients to all connected clients
function broadcastClientStates(time) {
  rooms.forEach((clientIds, roomId) => {
    const clientStates = Array.from(clientIds).map(clientId => {
      const state = clients.get(clientId);
      return {
        clientID: clientId,
        progress: state ? state.progress : 0
      };
    });

    clientIds.forEach(clientId => {
        const targetClient = [...wss.clients].find(client => client._id === clientId);
        if (targetClient && targetClient.readyState === websocket.OPEN) {
            targetClient.send(JSON.stringify({
                type: 'client_states',
                time: time,
                id: playerMap.get(targetClient._id),
                states: clientStates
            }));
        }
    });
  });
}

console.log("WebSocket server running on ws://localhost:6967");
