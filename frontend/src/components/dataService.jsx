"use client";

import Dexie from "dexie";
import indexStructure from "../data/index-structure.json";

const db = new Dexie("WakfuKiDatabase");

const initializeDexieDatabase = async function (fileNames, index = 0) {
    try {
        const dbExists = await Dexie.exists("WakfuKiDatabase");
        if (!dbExists) {
            db.version(1).stores({});
            if (index < fileNames.length) {
                const fileName = fileNames[index];
                const structure = indexStructure[fileName]; // Correct typo

                if (structure) {
                    const db = new Dexie("WakfuKiDatabase");

                    let fields = ["++id"];
                    structure.indexes.forEach((index) => {
                        fields = fields.concat(index.keyPath);
                    });
                    const fieldsString = fields.join(", ");

                    console.log(
                        "initializeDexieDatabase : db versioning + stores for : ",
                        fileName
                    );

                    // Define version for the current file
                    const currentVersion = index + 1;
                    db.version(currentVersion).stores({
                        [fileName]: fieldsString,
                    });

                    console.log(
                        "initializeDexieDatabase : awaiting opening of db for : ",
                        fileName
                    );
                    // Open the database
                    await db.open();

                    console.log(
                        "initializeDexieDatabase : calling fetchAndStoreData for : ",
                        fileName
                    );
                    // Fetch and store data for the current file
                    await fetchAndStoreData(db, fileName);

                    // Close the database after completing operations
                    db.close();
                }

                // Move to the next iteration
                await initializeDexieDatabase(fileNames, index + 1);
            }
        }
    } catch (error) {
        console.error("Error initializing Dexie database:", error);
    }
};

// const initializeDexieDatabase = async function (fileNames) {
//     try {
//         const dbExists = await Dexie.exists("WakfuKiDatabase");
//         if (!dbExists) {
//             for (const fileName of fileNames) {
//                 const index = fileNames.indexOf(fileName);
//                 const structure = indexSructure[fileName];

//                 if (structure) {
//                     // Open a new Dexie instance for each file
//                     const db = new Dexie("WakfuKiDatabase");

//                     let fields = ["++id"];
//                     structure.indexes.forEach((index) => {
//                         fields = fields.concat(index.keyPath);
//                     });
//                     const fieldsString = fields.join(", ");

//                     console.log("db versioning + stores for : ", fileName);
//                     // Define version for the current file
//                     db.version(index + 1).stores({
//                         [fileName]: fieldsString,
//                     });

//                     console.log("awaiting opening of db for : ", fileName);
//                     // Open the database
//                     await db.open();

//                     console.log("calling fetchAndStoreData for : ", fileName);
//                     // Fetch and store data for the current file
//                     await fetchAndStoreData(db, fileName);

//                     // Close the database after completing operations
//                     db.close();
//                 }
//             }
//         }
//     } catch (error) {
//         console.error("Error initializing Dexie database:", error);
//     }
// };

const fetchAndStoreData = async (db, fileName) => {
    // console.log(`fileName is ${fileName}`);
    try {
        const response = await fetch(
            `http://localhost:3001/api/stream/${fileName}`
        );
        const compressedData = await response.arrayBuffer();
        const decompressedBlob = await DecompressBlob(compressedData);
        const text = await blobToText(decompressedBlob);
        const jsonDataArray = JSON.parse(text);

        console.log(fileName);

        // Open a Dexie transaction by getting the table directly
        await db.transaction("rw", db[fileName], async (tx) => {
            console.log(`fetchAndStoreData Opened transaction for ${fileName}`);

            // Clear existing data in the store (if needed)
            await tx[fileName].clear();

            // Insert new data into the store
            await tx[fileName].bulkPut(jsonDataArray);

            console.log(`fetchAndStoreData Data stored for ${fileName}`);
        });
        console.log(`fetchAndStoreData Transaction complete for ${fileName}`);
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

export { db, initializeDexieDatabase };
