document.addEventListener("DOMContentLoaded", function () {
    const heartsInput = document.getElementById("set-hearts");
    const coinsInput = document.getElementById("set-coins");

    // Встановити поточні значення
    heartsInput.value = localStorage.getItem("currentHp") || 5;
    coinsInput.value = localStorage.getItem("coins") || 0;
});

function applyAdminStats() {
    const newHp = parseInt(document.getElementById("set-hearts").value, 10);
    const newCoins = parseInt(document.getElementById("set-coins").value, 10);

    if (isNaN(newHp) || isNaN(newCoins) || newHp < 0 || newCoins < 0) {
        alert("❌ Введіть коректні значення!");
        return;
    }

    localStorage.setItem("currentHp", newHp);
    localStorage.setItem("coins", newCoins);
    alert("✅ Серця та монети оновлено!");
    
    // Оновити UI, якщо потрібно
    if (typeof updateUIStats === 'function') {
        updateUIStats();
    }
}

function logoutAdmin() {
    localStorage.removeItem("isAdmin");
    alert("🚪 Ви вийшли з адмін-панелі.");
    location.reload();
}
function unlockLevel() {
    const level = document.getElementById("unlock-level").value;
    let passedLevels = JSON.parse(localStorage.getItem("passedLevels") || "[]");
    if (!passedLevels.includes(level)) {
        passedLevels.push(level);
        localStorage.setItem("passedLevels", JSON.stringify(passedLevels));
        alert(`Рівень ${level} розблоковано!`);
        location.reload(); // перезавантажити сторінку для оновлення UI
    }
}
