// DOM Elements
const rankingsList = document.getElementById('rankings-list');
const yourRankElement = document.getElementById('your-rank');
const yourMmrElement = document.getElementById('your-mmr');
const themeToggle = document.querySelector('.theme-toggle');

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
});

// Load rankings data
function loadRankings() {
    // Get all players from localStorage
    const players = JSON.parse(localStorage.getItem('players')) || [];
    const currentPlayer = {
        name: localStorage.getItem('playerName') || 'Player',
        mmr: parseInt(localStorage.getItem('mmr')) || 1000
    };

    // Add current player if not in list
    if (!players.find(p => p.name === currentPlayer.name)) {
        players.push(currentPlayer);
    }

    // Sort players by MMR
    players.sort((a, b) => b.mmr - a.mmr);

    // Update rankings list
    rankingsList.innerHTML = '';
    players.forEach((player, index) => {
        const rank = index + 1;
        const rankElement = document.createElement('div');
        rankElement.className = 'rank-item';
        rankElement.innerHTML = `
            <span class="rank">${rank}</span>
            <span class="player">${player.name}</span>
            <span class="mmr">${player.mmr}</span>
        `;
        rankingsList.appendChild(rankElement);

        // Update your rank if this is the current player
        if (player.name === currentPlayer.name) {
            yourRankElement.textContent = rank;
            yourMmrElement.textContent = player.mmr;
        }
    });

    // Save updated players list
    localStorage.setItem('players', JSON.stringify(players));
}

// Initialize page
loadRankings(); 