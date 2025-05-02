import { openDB } from "https://cdn.skypack.dev/idb";
import { strFromU8 } from "https://cdn.jsdelivr.net/npm/fflate@0.7.4/esm/browser.js";

export let preset_info = null;

export async function locateFile(name) {
  const db = await openDB("ZipCacheDB", 1);
  const tx = db.transaction("files", "readonly");
  const store = tx.objectStore("files");

  const fileData = await store.get(name);

  if (fileData) {
    const filedata = strFromU8(fileData);
    console.log(`Found Requested File: ${name}:\n${filedata}`);
    console.log("Moving to file type checks...");
    if (name.endsWith(".json")) {
      //Setup
      const jsonData = JSON.parse(filedata);
      preset_info = jsonData.preset_info;
      console.log(jsonData.preset_root);
      const viewgroup_items = jsonData.preset_root.viewgroup_items;

      // Functions

      function clearDiv() {
        const div = document.getElementById("item-content-container");
        div.innerHTML = "";
      }
      console.log("clearing item container before (re)creating items...");
      await setupCanvas();
      clearDiv();
      // Create new items
      for (const item of viewgroup_items) {
        console.log("Viewgroup item:", item);
        function createItemContent() {
          const div = document.createElement("div");
          div.id = "item";
          div.className = "container";
          const itemType = item.internal_type;
          div.innerHTML = `
          <div id="left-content-container" class="container">
              <button id="drag-and-drop-function" class="button">
                  <img
                      id="drag-icon"
                      class="icon"
                      src="/src/assets/drag-indicator-icon.svg"
                      alt="Drag indicator"
                  />
              </button>
              <img
                  id="item-icon"
                  class="icon"
                  src="/src/assets/${itemType}.svg"
                  alt=${itemType} //Todo: change to readable text

              />    
              <div id="item-info-container" class="container">
                <h3 id="item-name">${item.internal_title ?? itemType}</h3>
                <h4 id="item-description">${itemType}</h4>
              </div>
          </div>
          <div id="right-content-container" class="container">
              <label class="button">
                  <input id="item-select" type="checkbox" />
              </label>                
          </div>`;

          document.querySelector("#item-content-container").appendChild(div);
        }
        function createItem() {
          const displayItem = document.createElement("div");
          displayItem.className = "display-item";
          displayItem.id = item.internal_type;
          displayItem.textContent = item.text_expression; //TODO: change to readable text when KODE is added
          const styles = {
            width: `${item.shape_width ?? item.bitmap_width}px`,
            height: `${
              item.shape_height ??
              item.shape_width ??
              item.bitmap_height ??
              item.bitmap_width
            }px`,
            borderRadius: `${item.shape_corners}px`,
            backgroundColor: item.paint_color,
            fontSize: `${item.text_size}px`,
          };

          Object.assign(displayItem.style, styles);

          document.querySelector("#canvas").appendChild(displayItem);
        }
        createItem();
        createItemContent();
      }
    } else {
      console.log("File is not a JSON file. Making next file");
    }

    return filedata;
  } else {
    console.warn(
      `${name} was not found in the database. Please check the filename and try again.`
    );
    return null;
  }
}

locateFile("preset.json");

//Prepare canvas for items based off of file extention type
export async function setupCanvas() {
  const canvas = document.querySelector("#canvas");
  const canvasContainer = document.querySelector("#canvas-container");

  const canvasContainerHeight = canvasContainer.clientHeight;
  const scaledHeight = canvasContainerHeight * 0.9;
  const scale = scaledHeight / preset_info.height;

  canvas.style.width = `${preset_info.width}px`;
  canvas.style.height = `${preset_info.height}px`;
  canvas.style.transform = `scale(${scale})`;
}
