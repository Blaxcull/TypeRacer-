const websocket = require('ws');

const express = require("express");
const multer = require("multer");

const bcrypt  = require('bcryptjs')

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authenticateToken = require("./middleware/auth");

dotenv.config();

const cors = require("cors");
const nodemailer = require("nodemailer");

const mysql = require("mysql2");
const http = require('http');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON body parsing

const server = http.createServer(app);

const wss = new websocket.Server({server});



app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));




const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    flags: ['+MAX_ALLOWED_PACKET']
});
connection.connect(() => {
    console.log("Connected to MySQL");
});



const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});
let otp;
async function sendEmail(to, subject) {
    let  code = Math.floor(100000 + Math.random() * 900000);
    otp = code
console.log(code);

    try {
        const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM, // Loaded from .env
            to,       // Recipient email
            subject,  // Email subject
            html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <style>
      html,
      body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
      }
      * {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
      }
      div[style*="margin: 16px 0"] {
          margin: 0 !important;
      }
      table,
      td {
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
      }
      table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
      }
      table table table {
          table-layout: auto;
      }
      *[x-apple-data-detectors],  /* iOS */
      .x-gmail-data-detectors,    /* Gmail */
      .x-gmail-data-detectors *,
      .aBn {
          border-bottom: 0 !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
      }
      /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
          .email-container {
              min-width: 320px !important;
          }
      }
      /* iPhone 6, 6S, 7, 8, and X */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
          .email-container {
              min-width: 375px !important;
          }
      }
      /* iPhone 6+, 7+, and 8+ */
      @media only screen and (min-device-width: 414px) {
          .email-container {
              min-width: 414px !important;
          }
      }
      /* Media Queries */
      @media screen and (max-width: 600px) {
          .email-container {
              padding-top: 0 !important;
          }

          #emailBodyContainer {
              border: 0 !important;
              border-bottom: 1px solid #DDD !important;
          }

          body,
          center {
              background: #FFF !important;
          }

          #logoContainer td {
              padding: 20px 0 20px 0 !important;
          }

          #footer {
              background: #F9F9F9 !important;
          }
      }
  </style>
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
</head>
<body width="100%" style="margin: 0; mso-line-height-rule: exactly; background-color: #F0F2F3;">
<!--[if mso | IE]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F9F9F9">
  <tr>
    <td>
<![endif]-->
<div style="margin: auto; max-width: 600px; padding-top: 50px;" class="email-container">
  <!--[if mso]>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
    <tr>
      <td>
  <![endif]-->
  <!-- Email Header : BEGIN -->
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center" id="logoContainer" style="background: #252F3D; border-radius: 3px 3px 0 0; max-width: 600px;">
    <tr>
      <td style="background: #252F3D; border-radius: 3px 3px 0 0; padding: 20px 0 10px 0; text-align: center;">
      </td>
    </tr>
  </table>
  <!-- Email Header : END -->
  <!-- Email Body : BEGIN -->
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center" id="emailBodyContainer" style="border: 0px; border-bottom: 1px solid #D6D6D6; max-width: 600px;">
      <tr>
        <td class="module" style="background-color: #FFF; color: #444; font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 14px; line-height: 140%; padding: 25px 35px;">
          <h1 style="font-size: 20px; font-weight: bold; line-height: 1.3; margin: 0 0 15px 0;">Verify your identity</h1>
          <p style="margin: 0 0 15px 0; padding: 0 0 0 0;">Here is your login verification code:
</p>
        </td>
      </tr>
  <tr>
    <td class="module module-otp" style="background-color: #FFF; color: #444; font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 14px; line-height: 140%; padding: 25px 35px; padding-top: 0; text-align: center;">
      <div class="label" style="font-weight: bold; padding-bottom: 15px;">Verification code</div>
      <div class="code" style="color: #000; font-size: 36px; font-weight: bold; padding-bottom: 15px;">${code}</div>
      <div class="description" style="color: #444; font-size: 10px;">(This code will expire 10 minutes after it was sent.)</div>
    </td>
  </tr>
<tr>
  <td class="module" style="background-color: #FFF; color: #444; font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 14px; line-height: 140%; padding: 25px 35px;">
    <p style="margin: 0 0 15px 0; padding: 0 0 0 0;">Please make sure you never share this code with anyone.</p>
    <p style="margin: 0 0 15px 0; padding: 0 0 0 0;"><strong >Note:</strong> The code will expire in 10 minutes.</p>
  </td>
</tr>
  <tr>
    <td class="module module-dark" style="background-color: #FFF; border-top: 1px solid #E0E0E0; color: #777; font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 14px; line-height: 140%; padding: 25px 35px;">
        <p style="margin: 0 0 15px 0; padding: 0 0 0 0;">If you have any questions, concerns, or require assistance, please do not hesitate to contact support site </p>
  </tr>
  </table>
  <!-- Email Body : END -->
  <!-- Email Footer : BEGIN -->
  <table role="presentation" cellSpacing="0" cellPadding="0" width="100%" align="center" id="footer" style="max-width: 600px;">
    <tr>
        <td style="color: #777; font-family: 'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; font-size: 12px; line-height: 16px; padding: 20px 30px; text-align: center;">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
        </td>
    </tr>
  </table>
  <!-- Email Footer : END -->
  <!--[if mso]>
  </td>
  </tr>
  </table>
  <![endif]-->
</div>
<!--[if mso | IE]>
</td>
</tr>
</table>
<![endif]-->
</body>
</html>

  `
        });

        console.log("Email sent successfully!", info);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}


app.post("/", (req, res) => {

    const { name, email, password } = req.body;
    console.log("Received Data:", req.body);  // Log request data
    console.log("Extracted Values:", name, email, password);

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const checkEmail = "SELECT * FROM users WHERE email = ?";
    const checkName= "SELECT * FROM users WHERE name = ?";


connection.query(checkName, [name], (err, result) => {
    if (err) {
        console.log("Database error");
        return res.status(500).json({ error: "user error" });
    }

    if (result.length > 0 ) {
        console.log('user already exist')
        return res.json({ status: "user already exist" });
    }


connection.query(checkEmail, [email], (err, result) => {
    if (err) {
        console.log("Database error");
        return res.status(500).json({ error: "email error" });
    }

    if (result.length > 0 ) {
        console.log('email already exist')
        return res.json({ status: "email already exist" });
    }


    sendEmail(email, "Your login verification code");
    return res.json({ status: "success", otp_txt: otp });

})

});
})


app.post("/verify-otp", async(req, res) => {
    console.log("hello post")
    const { name, email, password } = req.body;
const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
connection.query(sql, [name,email, hashedPassword], (err, result) => {
    if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Database error" });
    }

    const payload = {
        name,      
        email, 
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated Token:', token);

    return res.json({ status: 'Login successful', token });
});
  

});


app.post('/changePass',async(req,res)=>{

    const{email_text,password} = req.body;

const checkEmail = "SELECT * FROM users WHERE email = ?";
const updatePassword = "UPDATE users SET password = ? WHERE email = ?";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

connection.query(checkEmail, [email_text], (err, result) => {
    if (err) {
        console.log("Database error");
        return res.status(500).json({ error: "Database error" });
    }

    if (!result || result.length === 0) {
        return res.json({ status: "Email not found" });
    }

    connection.query(updatePassword, [hashedPassword, email_text], (err, updateResult) => {
        if (err) {
            console.log("Error updating password");
            return res.status(500).json({ error: "Failed to update password" });
        }

        return res.json({ status: "Password updated successfully" });
    });
});



})

app.post('/forgetpass',(req,res)=>{

    const{email_value} = req.body;
    
    
    const checkemail = "SELECT * FROM users WHERE email = ?";


connection.query(checkemail, [email_value], (err, result) => {
    if (err) {
        return res.status(500).json({ error: "Database error" });
    }
    else if(!result||result.length === 0 ){
        console.log('email do not exist')
            return res.json({ status: "Email not found" }); 
    }

    console.log('email exist')
sendEmail(email_value, "Your login verification code");
    return res.json({status: 'forgetPass', otp_text: otp})

})
})






app.post("/login", (req, res) => {
    const { email_value, password_value } = req.body;
    const checkemail = "SELECT * FROM users WHERE email = ?";
if (!email_value || !password_value) {
        return res.status(400).json({ error: "Email and password are required" });
    }
connection.query(checkemail, [email_value], (err, result) => {
    if (err) {
        return res.status(500).json({ error: "Database error" });
    }
    else if(!result||result.length === 0 ){
        console.log('email do not exist')
            return res.json({ status: "Email not found" }); 
    }


    let user = result[0];

    if(!bcrypt.compare(password_value, user.password)){

        console.log('incorrect password')
        return res.json({ status: "Incorrect password" });

    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET);
 const payload = {
  name: user.name,      
  email: user.email, 
};
console.log('User:', user);
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('Generated Token:', token);

res.json({ status: 'Login successful', token });




})
})

app.get("/dashboard", authenticateToken, (req, res) => {
    
    res.json({ message: "Access granted!", user: req.user });
});












const roomCompletionRanks = new Map(); // roomId => array of client IDs in completion order

let pList;
let count = 0;

let host;
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
console.log("WebSocket server running " );
