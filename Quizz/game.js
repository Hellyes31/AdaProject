import {quizz_film } from './questions.js';

const questionElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button'); // Ajoute un bouton dans le fichier HTML
const replayButton = document.getElementById('replay-button'); // Ajoute un bouton rejouer dans le fichier HTML
let currentQuestionIndex = 0;

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
    questionElement.innerText = "C'est fini, merci d'avoir participé !";
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
  // Permet de réactiver le bouton suivant lorsque la réponse est cliquée.
  nextButton.disabled = false;
  })
};
  // Fonction pour réinitialiser le quizz
  replayButton.addEventListener('click', () => {
  // Réinitialiser l'index 
  currentQuestionIndex = 0;

  replayButton.style.display = 'none';
  nextButton.style.display = 'inline-block';

  // Recharger la première questionAdd commentMore actions
  loadQuestion();
  });


loadQuestion();

