"use client";

import Dexie from "dexie";
import indexStructure from "../data/index-structure.json";
import filesLength from "../data/files_length.json";

let isDbInitialized = false;
const db = new Dexie("WakfuKiDatabase");

// TODO
// FIX BOUCLIER
// FIX OTHER CATEGORIES
// FEAT CHECK DB DATA VALID ?

const get_db_instance = async function (startIndex) {
  const dbExists = await Dexie.exists("WakfuKiDatabase");
  if (dbExists) {
    let currIndex = startIndex + 1;
    if (isDbInitialized) {
      await db.open();
      return db.open();
    } else if (currIndex < 5) {
      console.log("isDbInitialized false.. retrying...", currIndex);
      get_db_instance(currIndex + 1);
    } else {
      console.log("failed to open instance of DB");
    }
  }
  console.log("DB Does not exists");
};

const setupDatabaseCloseListener = () => {
  window.addEventListener("beforeunload", async () => {
    if (db && db.isOpen()) {
      console.log("Closing the database before unload...");
      db.close();
    }
  });
};

const check_file_length = async (fileName, db) => {
  for (const file in filesLength) {
    if (fileName === file) {
      let expectedItemCount = filesLength[file];
      let count = await db.table(fileName).count();
      if (count == expectedItemCount) {
        // maybe check for random object?
        // console.log(
        //   `Number of records in ${fileName} table: ${count}, expected: ${expectedItemCount}`
        // );
        return true;
      } else {
        console.log(
          `${fileName} Table not valid : expected ${expectedItemCount} length and got : ${count}`
        );
        return false;
      }
    }
  }
  return false;
};

const check_data_exists = async (selectedTypes, index) => {
  let recursionIndex = 0 + index;
  if (recursionIndex < 3) {
    if (selectedTypes) {
      for (let i = 0; i < selectedTypes.length; i++) {
        let storeName = selectedTypes[i] + ".json";
        await db.open();
        if (db.table(storeName)) {
          let isDataValid = await check_file_length(storeName, db);
          if (isDataValid) {
            db.close();
            console.log("Data exists and is valid");
            return true;
          } else {
            console.log(`Data not exists/valid, now trying to store new data for ${storeName}`);
            await store_file(storeName);
            let index = recursionIndex + 1;
            check_data_exists(selectedTypes, index);
          }
        } else {
          console.log("error while checking file length");
          db.close();
          return false;
        }
      }
    }
  } else {
    console.log(
      "Error while trying to fetch and store data in check_data_exists"
    );
    return false;
  }
};

const store_file = async (fileName) => {
  try {
    console.log("fileName received is : ", fileName);
    const response = await fetch(`/api/${fileName}`);
    // console.log("type of response",typeof response);
    const compressedData = await response.arrayBuffer();
    // console.log(compressedData);
    const decompressedBlob = await DecompressBlob(compressedData);
    const text = await blobToText(decompressedBlob);
    // console.log(text.length);
    const jsonDataArray = JSON.parse(text);
    const jsonDataArrayLength = jsonDataArray.length;
    console.log(`"data from ${fileName} : ", ${jsonDataArrayLength}`);
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

async function DecompressBlob(blob) {
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



export {
  initializeDexieDatabase,
  waitForDbInitialization,
  db,
  store_file,
  check_data_exists,
  get_db_instance,
  setupDatabaseCloseListener,
};
