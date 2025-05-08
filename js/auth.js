
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEd0Sqry8bHkphhoectT7zzQtV_mDomCs",
  authDomain: "diplom-cd4cf.firebaseapp.com",
  projectId: "diplom-cd4cf",
  storageBucket: "diplom-cd4cf.appspot.com",
  messagingSenderId: "698861808707",
  appId: "1:698861808707:web:cbab25d18e9ade33e7f8f6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function showMessage(text, isSuccess = false) {
  const box = document.getElementById('form-message');
  if (!box) return;
  box.textContent = text;
  box.className = isSuccess ? 'success' : 'error';
  box.style.display = 'block';
}

// 👉 Вхід
document.getElementById("login-btn")?.addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      showMessage("Вхід успішний! Перенаправлення...", true);
      setTimeout(() => window.location.href = "tests.html", 1000);
    })
    .catch((error) => {
      let message = "Невідома помилка.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Неправильний email або пароль.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Невірний формат email.";
      }
      showMessage(message);
    });
});

// 👉 Реєстрація
document.getElementById("register-btn")?.addEventListener("click", () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      showMessage("Реєстрація успішна! Перенаправлення...", true);
      setTimeout(() => window.location.href = "tests.html", 1000);
    })
    .catch((error) => {
      let message = "Невідома помилка.";
      if (error.code === 'auth/email-already-in-use') {
        message = "Цей email вже зареєстровано.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Невірний формат email.";
      } else if (error.code === 'auth/weak-password') {
        message = "Пароль має містити щонайменше 6 символів.";
      }
      showMessage(message);
    });
});

// 👉 Google-вхід
document.getElementById("google-login")?.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      showMessage("Вхід через Google успішний!", true);
      setTimeout(() => window.location.href = "tests.html", 1000);
    })
    .catch(() => {
      showMessage("Google-вхід не вдався. Спробуйте ще раз.");
    });
});

// 👉 Перемикання форм
document.getElementById("show-register")?.addEventListener("click", () => {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "block";
});
document.getElementById("show-login")?.addEventListener("click", () => {
  document.getElementById("register-box").style.display = "none";
  document.getElementById("login-box").style.display = "block";
});
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
;