// player.js

const player = {
    hearts: 5,
    maxHearts: 5,
    coins: 0,
    lastDamageTime: null
};

function savePlayer() {
    localStorage.setItem('player', JSON.stringify(player));
}

function loadPlayer() {
    const saved = JSON.parse(localStorage.getItem('player'));
    if (saved) {
        Object.assign(player, saved);
    }
}

function recoverHearts() {
    if (player.hearts < player.maxHearts && player.lastDamageTime) {
        const now = Date.now();
        const minutesPassed = (now - player.lastDamageTime) / (1000 * 60);
        const heartsToRecover = Math.floor(minutesPassed / 10);

        if (heartsToRecover > 0) {
            player.hearts = Math.min(player.maxHearts, player.hearts + heartsToRecover);
            if (player.hearts === player.maxHearts) {
                player.lastDamageTime = null;
            } else {
                player.lastDamageTime += heartsToRecover * 10 * 60 * 1000;
            }
            savePlayer();
        }
    }
}

function updatePlayerUI() {
    const heartsElement = document.getElementById('hearts-value');
    const coinsElement = document.getElementById('coins-value');
    if (heartsElement && coinsElement) {
        heartsElement.innerText = player.hearts;
        coinsElement.innerText = player.coins;
    }
}

function buyHeart() {
    if (player.coins >= 10 && player.hearts < player.maxHearts) {
        player.coins -= 10;
        player.hearts++;
        savePlayer();
        updatePlayerUI();
        alert('✅ Ви купили серце!');
    } else {
        alert('❌ Недостатньо монет або серця повні!');
    }
}
