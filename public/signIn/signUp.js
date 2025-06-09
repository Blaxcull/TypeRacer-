


let name;
let email;
let password;





let errorTxt = document.getElementById('error')


document.getElementById("email").addEventListener("blur", function () {
    const email = this.value;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sendButton = document.getElementById("sendButton");

    if (!regex.test(email)) {
        this.style.border = "2px solid red";
        sendButton.disabled = true;
        errorTxt.textContent= "Enter a valid email";
    } else {
        this.style.border = "2px solid green";
        sendButton.disabled = false;
        errorTxt.textContent = "";
    }
});
document.getElementById("password").addEventListener("blur", function () {
    const password = this.value;
const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#]).{8,20}$/;
    if (!regex.test(password)) {
        this.style.border = "2px solid red";
document.getElementById("sendButton").disabled = true

        errorTxt.textContent = 'Make a Strong Password'
    } else {

        

document.getElementById("sendButton").disabled =false 
        this.style.border = "2px solid green";
        errorTxt.textContent = ''
    }
});

document.getElementById("sendButton").addEventListener("click", async () => {
 const sendButton = document.getElementById("sendButton");




    name = document.getElementById("name").value;
    email= document.getElementById("email").value;
    password = document.getElementById("password").value;


    const response = await fetch("https://typeracer-7s2h.onrender.com/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email ,password})
    });

    const data = await response.json();


    if (data.status === 'user already exist'){

   document.getElementById('name').style.border = "2px solid red";

    errorTxt.textContent = 'Username already exist'

        console.log('user already exist')
    }

        else if (data.status === 'email already exist'){

    errorTxt.textContent = 'email already exist'

   document.getElementById('email').style.border = "2px solid red";

   document.getElementById('name').style.border = "2px solid green";
        console.log('email already exist')
    }


else if(name == ''){
   document.getElementById('name').style.border = "2px solid red";

   document.getElementById('email').style.border = "2px solid red";
   document.getElementById('password').style.border = "2px solid red";
}
else if(email== ''){

   document.getElementById('name').style.border = "2px solid green";

   document.getElementById('email').style.border = "2px solid red";
   document.getElementById('password').style.border = "2px solid red";

}
else if(password== ''){


   document.getElementById('name').style.border = "2px solid green";

   document.getElementById('email').style.border = "2px solid green";
   document.getElementById('password').style.border = "2px solid red";
}



else{
    console.log("otp made")
   document.getElementById('name').style.border = "2px solid green";

   document.getElementById('email').style.border = "2px solid green";
   document.getElementById('password').style.border = "2px solid green";
document.body.innerHTML = ''

const container = document.createElement("div");
container.classList.add("container");
document.body.appendChild(container);

let heading= document.createElement('h1')
    heading.textContent = 'Verify Otp'
let errorTxt = document.createElement('div')
    errorTxt.id = 'error'
let otp = document.createElement('input')
    otp.id = 'otp'

     let verify = document.createElement('button')
    verify.textContent = 'VERIFY'
    verify.id = 'verify'

    console.log(data.otp_txt)
    container.appendChild(heading)
    container.appendChild(otp)
    container.appendChild(verify)
    container.appendChild(errorTxt)



    verify.onclick =async()=>{
  console.log(otp.value); 
        console.log(data.otp_txt)
        console.log(name)
        console.log(email)
        

        if (parseInt(otp.value, 10)== parseInt(data.otp_txt, 10)){
            let verify = "status"
            const verifyResponse = await fetch("https://typeracer-7s2h.onrender.com/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({verify, name, email, password})
            });

            console.log("logged IN")
    const data = await verifyResponse.json();

            console.log(data.status)
            localStorage.setItem("token", data.token);
            console.log(data.token)

window.location.href = '../mainpage/main.html';

        }
        else{

            errorTxt.textContent ="Invalid OTP" 

        }
    }
}

});












