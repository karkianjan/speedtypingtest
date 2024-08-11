async function fetchRandomSentence() {
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_KEY",
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: "Generate a random sentence for a typing test:",
      max_tokens: 20,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

const sentenceElement = document.getElementById("sentence");
const inputArea = document.getElementById("inputArea");
const resultElement = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");

let startTime,
  timerDuration = 30 * 1000,
  timerInterval;

async function startNewTest() {
  clearInterval(timerInterval);
  inputArea.value = "";
  resultElement.innerText = "Your score is....";

  const currentSentence = await fetchRandomSentence();
  sentenceElement.innerText = currentSentence;

  inputArea.disabled = false;
  inputArea.focus();

  startTimer(currentSentence);
}

function startTimer(currentSentence) {
  startTime = new Date();
  timerInterval = setInterval(() => {
    const now = new Date();
    if (now >= new Date(startTime.getTime() + timerDuration)) {
      clearInterval(timerInterval);
      inputArea.disabled = true;
      calculateResults(currentSentence);
    }
  }, 100);
}

function calculateResults(currentSentence) {
  const now = new Date();
  const timeTaken = (now - startTime) / 1000;

  const wordsTyped = inputArea.value.trim().split(/\s+/).length;
  const wpm = Math.round((wordsTyped / timeTaken) * 60);

  const correctChars = [...inputArea.value]
    .slice(0, currentSentence.length)
    .filter((char, index) => char === currentSentence[index]).length;
  const accuracy = Math.round((correctChars / currentSentence.length) * 100);

  resultElement.innerHTML = `WPM: ${wpm} | Accuracy: ${accuracy}%`;
}

restartBtn.addEventListener("click", startNewTest);

inputArea.addEventListener("input", () => {
  const currentSentence = sentenceElement.innerText;
  if (inputArea.value.trim() === currentSentence) {
    clearInterval(timerInterval);
    inputArea.disabled = true;
    calculateResults(currentSentence);
  }
});

document.addEventListener("DOMContentLoaded", startNewTest);
