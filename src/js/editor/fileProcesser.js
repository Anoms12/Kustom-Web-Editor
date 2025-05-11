import { openDB } from "https://cdn.skypack.dev/idb";
import { strFromU8 } from "https://cdn.jsdelivr.net/npm/fflate@0.7.4/esm/browser.js";

export let preset_info = null;
export let IMGName = "";

export async function locateFile(name) {
  const db = await openDB("ZipCacheDB", 1);
  const tx = db.transaction("files", "readonly");
  const store = tx.objectStore("files");

  // Add this code to list all files with their contents
  console.log("Listing all files in database:");
  const allFiles = await store.getAll();
  const allKeys = await store.getAllKeys();
  allKeys.forEach((key, index) => {
    console.log(`File: ${key}, Size: ${allFiles[index].length} bytes`);
  });

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
      function setupImages() {}
      function clearDiv() {
        const div = document.getElementById("item-content-container");
        div.innerHTML = "";
      }
      console.log("clearing item container before (re)creating items...");
      await setupCanvas();
      clearDiv();
      // Create new items
      function processItems(items, parentId = "") {
        items.forEach((item, index) => {
          const currentId = parentId
            ? `${parentId}-${index + 1}`
            : `item-${index + 1}`;

          function createItemContent() {
            const div = document.createElement("div");
            div.id = currentId;
            div.className = "container item";
            const itemType = item.internal_type;
            div.setAttribute("type", itemType);
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

          async function createItem() {
            const firstDefined = (...args) => args.find((val) => val != null);
            const displayItem = document.createElement("div");
            displayItem.className = "display-item";
            displayItem.id = currentId;
            displayItem.setAttribute("type", item.internal_type);

            // Initialize styles object before using it
            const styles = {
              width: `${item.shape_width ?? item.bitmap_width}px`,
              height: `${firstDefined(
                item.shape_height,
                item.shape_width,
                item.bitmap_width,
                item.bitmap_height
              )}px`,
              borderRadius: `${item.shape_corners}px`,
              backgroundColor: item.paint_color,
              fontSize: `${item.text_size}px`,
              backgroundSize: "cover",
              backgroundPosition: "center", 
              backgroundRepeat: "no-repeat",
              Display: "block"
            };

            if (item.bitmap_bitmap) {
              const imgpath = item.bitmap_bitmap;
              console.log(`Processing bitmap for ${currentId}:`, imgpath);
              const blobUrl = await processImageFile(imgpath);
              if (blobUrl) {
                styles.backgroundImage = `url("${blobUrl}")`;
                console.log(`Set background image for ${currentId}:`, blobUrl);
              }
            }

            // Only set text content if it exists
            if (item.text_expression) {
              displayItem.textContent = item.text_expression;
            }

            console.log(`Generated styles for ${currentId}:`, styles);
            Object.assign(displayItem.style, styles);
            document.querySelector("#canvas").appendChild(displayItem);
          }

          createItem();
          createItemContent();
          if (item.children && Array.isArray(item.children)) {
            processItems(item.children, currentId);
          }
        });
      }

      processItems(viewgroup_items);
    } else if (!name.includes(".") && name.startsWith("IMG")) {
      console.log("File is an img file.");
      // Update the existing IMGName instead of creating a new one
      IMGName = name + ".png";
      console.log("Renamed to:", IMGName);
    } else {
      console.log(
        "Requested file not found. Please check that file exist and try again."
      );
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

async function processImageFile(name) {
    console.log('Processing image file:', name);
    
    if (!name) {
        console.warn('Image name is undefined or empty');
        return null;
    }

    const fileName = name.split('/').pop().replace('kfile://org.kustom.provider/bitmaps/', '');
    console.log('Extracted filename:', fileName);

    // Check if file exists in database
    const db = await openDB("ZipCacheDB", 1);
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    
    const bitmapPath = `bitmaps/${fileName}`;
    console.log('Looking for bitmap at:', bitmapPath);
    
    const fileData = await store.get(bitmapPath);
    
    if (fileData) {
        console.log("Found bitmap in database, creating blob URL");
        const blob = new Blob([fileData], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
    }
    
    console.log("File not found in database:", {
        searchPath: bitmapPath,
        filename: fileName
    });
    return null;
}
