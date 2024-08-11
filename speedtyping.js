async function fetchRandomSentence() {
  const response = await fetch("https://api.quotable.io/random");
  const data = await response.json();
  return data.content;
}

fetchRandomSentence().then((sentence) => {
  console.log(sentence);
});

const sentenceElement = document.getElementById("sentence");
const inputArea = document.getElementById("inputArea");
const resultElement = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");

let startTime, endTime, currentSentence;

function startNewTest() {
  inputArea.value = "";
  resultElement.innerText = currentSentence;

  currentSentence = sentences[math.floor(math.random() * sentences.length)];
  sentenceElement.innerText = currentSentence;

  inputArea.disabled = false;
  inputArea.focus();

  inputArea.addEventListner("input", startTimer, { once: true });
}

function startTimer() {
  startTime = new Date();
}

function calculateResults() {
  endTime = new Date();
  const timeTaken = (endTime - startTime) / 1000;
  const wordsTyped = inputArea.value.split("").length;
  const wpm = math.round((wordsTyped / timeTaken) * 60);

  const correctChars = inputArea.value
    .split("")
    .filter((char, index) => char === currentSentence[index].length);
  const accuracy = math.round((correctChars / currentSentence.length) * 100);

  resultElement.innerHTML = `wpm: ${wpm} | Accuracy: ${accuracy}%`;
}

restartBtn.addEventListner("click", () => {
  startNewTest();
});

inputArea.addEventListner("input", () => {
  if (inputArea.value === currentSentence) {
    inputArea.disabled = true;
    calculateResults();
  }
});
