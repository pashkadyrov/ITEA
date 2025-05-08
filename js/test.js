document.addEventListener("DOMContentLoaded", function () {
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
        zIndex: "1000",
        color: "white"
    });

    function applyTheme(theme) {
        const header = document.querySelector('header');
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
            if (header) header.classList.add("dark-header");
        } else {
            document.body.classList.remove("dark-mode");
            if (header) header.classList.remove("dark-header");
        }
        localStorage.setItem("theme", theme);
        themeToggle.innerHTML = theme === "dark" ? "☀️" : "🌙";
    }

    themeToggle.addEventListener("click", function () {
        const newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
        applyTheme(newTheme);
    });

    document.body.appendChild(themeToggle);
    if (localStorage.getItem("theme") === "dark") applyTheme("dark");

    // Тестові питання
    const levels = {
        "A1": [
            { question: "Wie heißt du?", answers: ["Ich bin 20 Jahre alt", "Ich heiße Anna", "Ich wohne in Berlin"], correct: 1 },
            { question: "Wo wohnst du?", answers: ["In Deutschland", "Ich bin Lehrer", "Ich habe ein Auto"], correct: 0 }
        ],
        "A2": [
            { question: "Was machst du gern?", answers: ["Ich spiele Fußball", "Ich bin müde", "Ich habe Hunger"], correct: 0 },
            { question: "Welches Wetter magst du?", answers: ["Sonnig", "Ich bin Lehrer", "Auto fahren"], correct: 0 }
        ],
        "B1": [
            { question: "Was bedeutet das Wort 'nachhaltig'?", answers: ["Kurzfristig", "Umweltfreundlich", "Langweilig"], correct: 1 },
            { question: "Welches Verb passt? 'Er hat den Termin...'", answers: ["Vergessen", "Geschrieben", "Geschenkt"], correct: 0 }
        ],
        "B2": [
            { question: "Welcher Satz ist grammatikalisch korrekt?", answers: ["Ich habe gestern ins Kino gegangen.", "Ich bin gestern ins Kino gegangen.", "Ich gehe gestern ins Kino."], correct: 1 },
            { question: "Was ist ein Synonym für 'konsequent'?", answers: ["Unentschlossen", "Beharrlich", "Vergesslich"], correct: 1 }
        ],
        "C1": [
            { question: "Was bedeutet 'Eloquenz'?", answers: ["Sprachgewandtheit", "Langsamkeit", "Schwierigkeit"], correct: 0 },
            { question: "Welcher Satz ist stilistisch besser?", answers: ["Er hat das Problem gelöst, indem er überlegt hat.", "Durch Überlegung hat er das Problem gelöst.", "Er dachte nach und das Problem wurde gelöst."], correct: 1 }
        ],
        "C2": [
            { question: "Welche rhetorische Figur ist in folgendem Satz enthalten? 'Er kam, sah und siegte.'", answers: ["Metapher", "Alliteration", "Asyndeton"], correct: 2 },
            { question: "Welches Wort beschreibt eine hochkomplexe und differenzierte Sprache?", answers: ["Primitiv", "Nuanciert", "Einfach"], correct: 1 }
        ]
    };

    const testContainer = document.querySelector(".test-grid");
    const questionContainer = document.getElementById("question-text");
    const answersContainer = document.getElementById("answers");
    const levelSelection = document.getElementById("level-selection");
    const quizContainer = document.getElementById("quiz-container");
    const timerElement = document.getElementById("timer");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const heartDisplay = document.getElementById("hearts-value");
    const tooltip = document.getElementById("heart-tooltip");
    const maxHp = 5;
    const HEART_REGEN_INTERVAL = 5 * 60 * 1000;

    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let userAnswers = [];
    let answerOrder = [];
    let timerInterval;
    let timeLeft = 30;
    let currentHp = parseInt(localStorage.getItem("currentHp")) || maxHp;
    let tempHp = currentHp;
    let nextRegen = parseInt(localStorage.getItem("nextRegen")) || Date.now() + HEART_REGEN_INTERVAL;

    function updateHpUI() {
        if (heartDisplay) {
            heartDisplay.textContent = currentHp;
        }
    }

    updateHpUI();

    setInterval(() => {
        if (currentHp < maxHp && Date.now() >= nextRegen) {
            currentHp++;
            nextRegen = Date.now() + HEART_REGEN_INTERVAL;
            localStorage.setItem("currentHp", currentHp);
            localStorage.setItem("nextRegen", nextRegen);
            updateHpUI();
        }
    }, 1000);

    if (heartDisplay) {
        heartDisplay.addEventListener("mouseenter", () => {
            const remaining = nextRegen - Date.now();
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            tooltip.innerText = currentHp < maxHp
                ? `Наступне серце через: ${minutes} хв ${seconds < 10 ? '0' : ''}${seconds} сек`
                : `У вас максимальна кількість сердець.`;
            tooltip.style.display = "block";
        });
        heartDisplay.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
        heartDisplay.addEventListener("mousemove", e => {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });
    }

    function shuffleArray(array) {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 30;
        timerElement.textContent = `Залишилось часу: ${timeLeft} с`;

        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Залишилось часу: ${timeLeft} с`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if (userAnswers[currentQuestionIndex] == null) {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < questions.length) {
                        loadQuestion();
                    } else {
                        finishTest();
                    }
                }
            }
        }, 1000);
    }

    function loadQuestion() {
        const current = questions[currentQuestionIndex];
        questionContainer.innerText = current.question;
        answersContainer.innerHTML = "";

        if (!answerOrder[currentQuestionIndex]) {
            answerOrder[currentQuestionIndex] = shuffleArray(current.answers.map((text, i) => ({
                text,
                originalIndex: i
            })));
        }

        answerOrder[currentQuestionIndex].forEach((ans, i) => {
            const btn = document.createElement("button");
            btn.innerText = ans.text;
            btn.classList.add("answer-btn");
            btn.disabled = false;
            if (userAnswers[currentQuestionIndex] === ans.originalIndex) {
                btn.classList.add("selected");
            }
            btn.addEventListener("click", () => selectAnswer(i));
            answersContainer.appendChild(btn);
        });

        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === questions.length - 1;
        startTimer();
    }

    function selectAnswer(index) {
        clearInterval(timerInterval);
        const buttons = document.querySelectorAll(".answer-btn");
        buttons.forEach(btn => btn.disabled = true);

        const selectedOriginal = answerOrder[currentQuestionIndex][index].originalIndex;
        userAnswers[currentQuestionIndex] = selectedOriginal;
        const correctIndex = questions[currentQuestionIndex].correct;

        if (selectedOriginal === correctIndex) {
            score++; // ✅ очко за правильну відповідь
        } else {
            tempHp--;
            currentHp = tempHp;
            localStorage.setItem("currentHp", currentHp);
            if (currentHp < maxHp) {
                nextRegen = Date.now() + HEART_REGEN_INTERVAL;
                localStorage.setItem("nextRegen", nextRegen);
            }
            updateHpUI();
        
            // ❗ Перевірка на 0 HP
            if (tempHp <= 0) {
                showHeartModal();
                return;
            }
        }
        
        

        buttons.forEach((btn, i) => {
            const isCorrect = answerOrder[currentQuestionIndex][i].originalIndex === correctIndex;
            const isSelected = i === index;
            if (isCorrect) {
                btn.classList.add("correct-answer");
            } else if (isSelected) {
                btn.classList.add("wrong-answer");
            }
        });

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                localStorage.setItem("currentHp", tempHp);
                localStorage.setItem("score", score);
                localStorage.setItem("totalQuestions", questions.length);
                window.location.href = "results.html";
            }
        }, 1000);
    }

    nextBtn.addEventListener("click", () => {
        clearInterval(timerInterval);
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            finishTest();
        }
    });

    prevBtn.addEventListener("click", () => {
        clearInterval(timerInterval);
        currentQuestionIndex--;
        loadQuestion();
    });

    function finishTest() {
        alert("Час вичерпано!");
        window.location.href = "results.html";
    }

    Object.keys(levels).forEach(level => {
        const card = document.createElement("div");
        card.classList.add("test-card");
        card.innerText = `${level} - Обрати тест`;
        card.addEventListener("click", () => {
            if (currentHp <= 0) {
                alert("У вас недостатньо сердець. Спробуйте пізніше або купіть у магазині.");
                return;
            }

            questions = shuffleArray([...levels[level]]);
            userAnswers = new Array(questions.length).fill(null);
            answerOrder = [];
            currentQuestionIndex = 0;
            tempHp = currentHp;

            levelSelection.style.display = "none";
            quizContainer.style.display = "block";
            loadQuestion();
        });
        testContainer.appendChild(card);
    });
});

function showHeartModal() {
    const modal = document.getElementById("heartModal");
    modal.style.display = "block";

    document.getElementById("buyHeartsBtn").onclick = () => {
        currentHp = maxHp;
        tempHp = maxHp;
        localStorage.setItem("currentHp", maxHp);
        updateHpUI();
        modal.style.display = "none";

        // ✅ Завантажити поточне питання після відновлення сердець
        loadQuestion(); 
    };

    document.getElementById("exitTestBtn").onclick = () => {
        modal.style.display = "none";
        currentHp = 0;
        tempHp = 0;
        localStorage.setItem("currentHp", 0);
        updateHpUI();
    
        alert("Тест завершено через відсутність сердець.");
        location.href = "tests.html";
    };
    
}

