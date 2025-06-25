import {quizz_film } from './questions.js';

const feedbackMessage = document.getElementById('feedback-message');

const canvas = document.querySelector("#confetti");

const jsConfetti = new JSConfetti();
const replayButton = document.getElementById('replay-button'); // Ajoute un bouton rejouer dans le fichier HTML
const questionElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button'); // Ajoute un bouton dans le fichier HTML
let currentQuestionIndex = 0;
let score = 0; // Met le score à 0 au start.

replayButton.style.display = 'none';

function loadQuestion() {
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

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < quizz_film.questions.length) {
    loadQuestion();
  } else {
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

function checkAnswer(clickedButton, correctAnswer) {
  const allButtons = document.querySelectorAll('.option-button');
  
  allButtons.forEach(button => {
    button.disabled = true; // Désactive tous les boutons

    if (normalizeText(button.innerText) === normalizeText(correctAnswer)) {
      button.classList.add('correct');

    
    } else {
      button.classList.add('incorrect');
    }
  })
    // Augmente le score de +1 à chaque bonne réponse, pas d'actions si mauvaise réponse.
    if (normalizeText(clickedButton.innerText) === normalizeText(correctAnswer)) {
      score++;
    }
        if (normalizeText(clickedButton.innerText) === normalizeText(correctAnswer)) {
    jsConfetti.addConfetti().then(() => jsConfetti.addConfetti());
    feedbackMessage.innerText = "Bravo ! Bonne réponse 🎉";
    feedbackMessage.style.display = 'block';
  } else {
    feedbackMessage.innerText = "Dommage, ce n'était pas la bonne réponse.";
    feedbackMessage.style.display = 'block';

  }

  // Permet de réactiver le bouton suivant lorsque la réponse est cliquée.
  nextButton.disabled = false;
}
  // Fonction pour réinitialiser le quizz
  replayButton.addEventListener('click', () => {
  // Réinitialiser l'index 
  currentQuestionIndex = 0;
  score = 0; //Réinitialise le score au redémarrage.

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
