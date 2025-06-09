// Mobile menu toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');

menuToggle?.addEventListener('click', () => {
  navList.classList.toggle('active');
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Initialize audio context for sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playKeySound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playErrorSound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}

// Export sound functions for use in typing-test.js


