import {quizz_film } from './questions.js';

const feedbackMessage = document.getElementById('feedback-message');

const canvas = document.querySelector("#confetti");

let timeLeft = 12;
let timerInterval;
const timer = document.getElementById('time');
const timerContainer = document.querySelector('.timer');
const jsConfetti = new JSConfetti();
const replayButton = document.getElementById('replay-button'); // Ajoute un bouton rejouer dans le fichier HTML
const questionElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button'); // Ajoute un bouton dans le fichier HTML
let currentQuestionIndex = 0;
let score = 0; // Met le score à 0 au start.

replayButton.style.display = 'none';

function loadQuestion() {
  clearInterval(timerInterval);
  timeLeft = 12; // Le timer est bien setup à 12s
  timer.textContent = timeLeft;
  startTimer(); // Lance le timer lorsqu'on lance la première question
  feedbackMessage.innerText = '';
  feedbackMessage.style.display = 'none';
  nextButton.disabled = true
  const currentQuestion = quizz_film.questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.text;
  optionsContainer.innerHTML = '';

  currentQuestion.options.forEach(optionText => {
    const optionBtn = document.createElement('button');
    optionBtn.innerText = optionText;
    optionBtn.classList.add('option-button');
    optionsContainer.appendChild(optionBtn);

    optionBtn.addEventListener('click', () => {
    checkAnswer(optionBtn, currentQuestion.correct_answer);
     })
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

// Actions exécutées lors des clicks sur le bouton suivant
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < quizz_film.questions.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);

    timerContainer.style.display = 'none';
// Affiche le message de fin avec le score.
    questionElement.innerText = `C'est fini, merci d'avoir participé ! Ton score total sur ce quizz est de : ${score} / ${quizz_film.questions.length}.`;
    optionsContainer.innerHTML = '';
    nextButton.style.display = 'none';
    replayButton.style.display = 'inline-block'; // Afficher le bouton Rejouer
    feedbackMessage.innerText = '';
    feedbackMessage.style.display = 'none';
  }
});

// Charger la première question au chargement de la page
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, ''); // Supprime la ponctuation
}

// Vérifie la réponse entre la réponse cliquée et la bonne réponse
function checkAnswer(clickedButton, correctAnswer) {
  clearInterval(timerInterval);

  const allButtons = document.querySelectorAll('.option-button');
  
  allButtons.forEach(button => {
    button.disabled = true; // Désactive tous les boutons

    // On compare les réponses et on met une bordure rouge ou verte selon la réponse
    if (normalizeText(button.innerText) === normalizeText(correctAnswer)) {
      button.classList.add('correct');
    
    } else {
      button.classList.add('incorrect');
    }
  })

  // Vérifie d'abord si clickedButton est bien défini
  if (clickedButton) {
    if (normalizeText(clickedButton.innerText) === normalizeText(correctAnswer)) {
      score++;
      jsConfetti.addConfetti().then(() => jsConfetti.addConfetti());

      feedbackMessage.innerText = "Bravo ! Bonne réponse 🎉";
    } else {
      feedbackMessage.innerText = "Dommage, ce n'était pas la bonne réponse.";
    }
    feedbackMessage.style.display = 'block';

  } else {
    // clickedButton est null donc le timer expire et a une incidence pour que ça soit faux 
    feedbackMessage.innerText = "Temps écoulé ! La réponse est considérée comme fausse.";
    feedbackMessage.style.display = 'block';
  }

  nextButton.disabled = false;
}
  // Fonction pour réinitialiser le quizz
  replayButton.addEventListener('click', () => {
  // Réinitialiser l'index 
  currentQuestionIndex = 0;
  score = 0; //Réinitialise le score au redémarrage.
  timeLeft = 12;
  timer.textContent = timeLeft;
  timerContainer.style.display = 'block';
  replayButton.style.display = 'none';
  nextButton.style.display = 'inline-block';
  nextButton.disabled = true;
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

