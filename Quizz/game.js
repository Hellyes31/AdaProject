import { quizz_film } from "./questions.js";

// --- Sélection des éléments DOM ---
const welcome = document.getElementById("welcome")
const feedbackMessage = document.getElementById("feedback-message");
const timer = document.getElementById("time");
const timerContainer = document.querySelector(".timer");
const pseudoContainer = document.getElementById("pseudo-container");
const pseudoInput = document.getElementById("pseudo-input");
const startButton = document.getElementById("start-button");
const replayButton = document.getElementById("replay-button");
const questionElement = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-button");
const jsConfetti = new JSConfetti();

// --- Sélection des éléments GIF ---
const gifScores = {
  0: document.getElementById("end-gif-score-0"),
  1: document.getElementById("end-gif-score-1-2"),
  2: document.getElementById("end-gif-score-1-2"),
  3: document.getElementById("end-gif-score-3-4"),
  4: document.getElementById("end-gif-score-3-4"),
  5: document.getElementById("end-gif-score-5"),
  6: document.getElementById("end-gif-score-6-7"),
  7: document.getElementById("end-gif-score-6-7"),
  8: document.getElementById("end-gif-score-8-9"),
  9: document.getElementById("end-gif-score-8-9"),
  10: document.getElementById("end-gif-score-10"),
};

// --- Variables globales ---
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 12;
let timerInterval;
let quizOn = false;
let pseudo = "";

// --- Fonctions utilitaires ---
function setDisplay(elements, display) {
  elements.forEach(el => el.style.display = display);
}

function resetGifScores() {
  Object.values(gifScores).forEach(gif => gif.style.display = "none");
}

function showGifScore(score) {
  resetGifScores();
  if (gifScores[score]) {
    gifScores[score].src = gifScores[score].src;
    gifScores[score].style.display = "inline-block";
  }
}

function normalizeText(text) {
  return text.toLowerCase().trim().replace(/[.,!?]/g, "");
}

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 12;
  timer.textContent = timeLeft;
  quizOn = false;
  pseudoInput.value = "";

  setDisplay(
    [questionElement, optionsContainer, nextButton, timerContainer, feedbackMessage],
    "none"
  );
  setDisplay([pseudoContainer, welcome], "block");
  replayButton.style.display = "none";
  resetGifScores();
}

// --- Lancement de la réplique et événements impliqués ---
function loadQuestion() {
  clearInterval(timerInterval);
  timeLeft = 12;
  timer.textContent = timeLeft;
  startTimer();

  setDisplay([feedbackMessage, welcome], "none");
  feedbackMessage.innerText = "";
  nextButton.disabled = true;

  const currentQuestion = quizz_film.questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.text;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((optionText) => {
    const optionBtn = document.createElement("button");
    optionBtn.innerText = optionText;
    optionBtn.classList.add("option-button");
    optionsContainer.appendChild(optionBtn);

    optionBtn.addEventListener("click", () =>
      checkAnswer(optionBtn, currentQuestion.correct_answer)
    );
  });
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (quizOn) {
        checkAnswer(null, quizz_film.questions[currentQuestionIndex].correct_answer);
      }
    }
  }, 1000);
}

function checkAnswer(clickedButton, correctAnswer) {
  clearInterval(timerInterval);
  const allButtons = document.querySelectorAll(".option-button");
  const normalizedCorrect = normalizeText(correctAnswer);

  allButtons.forEach(button => {
    button.disabled = true;
    const isCorrect = normalizeText(button.innerText) === normalizedCorrect;
    button.classList.add(isCorrect ? "correct" : "incorrect");
  });

  const isUserCorrect = clickedButton && normalizeText(clickedButton.innerText) === normalizedCorrect;

  if (isUserCorrect) {
    score++;
    jsConfetti.addConfetti();
    feedbackMessage.innerText = "Bravo ! Bonne réponse 🎉";
  } else if (clickedButton) {
    feedbackMessage.innerText = "Dommage, ce n'était pas la bonne réponse.";
  } else {
    feedbackMessage.innerText = "Temps écoulé ! La réponse est considérée comme fausse.";
  }

  feedbackMessage.style.display = "block";
  nextButton.disabled = false;
}

function showClassement() {
  const classement = JSON.parse(localStorage.getItem("classement")) || [];
  const classementContainer = document.getElementById("classement-container");
  const classementListe = document.getElementById("classement-liste");

  // --- Si le classement est déjà visible, on le cache ---
  if (classementContainer.style.display === 'block') {
    classementContainer.style.display = 'none';
    return;
  }

  // --- Sinon on l'affiche ---
  classementListe.innerHTML = "";

  if (classement.length === 0) {
    classementListe.innerHTML = '<li>Aucun score enregistré pour l’instant !</li>';
  } else {
    classement.sort((a, b) => b.score - a.score);

    classement.forEach((joueur, index) => {
      const item = document.createElement('li');
      item.textContent = `${index + 1}. ${joueur.pseudo} - ${joueur.score} / ${quizz_film.questions.length}`;
      classementListe.appendChild(item);
    });
  }

  classementContainer.style.display = 'block';
}

// --- Événements ---
startButton.addEventListener("click", () => {
  pseudo = pseudoInput.value.trim();
  if (!pseudo) {
    alert("Merci de rentrer un pseudo pour commencer !");
    return;
  }

  quizOn = true;
  currentQuestionIndex = 0;
  score = 0;

  setDisplay([pseudoContainer], "none");
  setDisplay([optionsContainer], "grid");
  setDisplay([questionElement, nextButton, timerContainer], "block");
  replayButton.style.display = "none";

  loadQuestion();
});

// --- Feature du bouton Next ---
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizz_film.questions.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    timerContainer.style.display = "none";

    let classement = JSON.parse(localStorage.getItem("classement")) || [];
    classement.push({ pseudo, score });
    classement.sort((a, b) => b.score - a.score);
    localStorage.setItem("classement", JSON.stringify(classement));

    questionElement.innerText = `C'est fini, merci ${pseudo} d'avoir participé !\nTon score : ${score} / ${quizz_film.questions.length}`;
    optionsContainer.innerHTML = "";
    nextButton.style.display = "none";
    replayButton.style.display = "inline-block";
    feedbackMessage.style.display = "none";

    showGifScore(score);
  }
});

// --- Feature du bouton Replay ---
replayButton.addEventListener("click", resetQuiz);

document.getElementById("reset-classement").addEventListener("click", () => {
  localStorage.removeItem("classement");
  alert("Classement réinitialisé !");
});

document.getElementById("show-classement").addEventListener("click", showClassement);

// --- Feature de la pression 'Entrée' sur les différents boutons ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (pseudoContainer.style.display === "block") {
      startButton.click();
    } else if (replayButton.style.display === "inline-block") {
      replayButton.click();
    } else if (
      questionElement.style.display === "block" &&
      nextButton.style.display !== "none" &&
      !nextButton.disabled
    ) {
      nextButton.click();
    }
  }
});

// --- Initialisation du Quizz ---
resetQuiz();