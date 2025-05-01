import { openDB } from 'https://cdn.skypack.dev/idb';
import { strFromU8 } from 'https://cdn.jsdelivr.net/npm/fflate@0.7.4/esm/browser.js';

async function logAllFiles() {
    const db = await openDB('ZipCacheDB', 1);
  
    const tx = db.transaction('files', 'readonly');
    const store = tx.objectStore('files');
  
    const allKeys = await store.getAllKeys();
  
    for (const key of allKeys) {
      const fileData = await store.get(key);
      const content = strFromU8(fileData);
      //console.log(`📁 ${key}:\n${content}`);
    }
  }
  
  logAllFiles();