document.addEventListener('DOMContentLoaded', function () {
    // Вивід результату
    const score = localStorage.getItem('score') || 0;
    const totalQuestions = localStorage.getItem('totalQuestions') || 1;
    const scoreText = document.getElementById('score-text');
    scoreText.innerText = `Ваш результат: ${score} із ${totalQuestions}`;

    // Кнопка перемикання теми
    const themeToggle = document.createElement("button");
    themeToggle.id = "theme-toggle";
    themeToggle.innerHTML = localStorage.getItem("theme") === "dark" ? "☀️" : "🌙";
    Object.assign(themeToggle.style, {
        position: "fixed",
        top: "10px",
        left: "10px",
        padding: "10px",
        border: "none",
        borderRadius: "50%",
        background: "transparent",
        fontSize: "24px",
        cursor: "pointer",
        zIndex: "1000"
    });

    function applyTheme(theme) {
        document.body.classList.toggle("dark-mode", theme === "dark");
        localStorage.setItem("theme", theme);
        themeToggle.innerHTML = theme === "dark" ? "☀️" : "🌙";
    }

    themeToggle.addEventListener("click", function () {
        const currentTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
        applyTheme(currentTheme);
    });

    document.body.appendChild(themeToggle);

    if (localStorage.getItem("theme") === "dark") {
        applyTheme("dark");
    }
});

// Кнопки дій
function restartTest() {
    localStorage.removeItem('score');
    localStorage.removeItem('totalQuestions');
    window.location.href = 'tests.html';
}

function goHome() {
    localStorage.removeItem('score');
    localStorage.removeItem('totalQuestions');
    window.location.href = 'index.html';
}
