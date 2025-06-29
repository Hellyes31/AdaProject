import {quizz_film } from './questions.js';

const feedbackMessage = document.getElementById('feedback-message');

const gifScore0 = document.getElementById('end-gif-score-0')
const gifScore1And2 = document.getElementById('end-gif-score-1-2')
const gifScore3 = document.getElementById('end-gif-score-3')
const gifScore4And5 = document.getElementById('end-gif-score-4-5')
const gifScore6 = document.getElementById('end-gif-score-6')

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
    if (score === 0){
      gifScore0.src = gifScore0.src;
      gifScore0.style.display = "inline-block"
    }
    else if (score === 6){
      gifScore6.src = gifScore6.src;
      gifScore6.style.display = "inline-block"
    }
    else if (score === 3){
      gifScore3.src = gifScore3.src;
      gifScore3.style.display = "inline-block"
  }
    else if (score === 1 || score === 2){
      gifScore1And2.src =gifScore1And2.src
      gifScore1And2.style.display = "inline-block"
    }
    else if (score === 4 || score === 5){
      gifScore4And5.src = gifScore4And5.src;
      gifScore4And5.style.display = "inline-block"
  }}
});

// Charger la première question au chargement de la page
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, ''); // Supprime la ponctuation
}

function checkAnswer(clickedButton, correctAnswer) {
  clearInterval(timerInterval);
  const allButtons = document.querySelectorAll('.option-button');
  
  allButtons.forEach(button => {
    button.disabled = true; // Désactive tous les boutons

    if (normalizeText(button.innerText) === normalizeText(correctAnswer)) {
      button.classList.add('correct');

    
    } else {
      button.classList.add('incorrect');
    }
  })
  if (clickedButton) {
      // Augmente le score de +1 à chaque bonne réponse, pas d'actions si mauvaise réponse.
    if (normalizeText(clickedButton.innerText) === normalizeText(correctAnswer)) {
      score++;
    }
        if (normalizeText(clickedButton.innerText) === normalizeText(correctAnswer)) {
    jsConfetti.addConfetti()
    feedbackMessage.innerText = "Bravo ! Bonne réponse 🎉";
    feedbackMessage.style.display = 'block';
  } else {
    feedbackMessage.innerText = "Dommage, ce n'était pas la bonne réponse.";
    feedbackMessage.style.display = 'block';

  }  
} else {
    // clickedButton est null donc le timer expire et a une incidence pour que ça soit faux 
    feedbackMessage.innerText = "Temps écoulé ! La réponse est considérée comme fausse.";
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
  timeLeft = 12;
  timer.textContent = timeLeft;
  timerContainer.style.display = 'block';
  replayButton.style.display = 'none';

  gifScore0.style.display = "none"
  gifScore1And2.style.display = "none"
  gifScore3.style.display = "none"
  gifScore4And5.style.display = "none"
  gifScore6.style.display = "none"
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

