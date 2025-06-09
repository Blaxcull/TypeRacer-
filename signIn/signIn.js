// Apply CSS class to created elements
const applyStyles = (element, className) => {
    element.classList.add(className);
};

document.body.classList.add("body");


const title = document.createElement("h1");
title.innerText = "Sign In";
applyStyles(title, "title");

const email = document.createElement("input");
email.placeholder = "Email";
applyStyles(email, "input");

const password = document.createElement("input");
password.placeholder = "Password";
password.type = "password";
applyStyles(password, "input");

const errorTxt = document.createElement('div')
errorTxt.id = 'error'
const codeError= document.createElement('div')
codeError.id = 'codeError'


const big = document.createElement("div")
big.id = 'bigContainer'
document.body.appendChild(big)


const forgotPass = document.createElement("a");
forgotPass.textContent = "Forgot password?";
forgotPass.classList.add("forgot-pass");

const login = document.createElement("button");
login.innerText = "Login";
applyStyles(login, "button");

const signUp = document.createElement("a");
signUp.textContent = "Sign up Now";
signUp.href = "signUp.html";
signUp.classList.add("forgot-pass");


big.appendChild(title)


const container = document.createElement("div");
container.classList.add("container");
big.appendChild(container)



container.appendChild(email);
container.appendChild(password);
container.appendChild(errorTxt);
container.appendChild(forgotPass);
container.appendChild(login);
container.appendChild(signUp);

forgotPass.onclick = () => {
    container.innerHTML = "";
    big.innerHTML = ''

    const title = document.createElement("h1");
    title.innerText = "Forgot Password";
    applyStyles(title, "title");

    const email = document.createElement("input");
    email.placeholder = "Enter your email";
    applyStyles(email, "input");

    const getCode = document.createElement("button");
    getCode.innerText = "Get OTP";
    applyStyles(getCode, "button");

    big.appendChild(title);
    big.appendChild(container)
    container.appendChild(email);
    container.appendChild(getCode);
container.appendChild(codeError);

    getCode.onclick = async () => {
        let email_value = email.value;
        console.log(email_value);

        const response = await fetch("http://localhost:3000/forgetpass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email_value }),
        });

        const data = await response.json();
        console.log(data.status);
        if(data.status == 'Email not found'){

            codeError.textContent = 'Email do not exist'

        }
        else{




        if (data.status == "forgetPass") {
            container.innerHTML = "";
            big.innerHTML = ''

const codeError= document.createElement('div')
codeError.id = 'codeError'
            const title = document.createElement("h1");
            title.innerText = "Enter OTP";
            applyStyles(title, "title");

            const otp = document.createElement("input");
            otp.placeholder = "Enter OTP";
            applyStyles(otp, "input");

            const verify = document.createElement("button");
            verify.innerText = "Verify";
            applyStyles(verify, "button");

            big.appendChild(title);
            big.appendChild(container);
            container.appendChild(otp);
            container.appendChild(verify);

            verify.onclick = () => {
                console.log("Verifying OTP");
                container.appendChild(codeError)

                if (parseInt(otp.value, 10) === parseInt(data.otp_text, 10)) {
                    console.log("Correct OTP");

                    container.innerHTML = "";
                    big.innerHTML = ''

                    const title = document.createElement("h1");
                    title.innerText = "Reset Password";
                    applyStyles(title, "title");

                    const pass = document.createElement("input");
                    pass.placeholder = "New Password";
                    pass.type = "password";
                    applyStyles(pass, "input");



                    const c_pass = document.createElement("input");
                    c_pass.placeholder = "Confirm Password";
                    c_pass.type = "password";
                    applyStyles(c_pass, "input");

                    const confirm = document.createElement("button");
                    confirm.innerText = "Confirm";
                    applyStyles(confirm, "button");

                    big.appendChild(title);
                    big.appendChild(container);
                    container.appendChild(pass);
                    container.appendChild(c_pass);
                    container.appendChild(confirm);

pass.addEventListener("blur", function () {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#]).{8,20}$/;

                container.appendChild(codeError)

    if (codeError) {  // Ensure element exists before using it
        if (!regex.test(pass.value)) {
            this.style.border = "2px solid red";
confirm.disabled = true;
            codeError.textContent = "Make a Strong Password";
        } else {
            this.style.border = "2px solid green";
      confirm.disabled = false;
            codeError.textContent = "";
        }
    }
});
                    confirm.onclick = async () => {
                container.appendChild(codeError)
                        if (pass.value === c_pass.value) {
                            console.log("Passwords match");
                            let password = pass.value;
                            let email_text = email.value;

                            await fetch("http://localhost:3000/changePass", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email_text, password }),
                            });

                            window.location.href = 'signIn.html'
                        } else {
                            codeError.textContent = 'password do not match'
                        }
                    
                    };
                } else {
                            codeError.textContent= 'Incorrect OTP'
                    console.log('sakjd')
                }
            };
        }
    };
    }
};

login.onclick = async () => {
    let email_value = email.value;
    let password_value = password.value;

    console.log(email_value);

    if (email_value== '' ){

errorTxt.textContent = 'Email is not defined'

    }


        else if(password_value == ''){

errorTxt.textContent = 'Password is not defined'
        console.log('sdanj')
}
else{


    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_value, password_value }),
    });

    const data = await response.json();





        if (data.status === 'Email not found'){

            errorTxt.textContent = 'email do not exist' 

        console.log('email do not exist')
    }
        else if (data.status === 'Incorrect password'){

            errorTxt.textContent = 'Incorrect password' 

        console.log('incorrect password')
    }

    else{
    localStorage.setItem("token", data.token);
    console.log(data.token);

    window.location.href = "../mainpage/main.html";
    }
}
};

