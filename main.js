const grid = document.querySelector(".js-grid");
const colorDropdown = document.querySelector(".js-dropdown");
const rootStyle = document.documentElement.style;

let colorMode = colorDropdown.value;
let size = 16;

function clearGrid() {
  grid.innerHTML = "";
  createGrid(size);
}

function setSize() {
  console.log("SET SIZE");
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

function init() {
  grid.addEventListener("mouseover", updateGridSquare);
  colorDropdown.addEventListener("change", updateColorMode);
  createGrid(size);
}

document.addEventListener("DOMContentLoaded", init);
