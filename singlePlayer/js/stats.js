class Stats {
  constructor() {
    this.wpmDisplay = document.getElementById('wpm');
    this.accuracyDisplay = document.getElementById('accuracy');
  }

  update(wpm, accuracy) {
    this.wpmDisplay.textContent = Math.round(wpm);
    this.accuracyDisplay.textContent = `${Math.round(accuracy)}%`;
  }

  calculateWPM(charCount, seconds) {
    const minutes = seconds / 60;
    const words = charCount / 5;
    return words / minutes;
  }

  calculateAccuracy(correct, total) {
    return total === 0 ? 100 : (correct / total) * 100;
  }
}

const stats = new Stats();
const getProtectedData = async () => {
    // Check if token exists
    const token = localStorage.getItem("token");

    const signUpButton = document.getElementById("signUp");
    const logoutButton = document.getElementById("LogOut");

    if (token) {
        // If token exists, hide the Sign Up button and show the Logout button
        if (signUpButton) {
            signUpButton.style.display = "none"; // Hide the Sign Up button
        }

        if (logoutButton) {
            logoutButton.style.display = "inline-block"; // Show the Logout button
        }

        // Proceed with fetching protected data
        try {
            const response = await fetch("http://localhost:3000/dashboard", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                console.log(data.user.email);
                userMail = data.user.email;
            } else {
                console.log("Error fetching data:", response.statusText);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    } else {
        console.log("No token found");
        // Hide the Logout button if no token exists

window.location.href = "./mainpage/main.html"; 
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

    console.log("Logged out successfully!");
};

// Add event listener to the Logout button
const logoutButton = document.getElementById("LogOut");
if (logoutButton) {
    logoutButton.addEventListener("click", logout);
}

// Call the function to check the token and data when the page loads
getProtectedData();

// Continuously check for the token every 5 seconds (5000ms)
setInterval(getProtectedData, 5000);








