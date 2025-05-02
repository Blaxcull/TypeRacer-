class TypingTest {
  constructor() {
    this.textDisplay = document.getElementById('text-display');
    this.input = document.getElementById('typing-input');
    this.timer = document.getElementById('timer');
    this.wpmDisplay = document.getElementById('wpm');
    this.accuracyDisplay = document.getElementById('accuracy');
    this.restartBtn = document.getElementById('restart-btn');
    this.difficultyBtns = document.querySelectorAll('[data-difficulty]');
    
    this.currentText = '';
    this.timeLeft = 60;
    this.isRunning = false;
    this.interval = null;
    this.startTime = null;
    this.errors = 0;
    this.totalTyped = 0;
    this.correctChars = 0;
    
    this.init();
  }

  init() {
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.restartBtn.addEventListener('click', this.restart.bind(this));
    this.difficultyBtns.forEach(btn => {
      btn.addEventListener('click', () => this.changeDifficulty(btn.dataset.difficulty));
    });
    
    this.generateText('easy');
  }

  generateText(difficulty) {
    const texts = {
      easy: [
        "The quick brown fox jumps over the lazy dog. Simple words flow like a gentle stream, carrying thoughts from mind to page. Each keystroke builds confidence and speed, transforming practice into progress. The journey of typing begins with a single character and grows into flowing sentences.",
        "All work and no play makes Jack a dull boy. The sun rises in the east, painting the sky in brilliant hues of orange and pink. Birds soar through clouds, their wings catching morning light. Nature's beauty inspires us to create and express ourselves through written words.",
        "Practice makes perfect when learning to type. Fingers dance across the keyboard, creating rhythm and flow. Each mistake is a lesson, each success a step forward. The art of typing combines precision, speed, and patience into a valuable skill that serves us daily."
      ],
      medium: [
        "Success is not final, failure is not fatal: it is the courage to continue that counts. In the depths of winter, I finally learned that within me there lay an invincible summer. The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
        "Life is what happens while you're busy making other plans. The future belongs to those who believe in the beauty of their dreams. It does not matter how slowly you go as long as you do not stop. The journey of a thousand miles begins with a single step. Every moment is a fresh beginning, a chance to start anew.",
        "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover. The only impossible journey is the one you never begin."
      ],
      hard: [
        "The function setTimeout() is commonly used in JavaScript to execute code after a specified delay. Asynchronous programming allows us to write non-blocking code that improves application performance. Promise chains can be simplified using async/await syntax, making code more readable and maintainable. Error handling becomes more intuitive with try/catch blocks.",
        "React components must return a single root element, which can contain multiple child elements. The virtual DOM efficiently updates the actual DOM by minimizing direct manipulations. Hooks provide a way to use state and other React features without writing class components. useEffect manages side effects in functional components, handling lifecycle events seamlessly.",
        "TypeScript extends JavaScript by adding static type definitions and object-oriented features. Interface declarations define contracts that classes must implement. Generic types provide flexibility while maintaining type safety. Decorators offer a way to add annotations and metadata to classes and class members. Advanced types like unions and intersections enable complex type relationships."
      ]
    };

    const textArray = texts[difficulty];
    this.currentText = textArray[Math.floor(Math.random() * textArray.length)];
    this.displayText();
  }

  displayText() {
    this.textDisplay.innerHTML = this.currentText.split('').map(char => 
      `<span class="char">${char}</span>`
    ).join('');
  }

  handleInput(e) {
    if (!this.isRunning) {
      this.start();
    }

    const inputValue = e.target.value;
    const chars = this.textDisplay.querySelectorAll('.char');
    
    this.correctChars = 0;
    chars.forEach((char, index) => {
      if (index < inputValue.length) {
        if (inputValue[index] === this.currentText[index]) {
          char.className = 'char correct';
          this.correctChars++;
        } else {
          char.className = 'char incorrect';
        }
      } else {
        char.className = 'char';
      }
    });

    this.totalTyped = inputValue.length;
    
    if (this.isRunning) {
      const timePassed = (Date.now() - this.startTime) / 1000;
      const wpm = this.calculateWPM(this.correctChars, timePassed);
      const accuracy = this.calculateAccuracy(this.correctChars, this.totalTyped);
      
      this.wpmDisplay.textContent = Math.round(wpm);
      this.accuracyDisplay.textContent = `${Math.round(accuracy)}%`;
    }
    
    if (inputValue === this.currentText) {
      this.complete();
    }
  }

  calculateWPM(charCount, seconds) {
    const minutes = seconds / 60;
    const words = charCount / 5; // Standard: 5 characters = 1 word
    return words / minutes;
  }

  calculateAccuracy(correct, total) {
    return total === 0 ? 100 : (correct / total) * 100;
  }

  start() {
    this.isRunning = true;
    this.startTime = Date.now();
    this.interval = setInterval(() => {
      this.timeLeft--;
      this.timer.textContent = `${this.timeLeft}s`;
      
      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
  }

  complete() {
    clearInterval(this.interval);
    this.isRunning = false;
    this.input.disabled = true;
  }

  restart() {
    clearInterval(this.interval);
    this.timeLeft = 60;
    this.isRunning = false;
    this.errors = 0;
    this.totalTyped = 0;
    this.correctChars = 0;
    this.timer.textContent = '60s';
    this.wpmDisplay.textContent = '0';
    this.accuracyDisplay.textContent = '100%';
    this.input.value = '';
    this.input.disabled = false;
    this.generateText(document.querySelector('[data-difficulty].active').dataset.difficulty);
  }

  changeDifficulty(difficulty) {
    this.difficultyBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
    this.restart();
  }
}

const typingTest = new TypingTest();
