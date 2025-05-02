import { setupCanvas } from "/src/js/editor/fileProcesser.js";

const navigationContainer = document.getElementById("navigation-container");
const resizer = navigationContainer.querySelector(".resizer");
const canvasContainer = document.getElementById("canvas-container");

document.addEventListener("DOMContentLoaded", () => {
  // Set initial height to 300px if not already set in CSS
  const initialHeight = 300;
  navigationContainer.style.height = `${initialHeight}px`; // Ensure no unexpected space under it
});

let isResizing = false;
let initialMouseY = 0;
let initialNavHeight = 0;

resizer.addEventListener("mousedown", (e) => {
  isResizing = true;
  initialMouseY = e.clientY;
  // Now that an inline style is set, offsetHeight returns the actual height.
  initialNavHeight = navigationContainer.offsetHeight;

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopResize);
  document.addEventListener("mouseleave", stopResize);
});

function handleMouseMove(e) {
  setupCanvas();
  if (!isResizing) return;

  // Inverse movement: dragging down (increasing e.clientY) gives a negative offset.
  const offset = initialMouseY - e.clientY;
  let newHeight = initialNavHeight + offset;

  // Get the latest CSS boundaries
  const computedStyle = window.getComputedStyle(navigationContainer);
  const cssMinHeight = parseInt(computedStyle.minHeight, 10);
  const cssMaxHeight = parseInt(computedStyle.maxHeight, 10);

  // Enforce boundaries.
  if (newHeight < cssMinHeight) newHeight = cssMinHeight;
  if (newHeight > cssMaxHeight) newHeight = cssMaxHeight;

  navigationContainer.style.height = `${newHeight}px`;
  canvasContainer.style.height = `calc(100vh - 50px - ${newHeight}px)`;
}

function stopResize() {
  isResizing = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopResize);
  document.removeEventListener("mouseleave", stopResize);
}
