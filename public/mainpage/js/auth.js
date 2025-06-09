let userMail = ""; // Declare globally
let intervalId;    // Track interval for clearing

  const signUpButton = document.getElementById("SignUp");
  const logoutButton = document.getElementById("LogOut");
const token = localStorage.getItem("token");

if (token) {
  if (logoutButton) logoutButton.style.display = "inline-block";
} else {
  if (signUpButton) signUpButton.style.display = "inline-block";
}
const getProtectedData = async () => {
  const token = localStorage.getItem("token");

  const signUpButton = document.getElementById("SignUp");
  const logoutButton = document.getElementById("LogOut");

  if (token) {
    if (signUpButton) signUpButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "inline-block";

        try {
            const response = await fetch("https://typeracer-7s2h.onrender.com/dashboard", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                userMail = data.user.email;
            } else {
            }
        } catch (error) {
        }
    } else {
        // Hide the Logout button if no token exists

        if (logoutButton) {
            logoutButton.style.display = "none";
        }

        // Show the Sign Up button if no token exists
        if (signUpButton) {
            signUpButton.style.display = "inline-block";
        }
    }
};

// Logout functionality
const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Hide the Logout button and show the Sign Up button
    const logoutButton = document.getElementById("LogOut");
    const signUpButton = document.getElementById("signUp");

    if (logoutButton) {
        logoutButton.style.display = "none"; // Hide the Logout button
    }

    if (signUpButton) {
        signUpButton.style.display = "inline-block"; // Show the Sign Up button
    }

};

// Add event listener to the Logout button
if (logoutButton) {
    logoutButton.addEventListener("click", logout);
}

// Call the function to check the token and data when the page loads
getProtectedData();

// Continuously check for the token every 5 seconds (5000ms)









setInterval(getProtectedData, 50);
