const diceVisual = document.querySelector('#diceVisual');
const diceValue = document.querySelector('.dice-value');
const resultCaption = document.querySelector('#resultCaption');
const currentType = document.querySelector('#currentType');
const diceCount = document.querySelector('#diceCount');
const countOutput = document.querySelector('#countOutput');
const rollButton = document.querySelector('#rollButton');
const clearButton = document.querySelector('#clearButton');
const historyList = document.querySelector('#historyList');
const emptyState = document.querySelector('#emptyState');
const sideButtons = document.querySelectorAll('.side-button');

let sides = 6;
let history = [];

function randomRoll(max) {
  return Math.floor(Math.random() * max) + 1;
}

function updateCount() {
  const count = Number(diceCount.value);
  countOutput.textContent = `${count} 顆`;
}

function renderHistory() {
  historyList.innerHTML = '';
  if (!history.length) {
    historyList.appendChild(emptyState);
    return;
  }

  history.forEach((entry, index) => {
    const item = document.createElement('article');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="history-index">${String(history.length - index).padStart(2, '0')}</span>
      <strong class="history-result">${entry.total}</strong>
      <span class="history-detail">${entry.rolls.join(' + ')} · D${entry.sides}</span>
    `;
    historyList.appendChild(item);
  });
}

function rollDice() {
  const count = Number(diceCount.value);
  const rolls = Array.from({ length: count }, () => randomRoll(sides));
  const total = rolls.reduce((sum, roll) => sum + roll, 0);

  diceValue.textContent = total;
  resultCaption.textContent = count > 1 ? `${rolls.join(' + ')} = ${total}` : `你擲出了 ${total}`;
  currentType.textContent = `D${sides}`;
  diceVisual.classList.remove('is-rolling');
  void diceVisual.offsetWidth;
  diceVisual.classList.add('is-rolling');

  history.unshift({ total, rolls, sides });
  history = history.slice(0, 8);
  renderHistory();
}

function chooseSides(event) {
  sideButtons.forEach((button) => button.classList.remove('active'));
  event.currentTarget.classList.add('active');
  sides = Number(event.currentTarget.dataset.sides);
  currentType.textContent = `D${sides}`;
}

function clearHistory() {
  history = [];
  renderHistory();
}

diceCount.addEventListener('input', updateCount);
rollButton.addEventListener('click', rollDice);
clearButton.addEventListener('click', clearHistory);
sideButtons.forEach((button) => button.addEventListener('click', chooseSides));
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
    event.preventDefault();
    rollDice();
  }
});

updateCount();
