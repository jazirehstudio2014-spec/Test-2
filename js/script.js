const categories = [
  "Garden",
  "Toys",
  "Antiques",
  "Comics",
  "Sports",
  "Electronics",
  "Refurbished",
  "Fashion",
  "Motors",
  "Collectibles",
  "Home"
];

const list = document.getElementById("categoryList");
const toggleBtn = document.getElementById("toggleBtn");
const nextBtn = document.getElementById("nextBtn");

const activeVisualRow = 2;
const stepDuration = 1100;

let currentIndex = 0;
let timer = null;
let isPlaying = true;

const repeatedCategories = [...categories, ...categories, ...categories];
const baseOffset = categories.length;

function createItem(text) {
  const li = document.createElement("li");
  li.className = "item";
  li.innerHTML = `
    <span class="arrow" aria-hidden="true">→</span>
    <span class="word">${text}</span>
  `;
  return li;
}

function buildList() {
  if (!list) {
    console.error("categoryList not found");
    return;
  }

  repeatedCategories.forEach((category) => {
    list.appendChild(createItem(category));
  });
}

function getRowHeight() {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--row-height")
  );
}

function render() {
  if (!list) return;

  const items = [...list.children];
  const activeAbsoluteIndex = baseOffset + currentIndex;
  const offsetY = (activeAbsoluteIndex - activeVisualRow) * getRowHeight();

  list.style.transform = `translateY(-${offsetY}px)`;

  items.forEach((item, index) => {
    item.classList.remove("active", "d0", "d1", "d2", "d3", "d4");

    const distance = Math.abs(index - activeAbsoluteIndex);

    if (index === activeAbsoluteIndex) {
      item.classList.add("active", "d0");
    } else if (distance === 1) {
      item.classList.add("d1");
    } else if (distance === 2) {
      item.classList.add("d2");
    } else if (distance === 3) {
      item.classList.add("d3");
    } else {
      item.classList.add("d4");
    }
  });
}

function nextStep() {
  currentIndex += 1;

  if (currentIndex >= categories.length) {
    currentIndex = 0;

    list.style.transition = "none";
    render();
    void list.offsetHeight;
    list.style.transition =
      "transform var(--anim-speed) cubic-bezier(0.22, 1, 0.36, 1)";
  }

  requestAnimationFrame(render);
}

function start() {
  stop();
  timer = setInterval(nextStep, stepDuration);
  isPlaying = true;
  if (toggleBtn) toggleBtn.textContent = "Pause";
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isPlaying = false;
  if (toggleBtn) toggleBtn.textContent = "Play";
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    stop();
    nextStep();
  });
}

window.addEventListener("resize", render);

buildList();
render();
start();
