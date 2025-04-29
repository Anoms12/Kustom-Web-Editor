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

  const newName = fileName.replace(/\.[^/.]+$/, ".zip");
  const zipFile = new File([file], newName, { type: file.type });

  console.log("File is valid. Renamed to:", zipFile.name);

  await unzipZipFile(zipFile);
});

async function unzipZipFile(zipFile) {
  const arrayBuffer = await zipFile.arrayBuffer();
  const zipData = new Uint8Array(arrayBuffer);

  try {
    const files = unzipSync(zipData);

    for (const filename in files) {
      const content = strFromU8(files[filename]);
      console.log(`Unzipped and found: ${filename}:\n${content}\n`);
      await storeUnzippedFiles(files);
    }

    return files;
  } catch (e) {
    console.error("Failed to unzip:", e);
  }
}

async function storeUnzippedFiles(files) {
  const db = await openDB("ZipCacheDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
    },
  });

  for (const [filename, data] of Object.entries(files)) {
    await db.put("files", data, filename);
  }

  console.log("✅ Files stored in IndexedDB");
}
