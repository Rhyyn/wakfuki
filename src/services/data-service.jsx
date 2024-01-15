"use client";

import Dexie from "dexie";
import indexStructure from "../data/index-structure.json";

let isDbInitialized = false;
const db = new Dexie("WakfuKiDatabase");

// TODO
// Data validation line 52
// Front load + loading screen line 75


const store_file = async (fileName) => {
  try {
    console.log("fileName received is : ", fileName);
    const response = await fetch(`/api/${fileName}`);
    const compressedData = await response.arrayBuffer();
    const decompressedBlob = await DecompressBlob(compressedData);
    const text = await blobToText(decompressedBlob);
    const jsonDataArray = JSON.parse(text);
    console.log("data from bottes file : ", jsonDataArray);
    console.log("calling db.open..");
    await db.open();
    console.log("db now opened");
    console.log(`Transaction called for fileName: ${fileName}`);
    await db.transaction("rw", db.table(fileName), async (tx) => {
      console.log(`Opened transaction for ${fileName}`);

      // Clear existing data in the store (if needed)
      await tx.table(fileName).clear();

      // Insert new data into the store
      await tx.table(fileName).bulkPut(jsonDataArray);

      console.log(`Data stored for ${fileName}`);
    });

    console.log(`Transaction complete for ${fileName}`);
  } catch (error) {
    // console.error(`Error storing ${test}:`, error);
    console.error(`Error storing`, error);
  }
};



const initializeDexieDatabase = async function (fileNames) {
  const dbExists = await Dexie.exists("WakfuKiDatabase");
    
  if (dbExists) {
    console.log("Database exists:", "WakfuKiDatabase");
    // CHECK IF DATA VALID HERE
    // let size = Object.keys(jsonDataArray).length;
    // const db = new Dexie("WakfuKiDatabase");
    isDbInitialized = true;
    console.log("isDbInitialized is now true");
  } else {
    console.log("Database does not exist. Initializing...");
    for (const fileName of fileNames) {
      const index = fileNames.indexOf(fileName) + 1;
      const structure = indexStructure[fileName];

      if (structure) {
        let fields = ["++id"];
        structure.indexes.forEach((index) => {
          fields = fields.concat(index.keyPath);
        });
        const fieldsString = fields.join(", ");

        console.log("db versioning + stores for : ", fileName);
        // Define version for the current file
        db.version(index).stores({
          [fileName]: fieldsString,
        });
        // NEED TO FRONT LOAD FILES :
        // recipeIngredients, recipes, recipeResults, recipeCategories, actions
        // NEED LOADING SCREEN

        // await db.open();
        // console.log(
        //     "calling fetchAndStoreData for : ",
        //     fileName,
        //     "version of the db is : ",
        //     index
        // );
        // await fetchAndStoreData(db, fileName);
        // console.log(
        //     "fetchAndStoreData Processing complete for:",
        //     fileName
        // );
      } else {
        console.log(`Structure not found for ${fileName}`);
      }
      console.log("All files processed");
    }
    db.close();
    isDbInitialized = true;
    console.log("Database closed.");
  }
};



const fetchAndStoreData = async (db, fileName) => {
  try {
    console.log(`fetchAndStoreData called for fileName: ${fileName}`);
    const response = await fetch(`/api/${fileName}`);
    const compressedData = await response.arrayBuffer();
    const decompressedBlob = await DecompressBlob(compressedData);
    const text = await blobToText(decompressedBlob);
    const jsonDataArray = JSON.parse(text);
    await db.transaction("rw", db[fileName], async (tx) => {
      console.log(`fetchAndStoreData Opened transaction for ${fileName}`);

      await tx[fileName].clear();
      await tx[fileName].bulkPut(jsonDataArray);

      console.log(`fetchAndStoreData Data stored for ${fileName}`);
    });
    console.log(`fetchAndStoreData Transaction complete for ${fileName}`);
    db.close();
    return Promise.resolve();
  } catch (error) {
    console.error(`Error fetching/storing ${fileName}:`, error);
  }
};

async function DecompressBlob(blob) {
  const ds = new DecompressionStream("deflate");
  const decompressedArrayBuffer = await new Response(blob).arrayBuffer();
  const decompressedText = await new Response(decompressedArrayBuffer).text();
  return new Blob([decompressedText], { type: "application/json" });
}

async function blobToText(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

const waitForDbInitialization = () => {
  return new Promise((resolve) => {
    const checkInitialization = () => {
      if (isDbInitialized) {
        resolve();
      } else {
        setTimeout(checkInitialization, 100);
      }
    };

    checkInitialization();
  });
};

export { initializeDexieDatabase, waitForDbInitialization, db, store_file };
