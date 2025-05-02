class VirtualKeyboard {
  constructor() {
    this.container = document.getElementById('keyboard-container');
    this.layout = [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl']
    ];
    
    this.init();
  }

  init() {
    this.layout.forEach(row => {
      const keyboardRow = document.createElement('div');
      keyboardRow.className = 'keyboard-row';
      
      row.forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.className = 'key';
        keyElement.dataset.key = key.toLowerCase();
        keyElement.textContent = key;
        
        if (key === 'Space') {
          keyElement.style.width = '200px';
          keyElement.textContent = '';
        } else if (['Backspace', 'Tab', 'Caps', 'Shift', 'Enter'].includes(key)) {
          keyElement.style.width = '80px';
        }
        
        keyboardRow.appendChild(keyElement);
      });
      
      this.container.appendChild(keyboardRow);
    });
  }

  highlightKey(key) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(k => k.classList.remove('active'));
    
    const keyElement = document.querySelector(`.key[data-key="${key.toLowerCase()}"]`);
    if (keyElement) {
      keyElement.classList.add('active');
      setTimeout(() => keyElement.classList.remove('active'), 100);
    }
  }
}

const keyboard = new VirtualKeyboard();
