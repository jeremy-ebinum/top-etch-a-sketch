const grid = document.querySelector(".js-grid");
const colorDropdown = document.querySelector(".js-dropdown");
const numPicker = document.querySelector(".js-num-picker");
const numPickerInput = document.querySelector(".js-num-picker-input");
const sizeModal = document.querySelector(".js-size-modal");
const rootStyle = document.documentElement.style;
const bodyStyle = document.body.style;

let colorMode = colorDropdown.value;
let size = 16;

function clearAndResizeGrid() {
  grid.innerHTML = "";
  createGrid(size);
}

function openSizeModal() {
  $(".js-size-modal")
    .removeClass("c-size-modal--is-hidden")
    .hide()
    .fadeIn(300);
  numPickerInput.value = size;
  bodyStyle.overflow = "hidden";
}

function closeSizeModal() {
  $(".js-size-modal").fadeOut(200, () => {
    $(this).addClass("c-size-modal--is-hidden");
  });
  bodyStyle.overflow = "";
}

function createGrid(size) {
  rootStyle.setProperty("--grid-cell-num", size);

  for (let i = 0; i < size * size; i++) {
    let gridSquare = document.createElement("div");
    gridSquare.classList = "c-grid__square";
    gridSquare.setAttribute("data-color", "");
    grid.append(gridSquare);
  }
}

function getRandomRange(min, max) {
  return Math.floor(Math.random() * (1 + max - min)) + min;
}

function getRandomHSLColor() {
  const hue = getRandomRange(0, 360);
  const sat = getRandomRange(0, 100);
  const light = getRandomRange(0, 100);

  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

function getSquareColor() {
  switch (colorMode) {
    case "black":
      return "hsl(0, 0%, 0%)";
    case "random":
      return getRandomHSLColor();
  }
}

// Darken the lightness component of the hsl color by 10%;
function darkenColor(color) {
  const re = /(hsl\(\d{1,3}, \d{1,3}%, )(\d{1,3})%\)/;
  let light = parseInt(color.match(re)[2]);

  if (light - 10 > 0) light -= 10;
  else light = 0;

  let darkendedColor = color.replace(re, `$1${light}%)`);

  return darkendedColor;
}

// Set grid square background color based on the data-color attribute
function updateGridSquare(e) {
  const gridSquare = e.target;
  let squareColor = getSquareColor();

  if (colorMode === "black") {
    gridSquare.style.backgroundColor = getSquareColor();
    gridSquare.setAttribute("data-color", "");
  } else if (colorMode === "random") {
    if (gridSquare.dataset.color !== "") {
      squareColor = darkenColor(gridSquare.dataset.color);
    }
    gridSquare.style.backgroundColor = squareColor;
    gridSquare.setAttribute("data-color", squareColor);
  }
}

function updateColorMode(e) {
  colorMode = e.target.value;
}

const increaseNumPickerInputValue = () => {
  let oldValue = parseInt(numPickerInput.value);
  let step = parseInt(numPickerInput.getAttribute("step"));
  let max = parseInt(numPickerInput.getAttribute("max"));
  let newValue;
  let changeEvent = new InputEvent("change", { bubbles: true });

  if (oldValue + step > max) newValue = oldValue;
  else newValue = oldValue + step;

  numPickerInput.value = newValue;
  numPickerInput.dispatchEvent(changeEvent);
};

const decreaseNumPickerInputValue = () => {
  let oldValue = parseInt(numPickerInput.value);
  let step = parseInt(numPickerInput.getAttribute("step"));
  let min = parseInt(numPickerInput.getAttribute("min"));
  let newValue;
  let changeEvent = new InputEvent("change", { bubbles: true });

  if (oldValue - step < min) newValue = oldValue;
  else newValue = oldValue - step;

  numPickerInput.value = newValue;
  numPickerInput.dispatchEvent(changeEvent);
};

function handleSizeModalButtons(e) {
  if (e.target.classList.contains("js-num-picker-inp-up")) {
    e.preventDefault();
  } else if (e.target.classList.contains("js-num-picker-inp-down")) {
    e.preventDefault();
  } else if (e.target.classList.contains("js-close-size-modal")) {
    e.preventDefault();
    closeSizeModal();
  } else if (e.target.classList.contains("js-submit-size")) {
    updateSize(e);
  }
}

function validateNumPickerInput(e) {
  e.target.form.reportValidity();
}

function updateSize(e) {
  e.preventDefault();
  e.target.reportValidity();
  size = parseInt(numPickerInput.value);
  closeSizeModal();
  clearAndResizeGrid();
}

let timeout, interval;

function clearTimers() {
  clearTimeout(timeout);
  clearInterval(interval);
}

function updateNumPickerOnHold(e) {
  e.preventDefault();
  let updateFunc;

  if (e.target.classList.contains("js-num-picker-inp-up")) {
    updateFunc = increaseNumPickerInputValue;
  } else if (e.target.classList.contains("js-num-picker-inp-down")) {
    updateFunc = decreaseNumPickerInputValue;
  }

  updateFunc();

  timeout = setTimeout(function() {
    interval = setInterval(function() {
      updateFunc();
    }, 50);
  }, 300);

  e.target.addEventListener("mouseup", clearTimers);
  e.target.addEventListener("mouseleave", clearTimers);
}

function init() {
  grid.addEventListener("mouseover", updateGridSquare);
  colorDropdown.addEventListener("change", updateColorMode);
  numPickerInput.addEventListener("change", validateNumPickerInput);
  sizeModal.addEventListener("submit", updateSize);
  sizeModal.addEventListener("click", handleSizeModalButtons);
  document.querySelectorAll("[class*='js-num-picker-inp-']").forEach(elem => {
    elem.addEventListener("mousedown", updateNumPickerOnHold);
  });
  createGrid(size);
}

document.addEventListener("DOMContentLoaded", init);
