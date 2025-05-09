import { openDB } from "https://cdn.skypack.dev/idb";
import { strFromU8 } from "https://cdn.jsdelivr.net/npm/fflate@0.7.4/esm/browser.js";

export async function setupCanvas(name) {
  if (!name || typeof name !== "string") {
    throw new Error(`Invalid name/key passed to setupCanvas: "${name}"`);
  }

  const db = await openDB("ZipCacheDB", 1);
  const tx = db.transaction("files", "readonly");
  const store = tx.objectStore("files");

  const fileData = await store.get(name);

  const fileText = strFromU8(fileData);

  let jsonData;
  try {
    jsonData = JSON.parse(fileText);
  } catch (err) {
    console.error("Failed to parse JSON:", fileText);
    throw err;
  }

  const preset_info = jsonData.preset_info;
  if (!preset_info || !preset_info.width || !preset_info.height) {
    throw new Error("Missing preset_info or invalid dimensions in JSON.");
  }

  console.log("Setting up canvas...");
  const canvas = document.querySelector("#canvas");
  const canvasContainer = document.querySelector("#canvas-container");

  if (!canvas || !canvasContainer) {
    throw new Error("Canvas or container not found in DOM.");
  }

  const containerHeight = canvasContainer.clientHeight;
  const scale = (containerHeight * 0.8) / preset_info.height;

  canvas.style.width = `${preset_info.width}px`;
  canvas.style.height = `${preset_info.height}px`;
  canvas.style.transform = `scale(${scale})`;
}
