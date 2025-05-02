// Main JavaScript for SpeedType Master

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');
  const header = document.querySelector('.header');
  const statValues = document.querySelectorAll('.stat-value');
  const keys = document.querySelectorAll('.key');
  
  // Mobile Menu Toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navList.classList.toggle('active');
      
      // Transform hamburger to X
      const spans = this.querySelectorAll('span');
      if (this.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (navList && navList.classList.contains('active') && 
        !event.target.closest('.nav') && 
        !event.target.closest('.mobile-menu-toggle')) {
      navList.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      
      const spans = mobileMenuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Scroll effect for header
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
    } else {
      header.style.backgroundColor = 'rgba(18, 18, 18, 0.8)';
    }
  });
  
  // Counter animation for stats
  function animateCounters() {
    const options = {
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statValue = entry.target;
          const targetValue = parseInt(statValue.getAttribute('data-count'));
          const duration = 2000; // 2 seconds
          const step = Math.ceil(targetValue / (duration / 20)); // Update every 20ms
          
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= targetValue) {
              clearInterval(timer);
              current = targetValue;
            }
            statValue.textContent = current.toLocaleString();
          }, 20);
          
          observer.unobserve(statValue);
        }
      });
    }, options);
    
    statValues.forEach(stat => {
      observer.observe(stat);
    });
  }
  
  // Keyboard animation
  function simulateKeyboardTyping() {
    // Sample text to type
    const textToType = "the quick brown fox jumps over the lazy dog";
    let charIndex = 0;
    
    // Type effect
    const typeInterval = setInterval(() => {
      if (charIndex >= textToType.length) {
        clearInterval(typeInterval);
        setTimeout(resetKeyboard, 2000);
        return;
      }
      
      const char = textToType[charIndex].toLowerCase();
      const keyElement = document.querySelector(`.key[data-key="${char}"]`);
      
      if (keyElement) {
        // Activate the key
        keyElement.classList.add('active');
        
        // Deactivate after a short delay
        setTimeout(() => {
          keyElement.classList.remove('active');
        }, 150);
      }
      
      charIndex++;
    }, 200);
  }
  
  function resetKeyboard() {
    keys.forEach(key => {
      key.classList.remove('active');
    });
    
    // Restart the typing animation after a delay
    setTimeout(simulateKeyboardTyping, 3000);
  }
  
  // Initialize animations
  animateCounters();
  setTimeout(simulateKeyboardTyping, 2500); // Start typing after initial page load
  
  // Initialize buttons
  const singlePlayerBtn = document.querySelector('.btn-primary');
  const multiplayerBtn = document.querySelector('.btn-secondary');
  
  if (singlePlayerBtn) {
    singlePlayerBtn.addEventListener('click', function(e) {
      e.preventDefault();

    const token = localStorage.getItem("token");
        if(token){

            window.location.href = "../single.html"

        }

        else{

            window.location.href = "./signup/signIn/signUp.html"

        }

    });
  }
  
  if (multiplayerBtn) {
    multiplayerBtn.addEventListener('click', function(e) {
      e.preventDefault();

    const token = localStorage.getItem("token");


        if(token){

            window.location.href = "../main.html"

        }
        else{


            window.location.href = "./signup/signIn/signUp.html"

        }
    });
  }
});

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

