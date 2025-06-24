import {quizz_film } from './questions.js';

const questionElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button'); // Ajoute un bouton dans le fichier HTML
const replayButton = document.getElementById('replay-button'); // Ajoute un bouton rejouer
let currentQuestionIndex = 0;

function loadQuestion() {
  // Récupérer la question actuelle
  const currentQuestion = quizz_film.questions[currentQuestionIndex];

  // Injecter le texte de la question
  questionElement.innerText = currentQuestion.text;

  // Vider les anciennes options
  optionsContainer.innerHTML = '';

  // Créer les boutons d’options
  currentQuestion.options.forEach(optionText => {
    const optionBtn = document.createElement('button');
    optionBtn.innerText = optionText;
    optionBtn.classList.add('option-button');
    optionsContainer.appendChild(optionBtn);
  });
}

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < quizz_film.questions.length) {
    loadQuestion();
  } else {
    questionElement.innerText = "C'est fini, merci d'avoir participé !";
    optionsContainer.innerHTML = '';
    nextButton.style.display = 'none'; // Afficher le bouton Suivant
    replayButton.style.display = 'inline-block'; // Afficher le bouton Rejouer
  }
});

// Fonction pour réinitialiser le quiz
replayButton.addEventListener('click', () => {
  // Réinitialiser l'index 
  currentQuestionIndex = 0;

  // Cacher le bouton Rejouer et afficher le bouton Suivant
    nextButton.style.display = 'inline-block';
    replayButton.style.display = 'none';
  
  // Recharger la première question
  loadQuestion();
});

loadQuestion();
