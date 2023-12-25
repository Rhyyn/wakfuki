"use client";

import Dexie from "dexie";
import indexStructure from "../data/index-structure.json";


let isDbInitialized = false;
const db = new Dexie("WakfuKiDatabase");

const initializeDexieDatabase = async function (fileNames) {
    const dbExists = await Dexie.exists("WakfuKiDatabase");
    if (dbExists) {
        console.log("Database exists:", "WakfuKiDatabase");

        // const db = new Dexie("WakfuKiDatabase");
        isDbInitialized = true;
        console.log("isDbInitialized is now true");
        // --used to debug queries--
        // try {
        //     await db.open();
        //     let itemsQuery = db.table("items.json");
        //     // let itemStatsQuery = db.table("itemsStats.json");
        //     // console.log(typeof selectedType);
        //     let selectedType = [175];

        //     try {
        //         if (selectedType.length > 1) {
        //             itemsQuery = itemsQuery
        //                 .where("definition.item.baseParameters.itemTypeId")
        //                 .anyOf(selectedType);
        //         } else {
        //             itemsQuery = itemsQuery
        //                 .where("definition.item.baseParameters.itemTypeId")
        //                 .equals(selectedType);
        //         }

        //         console.log("Executing query:", itemsQuery);
        //         const itemsData = await itemsQuery.toArray();
        //         console.log("Query results:", itemsData);
        //     } catch (error) {
        //         console.error("Error performing query:", error);
        //     }
        // } catch (error) {
        //     console.error("Error performing query:", error);
        // } finally {
        //     db.close();
        //     console.log("Database closed.");
        // }
    } else {
        // const db = new Dexie("WakfuKiDatabase");

        for (const fileName of fileNames) {
            console.log(fileNames);
            console.log(fileName);
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

                await db.open();
                console.log(
                    "calling fetchAndStoreData for : ",
                    fileName,
                    "version of the db is : ",
                    index
                );
                await fetchAndStoreData(db, fileName);
                console.log(
                    "fetchAndStoreData Processing complete for:",
                    fileName
                );
            } else {
                console.log(`Structure not found for ${fileName}`);
            }
            console.log("All files processed");
        }
        // Close the database after completing operations
        db.close();
        isDbInitialized = true;
        console.log("Database closed.");
    }
};

const fetchAndStoreData = async (db, fileName) => {
    // console.log(`fileName is ${fileName}`);
    try {
        console.log(`fetchAndStoreData called for fileName: ${fileName}`);
        const response = await fetch(
            `https://wakfuki.vercel.app/api/stream/${fileName}`
        );
        const compressedData = await response.arrayBuffer();
        const decompressedBlob = await DecompressBlob(compressedData);
        const text = await blobToText(decompressedBlob);
        const jsonDataArray = JSON.parse(text);
        await db.transaction("rw", db[fileName], async (tx) => {
            console.log(`fetchAndStoreData Opened transaction for ${fileName}`);

            // Clear existing data in the store (if needed)
            await tx[fileName].clear();

            // Insert new data into the store
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

export { initializeDexieDatabase, waitForDbInitialization, db };
