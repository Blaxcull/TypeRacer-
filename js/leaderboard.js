class Leaderboard {
  constructor() {
    this.table = document.getElementById('leaderboard-table');
    this.tabs = document.querySelectorAll('.tab-btn');
    this.currentTab = 'personal';
    
    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });
    
    this.update();
  }

  switchTab(tab) {
    this.currentTab = tab;
    this.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    this.update();
  }

  update() {
    if (this.currentTab === 'personal') {
      const scores = JSON.parse(localStorage.getItem('typingScores') || '[]');
      this.displayScores(scores);
    } else {
      this.displayGlobalScores();
    }
  }

  displayScores(scores) {
    this.table.innerHTML = `
      <thead>
        <tr>
          <th>Rank</th>
          <th>WPM</th>
          <th>Accuracy</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${scores.map((score, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${score.wpm}</td>
            <td>${score.accuracy}%</td>
            <td>${new Date(score.date).toLocaleDateString()}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  displayGlobalScores() {
    const mockScores = [
      { name: 'TypeMaster', wpm: 150, accuracy: 99 },
      { name: 'SpeedDemon', wpm: 140, accuracy: 98 },
      { name: 'KeyboardNinja', wpm: 135, accuracy: 97 },
      { name: 'SwiftFingers', wpm: 130, accuracy: 96 },
      { name: 'TypeLord', wpm: 125, accuracy: 95 }
    ];

    this.table.innerHTML = `
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>WPM</th>
          <th>Accuracy</th>
        </tr>
      </thead>
      <tbody>
        ${mockScores.map((score, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${score.name}</td>
            <td>${score.wpm}</td>
            <td>${score.accuracy}%</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }
}

const leaderboard = new Leaderboard();

// Export for use in typing-test.js
window.updateLeaderboard = () => leaderboard.update();
