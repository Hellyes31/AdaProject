import { quizz_film } from "./questions.js";

// --- Sélection des éléments DOM ---
const WELCOME = document.getElementById("welcome")
const FEEDBACKMESSAGE = document.getElementById("feedback-message");
const TIMER = document.getElementById("time");
const TIMERCONTAINER = document.querySelector(".timer");
const PSEUDOCONTAINER = document.getElementById("pseudo-container");
const PSEUDOINPUT = document.getElementById("pseudo-input");
const STARTBUTTON = document.getElementById("start-button");
const REPLAYBUTTON = document.getElementById("replay-button");
const QUESTIONELEMENT = document.getElementById("question-text");
const OPTIONSCONTAINER = document.getElementById("options-container");
const NEXTBUTTON = document.getElementById("next-button");
const JSCONFETTI = new JSConfetti();

// --- Sélection des éléments GIF ---
const GifScores = {
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
  Object.values(GifScores).forEach(gif => gif.style.display = "none");
}

function showGifScore(score) {
  resetGifScores();
  if (GifScores[score]) {
    GifScores[score].src = GifScores[score].src;
    GifScores[score].style.display = "inline-block";
  }
}

function normalizeText(text) {
  return text.toLowerCase().trim().replace(/[.,!?]/g, "");
}

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 12;
  TIMER.textContent = timeLeft;
  quizOn = false;
  PSEUDOINPUT.value = "";

  setDisplay(
    [QUESTIONELEMENT, OPTIONSCONTAINER, NEXTBUTTON, TIMERCONTAINER, FEEDBACKMESSAGE],
    "none"
  );
  setDisplay([PSEUDOCONTAINER, WELCOME], "block");
  REPLAYBUTTON.style.display = "none";
  resetGifScores();
}

// --- Lancement de la réplique et événements impliqués ---
function loadQuestion() {
  clearInterval(timerInterval);
  timeLeft = 12;
  TIMER.textContent = timeLeft;
  startTimer();

  setDisplay([FEEDBACKMESSAGE, WELCOME], "none");
  FEEDBACKMESSAGE.innerText = "";
  NEXTBUTTON.disabled = true;

  const CURRENTQUESTION = quizz_film.questions[currentQuestionIndex];
  QUESTIONELEMENT.innerText = CURRENTQUESTION.text;
  OPTIONSCONTAINER.innerHTML = "";

  CURRENTQUESTION.options.forEach((optionText) => {
    const OPTIONBTN = document.createElement("button");
    OPTIONBTN.innerText = optionText;
    OPTIONBTN.classList.add("option-button");
    OPTIONSCONTAINER.appendChild(OPTIONBTN);

    OPTIONBTN.addEventListener("click", () =>
      checkAnswer(OPTIONBTN, CURRENTQUESTION.correct_answer)
    );
  });
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    TIMER.textContent = timeLeft;
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
  const ALLBUTTONS = document.querySelectorAll(".option-button");
  const NORMALIZEDCORRECT = normalizeText(correctAnswer);

  ALLBUTTONS.forEach(button => {
    button.disabled = true;
    const ISCORRECT = normalizeText(button.innerText) === NORMALIZEDCORRECT;
    button.classList.add(ISCORRECT ? "correct" : "incorrect");
  });

  const ISUSERCORRECT = clickedButton && normalizeText(clickedButton.innerText) === NORMALIZEDCORRECT;

  if (ISUSERCORRECT) {
    score++;
    JSCONFETTI.addConfetti();
    FEEDBACKMESSAGE.innerText = "Bravo ! Bonne réponse 🎉";
  } else if (clickedButton) {
    FEEDBACKMESSAGE.innerText = "Dommage, ce n'était pas la bonne réponse.";
  } else {
    FEEDBACKMESSAGE.innerText = "Temps écoulé ! La réponse est considérée comme fausse.";
  }

  FEEDBACKMESSAGE.style.display = "block";
  NEXTBUTTON.disabled = false;
}

function showClassement() {
  const CLASSEMENT = JSON.parse(localStorage.getItem("classement")) || [];
  const CLASSEMENTCONTAINER = document.getElementById("classement-container");
  const CLASSEMENTLISTE = document.getElementById("classement-liste");

  // --- Si le classement est déjà visible, on le cache ---
  if (CLASSEMENTCONTAINER.style.display === 'block') {
    CLASSEMENTCONTAINER.style.display = 'none';
    return;
  }

  // --- Sinon on l'affiche ---
  CLASSEMENTLISTE.innerHTML = "";

  if (CLASSEMENT.length === 0) {
    CLASSEMENTLISTE.innerHTML = '<li>Aucun score enregistré pour l’instant !</li>';
  } else {
    CLASSEMENT.sort((a, b) => b.score - a.score);

    CLASSEMENT.forEach((joueur, index) => {
      const ITEM = document.createElement('li');
      ITEM.textContent = `${index + 1}. ${joueur.pseudo} - ${joueur.score} / ${quizz_film.questions.length}`;
      CLASSEMENTLISTE.appendChild(ITEM);
    });
  }

  CLASSEMENTCONTAINER.style.display = 'block';
}

// --- Événements ---
STARTBUTTON.addEventListener("click", () => {
  pseudo = PSEUDOINPUT.value.trim();
  if (!pseudo) {
    alert("Merci de rentrer un pseudo pour commencer !");
    return;
  }

  quizOn = true;
  currentQuestionIndex = 0;
  score = 0;

  setDisplay([PSEUDOCONTAINER], "none");
  setDisplay([OPTIONSCONTAINER], "grid");
  setDisplay([QUESTIONELEMENT, NEXTBUTTON, TIMERCONTAINER], "block");
  REPLAYBUTTON.style.display = "none";

  loadQuestion();
});

// --- Feature du bouton Next ---
NEXTBUTTON.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizz_film.questions.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    TIMERCONTAINER.style.display = "none";

    let classement = JSON.parse(localStorage.getItem("classement")) || [];
    classement.push({ pseudo, score });
    classement.sort((a, b) => b.score - a.score);
    localStorage.setItem("classement", JSON.stringify(classement));

    QUESTIONELEMENT.innerText = `C'est fini, merci ${pseudo} d'avoir participé !\nTon score : ${score} / ${quizz_film.questions.length}`;
    OPTIONSCONTAINER.innerHTML = "";
    NEXTBUTTON.style.display = "none";
    REPLAYBUTTON.style.display = "inline-block";
    FEEDBACKMESSAGE.style.display = "none";

    showGifScore(score);
  }
});

// --- Feature du bouton Replay ---
REPLAYBUTTON.addEventListener("click", resetQuiz);

document.getElementById("reset-classement").addEventListener("click", () => {
  localStorage.removeItem("classement");
  alert("Classement réinitialisé !");
});

document.getElementById("show-classement").addEventListener("click", showClassement);

// --- Feature de la pression 'Entrée' sur les différents boutons ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (PSEUDOCONTAINER.style.display === "block") {
      STARTBUTTON.click();
    } else if (REPLAYBUTTON.style.display === "inline-block") {
      REPLAYBUTTON.click();
    } else if (
      QUESTIONELEMENT.style.display === "block" &&
      NEXTBUTTON.style.display !== "none" &&
      !NEXTBUTTON.disabled
    ) {
      NEXTBUTTON.click();
    }
  }
});

// --- Initialisation du Quizz ---
resetQuiz();