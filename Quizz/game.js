import { quizz_film } from "./questions.js";

const feedbackMessage = document.getElementById("feedback-message");

const gifScore0 = document.getElementById("end-gif-score-0");
const gifScore1And2 = document.getElementById("end-gif-score-1-2");
const gifScore3And4 = document.getElementById("end-gif-score-3-4");
const gifScore5 = document.getElementById("end-gif-score-5");
const gifScore6And7 = document.getElementById("end-gif-score-6-7");
const gifScore8And9 = document.getElementById("end-gif-score-8-9");
const gifScore10 = document.getElementById("end-gif-score-10");

const canvas = document.querySelector("#confetti");

let timeLeft = 12;
let timerInterval;
const timer = document.getElementById('time');
const timerContainer = document.querySelector('.timer');
const classement = [];

// Margot - Boîte de dialogue pour le pseudo
const pseudoContainer = document.getElementById("pseudo-container");
const pseudoInput = document.getElementById("pseudo-input");
const startButton = document.getElementById("start-button");

const jsConfetti = new JSConfetti();
const replayButton = document.getElementById("replay-button"); // Ajoute un bouton rejouer dans le fichier HTML
const questionElement = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-button"); // Ajoute un bouton dans le fichier HTML
let currentQuestionIndex = 0;
let score = 0; // Met le score à 0 au start.
let pseudo = '';

// Au début : afficher le pseudo, cacher le reste
pseudoContainer.style.display = "block";
timerContainer.style.display = "none";
questionElement.style.display = "none";
optionsContainer.style.display = "none";
nextButton.style.display = "none";
replayButton.style.display = "none";
feedbackMessage.style.display = "none";

// évènement du bouton "Commencer"
startButton.addEventListener("click", () => {
  pseudo = pseudoInput.value.trim();

  if (pseudo === "") {
    alert("Merci de rentrer un pseudo pour commencer !");
    return;
  }

  //  Afficher le quiz et cacher la boîte pseudo, gérer l'affichage 
  pseudoContainer.style.display = 'none';
  questionElement.style.display = 'block';
  optionsContainer.style.display = 'grid';
  nextButton.style.display = 'inline-block';
  replayButton.style.display = 'none';
  timerContainer.style.display = 'block';

  currentQuestionIndex = 0;
  score = 0;

  loadQuestion();
});

function loadQuestion() {
  clearInterval(timerInterval);
  timeLeft = 12; // Le timer est bien setup à 12s
  timer.textContent = timeLeft;
  startTimer(); // Lance le timer lorsqu'on lance la première question

  feedbackMessage.innerText = "";
  feedbackMessage.style.display = "none";

  nextButton.disabled = true;
  const currentQuestion = quizz_film.questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.text;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((optionText) => {
    const optionBtn = document.createElement("button");
    optionBtn.innerText = optionText;
    optionBtn.classList.add("option-button");
    optionsContainer.appendChild(optionBtn);

    optionBtn.addEventListener("click", () => {
      checkAnswer(optionBtn, currentQuestion.correct_answer);
    });
  });
}

// Lance une fonction timer tout le long du quizz
function startTimer() {
  timerInterval = setInterval(() => {
  timeLeft--;
  timer.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    checkAnswer(null, quizz_film.questions[currentQuestionIndex].correct_answer); // Si pas de réponse à la fin du temps imparti = faux
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
    Ton score : ${score} / ${quizz_film.questions.length} \n\n
    ${classementTexte}`;;

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
  const allButtons = document.querySelectorAll(".option-button");

  allButtons.forEach((button) => {
    button.disabled = true; // Désactive tous les boutons

    if (normalizeText(button.innerText) === normalizeText(correctAnswer)) {
      button.classList.add("correct");
    } else {
      button.classList.add("incorrect");
    }
  });
  if (clickedButton) {
    // Augmente le score de +1 à chaque bonne réponse, pas d'actions si mauvaise réponse.
    if (
      normalizeText(clickedButton.innerText) === normalizeText(correctAnswer)
    ) {
      score++;
    }
    if (
      normalizeText(clickedButton.innerText) === normalizeText(correctAnswer)
    ) {
      jsConfetti.addConfetti();
      feedbackMessage.innerText = "Bravo ! Bonne réponse 🎉";
      feedbackMessage.style.display = "block";
    } else {
      feedbackMessage.innerText = "Dommage, ce n'était pas la bonne réponse.";
      feedbackMessage.style.display = "block";
    }
  } else {
    // clickedButton est null donc le timer expire et a une incidence pour que ça soit faux
    feedbackMessage.innerText =
      "Temps écoulé ! La réponse est considérée comme fausse.";
    feedbackMessage.style.display = "block";
  }

  // Permet de réactiver le bouton suivant lorsque la réponse est cliquée.
  nextButton.disabled = false;
}
  // Fonction pour réinitialiser le quizz
  replayButton.addEventListener('click', () => {
  // Réinitialiser l'index 
  currentQuestionIndex = 0;
  score = 0; //Réinitialise le score au redémarrage.
  timeLeft = 12;
  timer.textContent = timeLeft;
  timerContainer.style.display = "block";
  replayButton.style.display = "none";

  // Gestion de l'affichage pour cacher le quiz
  timerContainer.style.display = "none";
  questionElement.style.display = "none";
  optionsContainer.style.display = "none";
  nextButton.style.display = "none";
  feedbackMessage.style.display = "none";

  // Montrer la boîte pseudo
  pseudoContainer.style.display = "block";
  pseudoInput.value = "";

  gifScore0.style.display = "none"
  gifScore1And2.style.display = "none"
  gifScore3And4.style.display = "none"
  gifScore5.style.display = "none"
  gifScore6And7.style.display = "none"
  gifScore8And9.style.display = "none"
  gifScore10.style.display = "none"
 
  loadQuestion();
  }
  )
  

loadQuestion();

// Permet d'appuyer sur entrée pour lancer le bouton next.
document.addEventListener('keydown', (e) => {
  if (e.key === "Enter" && !nextButton.disabled) {
    nextButton.click();
  } 
});


loadQuestion();

