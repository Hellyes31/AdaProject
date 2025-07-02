import { quizz_film } from "./questions.js";

// --- Sélection des éléments DOM ---
const Welcome = document.getElementById("welcome")
const FeedbackMessage = document.getElementById("feedback-message");
const Timer = document.getElementById("time");
const TimerContainer = document.querySelector(".timer");
const PseudoContainer = document.getElementById("pseudo-container");
const PseudoInput = document.getElementById("pseudo-input");
const StartButton = document.getElementById("start-button");
const ReplayButton = document.getElementById("replay-button");
const QuestionElement = document.getElementById("question-text");
const OptionsContainer = document.getElementById("options-container");
const NextButton = document.getElementById("next-button");
const JsConfetti = new JSConfetti();

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
  Timer.textContent = timeLeft;
  quizOn = false;
  PseudoInput.value = "";

  setDisplay(
    [QuestionElement, OptionsContainer, NextButton, TimerContainer, FeedbackMessage],
    "none"
  );
  setDisplay([PseudoContainer, Welcome], "block");
  ReplayButton.style.display = "none";
  resetGifScores();
}

// --- Lancement de la réplique et événements impliqués ---
function loadQuestion() {
  clearInterval(timerInterval);
  timeLeft = 12;
  Timer.textContent = timeLeft;
  startTimer();

  setDisplay([FeedbackMessage, Welcome], "none");
  FeedbackMessage.innerText = "";
  NextButton.disabled = true;

  const CurrentQuestion = quizz_film.questions[currentQuestionIndex];
  QuestionElement.innerText = CurrentQuestion.text;
  OptionsContainer.innerHTML = "";

  CurrentQuestion.options.forEach((optionText) => {
    const OptionBtn = document.createElement("button");
    OptionBtn.innerText = optionText;
    OptionBtn.classList.add("option-button");
    OptionsContainer.appendChild(OptionBtn);

    OptionBtn.addEventListener("click", () =>
      checkAnswer(OptionBtn, CurrentQuestion.correct_answer)
    );
  });
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    Timer.textContent = timeLeft;
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
  const AllButtons = document.querySelectorAll(".option-button");
  const NormalizedCorrect = normalizeText(correctAnswer);

  AllButtons.forEach(button => {
    button.disabled = true;
    const IsCorrect = normalizeText(button.innerText) === NormalizedCorrect;
    button.classList.add(IsCorrect ? "correct" : "incorrect");
  });

  const IsUserCorrect = clickedButton && normalizeText(clickedButton.innerText) === NormalizedCorrect;

  if (IsUserCorrect) {
    score++;
    JsConfetti.addConfetti();
    FeedbackMessage.innerText = "Bravo ! Bonne réponse 🎉";
  } else if (clickedButton) {
    FeedbackMessage.innerText = "Dommage, ce n'était pas la bonne réponse.";
  } else {
    FeedbackMessage.innerText = "Temps écoulé ! La réponse est considérée comme fausse.";
  }

  FeedbackMessage.style.display = "block";
  NextButton.disabled = false;
}

function showClassement() {
  const Classement = JSON.parse(localStorage.getItem("classement")) || [];
  const ClassementContainer = document.getElementById("classement-container");
  const ClassementListe = document.getElementById("classement-liste");

  // --- Si le classement est déjà visible, on le cache ---
  if (ClassementContainer.style.display === 'block') {
    ClassementContainer.style.display = 'none';
    return;
  }

  // --- Sinon on l'affiche ---
  ClassementListe.innerHTML = "";

  if (Classement.length === 0) {
    ClassementListe.innerHTML = '<li>Aucun score enregistré pour l’instant !</li>';
  } else {
    Classement.sort((a, b) => b.score - a.score);

    Classement.forEach((joueur, index) => {
      const Item = document.createElement('li');
      Item.textContent = `${index + 1}. ${joueur.pseudo} - ${joueur.score} / ${quizz_film.questions.length}`;
      ClassementListe.appendChild(Item);
    });
  }

  ClassementContainer.style.display = 'block';
}

// --- Événements ---
StartButton.addEventListener("click", () => {
  pseudo = PseudoInput.value.trim();
  if (!pseudo) {
    alert("Merci de rentrer un pseudo pour commencer !");
    return;
  }

  quizOn = true;
  currentQuestionIndex = 0;
  score = 0;

  setDisplay([PseudoContainer], "none");
  setDisplay([OptionsContainer], "grid");
  setDisplay([QuestionElement, NextButton, TimerContainer], "block");
  ReplayButton.style.display = "none";

  loadQuestion();
});

// --- Feature du bouton Next ---
NextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizz_film.questions.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    TimerContainer.style.display = "none";

    let classement = JSON.parse(localStorage.getItem("classement")) || [];
    classement.push({ pseudo, score });
    classement.sort((a, b) => b.score - a.score);
    localStorage.setItem("classement", JSON.stringify(classement));

    QuestionElement.innerText = `C'est fini, merci ${pseudo} d'avoir participé !\nTon score : ${score} / ${quizz_film.questions.length}`;
    OptionsContainer.innerHTML = "";
    NextButton.style.display = "none";
    ReplayButton.style.display = "inline-block";
    FeedbackMessage.style.display = "none";

    showGifScore(score);
  }
});

// --- Feature du bouton Replay ---
ReplayButton.addEventListener("click", resetQuiz);

document.getElementById("reset-classement").addEventListener("click", () => {
  localStorage.removeItem("classement");
  alert("Classement réinitialisé !");
});

document.getElementById("show-classement").addEventListener("click", showClassement);

// --- Feature de la pression 'Entrée' sur les différents boutons ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (PseudoContainer.style.display === "block") {
      StartButton.click();
    } else if (ReplayButton.style.display === "inline-block") {
      ReplayButton.click();
    } else if (
      QuestionElement.style.display === "block" &&
      NextButton.style.display !== "none" &&
      !NextButton.disabled
    ) {
      NextButton.click();
    }
  }
});

// --- Initialisation du Quizz ---
resetQuiz();