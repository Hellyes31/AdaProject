import {quizz_film } from './questions.js';

const questionElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button'); // Ajoute un bouton dans le fichier HTML
const replayButton = document.getElementById('replay-button'); // Ajoute un bouton rejouer dans le fichier HTML
let currentQuestionIndex = 0; // Prends le début de l'index des questions au démarrage du quizz.
let score = 0; // Met le score à 0 au start.

replayButton.style.display = 'none';
function loadQuestion() {
  nextButton.disabled = true; // Désactive le bouton suivant au début de chaque question
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

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < quizz_film.questions.length) {
    loadQuestion();
  } else {
    // Affiche le message de fin avec le score.
    questionElement.innerText = `C'est fini, merci d'avoir participé ! Ton score total sur ce quizz est de : ${score} / ${quizz_film.questions.length}.`;
    optionsContainer.innerHTML = '';
    nextButton.style.display = 'none'; // Désactive le bouton Suivant
    replayButton.style.display = 'inline-block'; // Afficher le bouton Rejouer
  }
});

// Charger la première question au chargement de la page
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, ''); // Supprime la ponctuation
}

function checkAnswer(clickedButton, correctAnswer) {
  const allButtons = document.querySelectorAll('.option-button');

  allButtons.forEach(button => {
    button.disabled = true; // Désactive tous les boutons

    if (normalizeText(button.innerText) === normalizeText(correctAnswer)) {
      button.classList.add('correct');
    
    } else {
      button.classList.add('incorrect');
    }
});
  // Augmente le score de +1 à chaque bonne réponse, pas d'actions si mauvaise réponse.
    if (normalizeText(clickedButton.innerText) === normalizeText(correctAnswer)) {
      score++;
    }
  // Permet de réactiver le bouton suivant lorsque la réponse est cliquée.
  nextButton.disabled = false;
};
  // Fonction pour réinitialiser le quizz
  replayButton.addEventListener('click', () => {
  // Réinitialiser l'index 
  currentQuestionIndex = 0;
  score = 0; //Réinitialise le score au redémarrage.

  replayButton.style.display = 'none';
  nextButton.style.display = 'inline-block';

  // Recharger la première question
  loadQuestion();
  });
  
loadQuestion();

