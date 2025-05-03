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

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON body parsing



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





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
