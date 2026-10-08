const questions = [
  {
    topic: 'QUESTION 01 · CSS',
    text: 'Which CSS feature lets you apply styles only below a certain screen width?',
    answers: ['A CSS animation', 'A media query', 'A pseudo-element', 'A grid template'],
    correct: 1,
    explanation: 'Exactly! A media query can apply styles when a screen matches a width or other condition.'
  },
  {
    topic: 'QUESTION 02 · CSS',
    text: 'What is the best unit for text that should scale with the root font size?',
    answers: ['px', 'vh', 'rem', 'deg'],
    correct: 2,
    explanation: 'That’s right. rem units scale from the root font size, which helps keep type flexible.'
  },
  {
    topic: 'QUESTION 03 · JAVASCRIPT',
    text: 'Which browser function makes a request to a web API?',
    answers: ['querySelector()', 'fetch()', 'addEventListener()', 'localStorage()'],
    correct: 1,
    explanation: 'You got it! fetch() starts a network request and returns a Promise with the response.'
  }
];

const questionNumber = document.querySelector('#question-number');
const questionTotal = document.querySelector('#question-total');
const questionTopic = document.querySelector('#question-topic');
const questionText = document.querySelector('#question-text');
const answerList = document.querySelector('#answer-list');
const quizFeedback = document.querySelector('#quiz-feedback');
const nextButton = document.querySelector('#next-question');
const scoreOutput = document.querySelector('#score');
const progress = document.querySelector('#quiz-progress');
let currentQuestion = 0;
let score = 0;
let answered = false;
let finished = false;

questionTotal.textContent = String(questions.length);

function renderQuestion() {
  const question = questions[currentQuestion];
  answered = false;
  questionNumber.textContent = String(currentQuestion + 1);
  questionTopic.textContent = question.topic;
  questionText.textContent = question.text;
  quizFeedback.textContent = '';
  quizFeedback.classList.remove('wrong');
  nextButton.disabled = true;
  nextButton.innerHTML = currentQuestion === questions.length - 1 ? 'See your result <span>→</span>' : 'Next question <span>→</span>';
  progress.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  answerList.replaceChildren();

  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    button.textContent = answer;
    button.addEventListener('click', () => chooseAnswer(index));
    answerList.append(button);
  });
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  const question = questions[currentQuestion];
  const options = answerList.querySelectorAll('.answer-option');
  options.forEach((option, optionIndex) => {
    option.disabled = true;
    if (optionIndex === question.correct) option.classList.add('correct');
    else if (optionIndex === index) option.classList.add('incorrect');
  });
  if (index === question.correct) {
    score += 1;
    scoreOutput.textContent = String(score);
    quizFeedback.textContent = question.explanation;
    quizFeedback.classList.remove('wrong');
  } else {
    quizFeedback.textContent = `Not quite — ${question.explanation}`;
    quizFeedback.classList.add('wrong');
  }
  nextButton.disabled = false;
}

nextButton.addEventListener('click', () => {
  if (finished) {
    currentQuestion = 0;
    score = 0;
    finished = false;
    scoreOutput.textContent = '0';
    renderQuestion();
    return;
  }
  if (!answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    finished = true;
    questionTopic.textContent = 'YOUR RESULT';
    questionText.textContent = score === questions.length ? 'Perfect score. You’re ready to build something responsive!' : `You scored ${score} out of ${questions.length}. A little practice goes a long way.`;
    answerList.replaceChildren();
    quizFeedback.textContent = 'Want another round? Start the quiz again.';
    quizFeedback.classList.remove('wrong');
    nextButton.innerHTML = 'Play again <span>↻</span>';
  }
});

renderQuestion();

const fetchButton = document.querySelector('#fetch-joke');
const jokeText = document.querySelector('#joke-text');
const apiStatus = document.querySelector('#api-status');
const apiStatusWrap = apiStatus.closest('.api-status');
const fallbackJoke = '<span>Try again in a moment, and the API may be back.</span>';

async function fetchJoke() {
  fetchButton.disabled = true;
  fetchButton.innerHTML = 'Fetching… <span>↻</span>';
  apiStatus.textContent = 'Fetching a fresh joke…';
  apiStatusWrap.classList.add('loading');
  apiStatusWrap.classList.remove('error');
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Programming?type=twopart', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();
    if (data.error || !data.setup || !data.delivery) throw new Error('The API returned no joke.');
    jokeText.replaceChildren(document.createTextNode(data.setup));
    const delivery = document.createElement('span');
    delivery.textContent = data.delivery;
    jokeText.append(document.createElement('br'), delivery);
    apiStatus.textContent = 'Fresh from JokeAPI';
  } catch (error) {
    jokeText.innerHTML = `Couldn't reach the joke API.<br>${fallbackJoke}`;
    apiStatus.textContent = 'Could not connect — check your internet and try again';
    apiStatusWrap.classList.add('error');
  } finally {
    apiStatusWrap.classList.remove('loading');
    fetchButton.disabled = false;
    fetchButton.innerHTML = 'Get another <span>↻</span>';
  }
}

fetchButton.addEventListener('click', fetchJoke);

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuToggle.focus();
  }
});
