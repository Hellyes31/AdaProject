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

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < quizz_film.questions.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);

    timerContainer.style.display = 'none';

    // Récupére l'ancien classement ou créer un tableau vide
    let classement = JSON.parse(localStorage.getItem('classement')) || [];

    // CLASSEMENT pour enregistrer le score du joueur
    classement.push({ pseudo: pseudo, score: score });

    // Sauvegarde le classement mis à jour dans le localStorage
    localStorage.setItem('classement', JSON.stringify(classement));

    // CLASSEMENT Ranger le score du plus p'tit au plus GRAND
    classement.sort((a, b) => b.score - a.score);
    // Générer le texte du classement
    let classementTexte = "🏆 Classement des joueurs :\n";
    classement.forEach((joueur, index) => {
      classementTexte += `${index + 1}. ${joueur.pseudo} - ${joueur.score} / ${
        quizz_film.questions.length
      }\n`;
    });
    // Affiche le message de fin avec le score.

    questionElement.innerText = `C'est fini, merci ${pseudo} d'avoir participé ! 
    Ton score : ${score} / ${quizz_film.questions.length}`;;
    Welcome.style.display = "none";
    optionsContainer.innerHTML = "";
    nextButton.style.display = "none";
    replayButton.style.display = "inline-block"; // Afficher le bouton Rejouer
    feedbackMessage.innerText = "";
    feedbackMessage.style.display = "none";
    if (score === 0) {
      gifScore0.src = gifScore0.src;
      gifScore0.style.display = "inline-block";
    } else if (score === 10) {
      gifScore10.src = gifScore10.src;
      gifScore10.style.display = "inline-block";
    } else if (score === 8 || score === 9) {
      gifScore8And9.src = gifScore8And9.src;
      gifScore8And9.style.display = "inline-block";
    } else if (score === 6 || score === 7) {
      gifScore6And7.src = gifScore6And7.src;
      gifScore6And7.style.display = "inline-block";
    } else if (score === 5) {
      gifScore5.src = gifScore5.src;
      gifScore5.style.display = "inline-block";
    } else if (score === 3 || score === 4) {
      gifScore3And4.src = gifScore3And4.src;
      gifScore3And4.style.display = "inline-block";
    } else if (score === 1 || score === 2) {
      gifScore1And2.src = gifScore1And2.src;
      gifScore1And2.style.display = "inline-block";
    }
  }
});

// Charger la première question au chargement de la page
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, ""); // Supprime la ponctuation
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