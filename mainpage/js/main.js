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
   const token = localStorage.getItem("token");
 
    if(token){

        singlePlayerBtn.addEventListener('click', function(e) {
            window.location.href = '../singlePlayer/single.html'
            e.preventDefault();
        });

        multiplayerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../multiplayer/main.html'
        });
    }
    if(!token){

        singlePlayerBtn.addEventListener('click', function(e) {
            window.location.href = '../signIn/signUp.html'
            e.preventDefault();
        });

        multiplayerBtn.addEventListener('click', function(e) {
            window.location.href = '../signIn/signUp.html'
            e.preventDefault();
        });

    }
});
