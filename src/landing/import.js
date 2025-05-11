import { unzipSync, strFromU8 } from "https://cdn.skypack.dev/fflate";
import { openDB } from "https://cdn.skypack.dev/idb";

const fileInput = document.getElementById("import-file");

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const validExtensions = ["klwp", "kwgt", "kwch", "klck", "komp"];
  const fileName = file.name;
  const extension = fileName.split(".").pop().toLowerCase();

  if (!validExtensions.includes(extension)) {
    alert("Please upload a valid KLWP/KWGT/KWCH/KLCK/KOMP file.");
    return;
  }

  const confirmClear = confirm(
    "Importing a new file will clear any previous files from the editor. If you would like to keep those file please export them in the editor first.\n\nDo you want to continue?"
  );
  if (!confirmClear) {
    console.log("🛑 User canceled file import.");
    fileInput.value = ""; // reset the input to allow re-select
    return;
  }

  const db = await openDB("ZipCacheDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
    },
  });

  await db.clear("files");
  console.log("🧹 Cleared old files from IndexedDB");

  const newName = fileName.replace(/\.[^/.]+$/, ".zip");
  const zipFile = new File([file], newName, { type: file.type });

  console.log("📁 File is valid. Renamed to:", zipFile.name);

  await unzipZipFile(zipFile, db);
});

async function unzipZipFile(zipFile, db) {
  const arrayBuffer = await zipFile.arrayBuffer();
  const zipData = new Uint8Array(arrayBuffer);

  try {
    const files = unzipSync(zipData);

    for (const filename in files) {
      const content = strFromU8(files[filename]);
      console.log(`📦 Unzipped: ${filename}\n${content}\n`);
      await storeUnzippedFiles(files, db);
    }

    return files;
  } catch (e) {
    console.error("❌ Failed to unzip:", e);
  }
}

async function storeUnzippedFiles(files, db) {
  for (const [filename, data] of Object.entries(files)) {
    await db.put("files", data, filename);
  }

  window.location.replace("/src/editor/index.html");
}
