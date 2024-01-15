"use client";

import Dexie from "dexie";
import indexStructure from "../data/index-structure.json";

const db = new Dexie("WakfuKiDatabase");

async function createDatabase(fileNames, version, setVersion) {
  try {
    // Open the database
    await db.open();
    console.log("Database opened.");

    const createdTables = [];

    // Create a transaction for all tables
    await db.transaction("rw", "meta", async () => {
      // Inside the transaction, define versions for all files
      for (let index = 0; index < fileNames.length; index++) {
        const currentFileName = fileNames[index];
        const structure = indexStructure[currentFileName];

        if (structure) {
          let fields = ["++id"];
          structure.indexes.forEach((index) => {
            fields = fields.concat(index.keyPath);
          });
          const fieldsString = fields.join(", ");

          console.log(
            "createDatabase : db versioning + stores for : ",
            currentFileName
          );

          // Define version for the current file
          db.version(version).stores({
            [currentFileName]: fieldsString,
          });
          createdTables.push(currentFileName);
          setVersion(version + 1);

          console.log(
            "createDatabase : calling fetchAndStoreData for : ",
            currentFileName
          );

          // Fetch and store data for the current file
          await fetchAndStoreData(db, currentFileName);
        }
      }
    });

    // Close the database after processing all files
    db.close();
    console.log("Database closed.");

    // Drop unnecessary tables outside the transaction
    await db.transaction("rw", "meta", async () => {
      const allTables = db.tables.map((table) => table.name);
      const tablesToRemove = allTables.filter(
        (table) => !createdTables.includes(table)
      );
      await Promise.all(
        tablesToRemove.map((table) => db.table(table).delete())
      );
    });

    console.log("Unnecessary tables removed");
  } catch (error) {
    console.error("Error in createDatabase:", error);
  }
}

const fetchAndStoreData = async (currentFileName, db) => {
  try {
    // let db = await new Dexie("WakfuKiDatabase").open();
    console.log("dong");
    const response = await fetch(
      `http://localhost:3001/api/stream/${currentFileName}`
    );
    const compressedData = await response.arrayBuffer();
    const decompressedBlob = await DecompressBlob(compressedData);
    const text = await blobToText(decompressedBlob);
    const jsonDataArray = JSON.parse(text);

    console.log(`fetchAndStoreData : fileName is ${currentFileName}`);

    // Open a Dexie transaction by getting the table directly
    await db.transaction("rw", db[currentFileName], async (tx) => {
      console.log(
        `fetchAndStoreData Opened transaction for ${currentFileName}`
      );

      // Clear existing data in the store (if needed)
      await tx[currentFileName].clear();

      // Insert new data into the store
      await tx[currentFileName].bulkPut(jsonDataArray);

      console.log(`fetchAndStoreData Data stored for ${currentFileName}`);
    });
    console.log(
      `fetchAndStoreData Transaction complete for ${currentFileName}`
    );
    db.close();
    return Promise.resolve();
  } catch (error) {
    console.error(`Error fetching/storing ${currentFileName}:`, error);
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

export { createDatabase, db };
