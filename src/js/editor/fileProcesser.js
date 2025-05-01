import { openDB } from "https://cdn.skypack.dev/idb";
import { strFromU8 } from "https://cdn.jsdelivr.net/npm/fflate@0.7.4/esm/browser.js";

async function locateFile(name) {
  const db = await openDB("ZipCacheDB", 1);
  const tx = db.transaction("files", "readonly");
  const store = tx.objectStore("files");

  const fileData = await store.get(name);

  if (fileData) {
    const filedata = strFromU8(fileData);
    console.log(`Found Requested File: ${name}:\n${filedata}`);
    console.log("Moving to file type checks...");
    if (name.endsWith(".json")) {
      const jsonData = JSON.parse(filedata);
      console.log("Parsed JSON data:", jsonData);
      console.log(jsonData.preset_root);

      const viewgroup_items = jsonData.preset_root.viewgroup_items;
      for (const item of viewgroup_items) {
        console.log("Viewgroup item:", item);
        function createItems() {
          console.log("Creating items...");
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
              <svg
                  id="item-icon"
                  class="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
              ></svg>    
              <div id="item-info-container" class="container">
                <h3 id="item-name">${item.internal_title ?? item.internal_type}</h3>
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
        createItems();
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
