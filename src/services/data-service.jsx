import Dexie from "dexie";
import filesLength from "../data/files_length.json";
import indexStructure from "../data/index-structure.json";

let isDbInitialized = false;
let db = new Dexie("WakfuKiDatabase");

// TODO :
// Fix / Add Sublimations

const sortItemsByLevel = (data, order) => {
  return data.sort((a, b) => {
    const aValue = a.level;
    const bValue = b.level;

    return order === "ascending" ? aValue - bValue : bValue - aValue;
  });
};

const sortData = (data, sortOption) => {
  if (data && sortOption) {
    const { type, order } = sortOption;
    switch (type) {
      case "level":
        return sortItemsByLevel(data, order);
      default:
        console.log("Invalid sorting type");
        return data;
    }
  } else {
    console.log("Invalid data or sort option");
    return data;
  }
};

const filterByRarityQuery = (itemsQuery, rarity) => {
  if (rarity.length > 0) {
    return itemsQuery.filter((o) => o.baseParams.rarity == rarity[0]);
  }
  return itemsQuery;
};

const filterByLevelRangeQuery = (itemsQuery, levelRange) => {
  if (levelRange.from > 0 || levelRange.to < 230) {
    return itemsQuery.filter((o) => o.level >= levelRange.from && o.level <= levelRange.to);
  }
  return itemsQuery;
};

const combineStats = (stats) => {
  const propertyMap = new Map();

  stats.forEach((stat) => {
    propertyMap.set(stat.property, stat.value);
    switch (stat.property) {
      case 1068:
        // Random elements
        propertyMap.set(120, stat.value);
        propertyMap.set(122, stat.value);
        propertyMap.set(123, stat.value);
        propertyMap.set(124, stat.value);
        propertyMap.set(125, stat.value);
        return propertyMap;
      case 1053:
        // Distance
        propertyMap.set(1068, stat.value);
        propertyMap.set(120, stat.value);
        propertyMap.set(122, stat.value);
        propertyMap.set(123, stat.value);
        propertyMap.set(124, stat.value);
        propertyMap.set(125, stat.value);
        return propertyMap;
      case 1052:
        // Melee
        propertyMap.set(1068, stat.value);
        propertyMap.set(120, stat.value);
        propertyMap.set(122, stat.value);
        propertyMap.set(123, stat.value);
        propertyMap.set(124, stat.value);
        propertyMap.set(125, stat.value);
        return propertyMap;
      case 1069:
        // Random Resistance
        propertyMap.set(82, stat.value);
        propertyMap.set(83, stat.value);
        propertyMap.set(84, stat.value);
        propertyMap.set(85, stat.value);
        return propertyMap;
      default:
        return propertyMap;
    }
  });

  return propertyMap;
};

const filterByStatsQuery = (itemsQuery, stats) => {
  if (stats && stats.length > 0) {
    const propertyMap = combineStats(stats);
    return itemsQuery.filter((item) => {
      return [...propertyMap.entries()].some(([property, value]) => {
        return item.equipEffects.some((effect) => {
          const { stats: itemStats } = effect.effect;
          return itemStats.property === property && itemStats.value >= value;
        });
      });
    });
  }
  return itemsQuery;
};

const filterBySearchQuery = (itemsQuery, lang, searchQuery) => {
  if (searchQuery && searchQuery.length > 0) {
    return itemsQuery.filter((o) =>
      o.title[lang].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  return itemsQuery;
};

const filterByTypesQuery = (itemsQuery, type) => {
  if (type) {
    return itemsQuery.filter((o) => type.typesIds.includes(o.baseParams.itemTypeId));
  }
  return itemsQuery;
};

const fetchRecipe = async (item) => {
  await openDB();

  const recipeResultList = await db
    .table("recipeResults.json")
    .where("productedItemId")
    .equals(item.id)
    .toArray();

  if (recipeResultList.length === 0) {
    return undefined;
  }

  const recipeIds = recipeResultList.map((rr) => rr.recipeId);

  const recipeList = await db.table("recipes.json").where("id").anyOf(recipeIds).toArray();

  const recipeIngredientList = await db
    .table("recipeIngredients.json")
    .where("recipeId")
    .anyOf(recipeIds)
    .toArray();

  const itemIds = recipeIngredientList.map((ri) => ri.itemId);

  const recipeAllResourcesList = await db
    .table("allRessources.json")
    .where("id")
    .anyOf(itemIds)
    .toArray();

  const recipeAllItemsList = await db.table("allItems.json").where("id").anyOf(itemIds).toArray();

  const computedRecipeList = recipeResultList.map((rr) => {
    const recipe = recipeList.find((r) => r.id === rr.recipeId);
    const ingredients = recipeIngredientList
      .filter((ri) => ri.recipeId === rr.recipeId)
      .map((ri) => ({
        quantity: ri.quantity,
        item:
          recipeAllResourcesList.find((r) => r.id === ri.itemId) ||
          recipeAllItemsList.find((r) => r.id === ri.itemId),
      }));

    return { itemId: rr.productedItemId, recipe: { ...recipe, ingredients } };
  });

  const completeRecipes = computedRecipeList
    .filter((r) => r.itemId === item.id)
    .map((r) => r.recipe);

  return completeRecipes;
};

const fetchData = async (filterState, currentPage, itemsPerPage, lang, lastSort) => {
  await waitForDbInitialization();
  try {
    const tableNames = filterState.type.map((obj) => db.table(obj.tablename + ".json"));
    tableNames.push(
      "recipeResults.json",
      "recipes.json",
      "recipeIngredients.json",
      "resources.json",
      "allRessources.json",
      "allItems.json"
    );
    await openDB();
    return Promise.resolve(
      await db.transaction("r", tableNames, async () => {
        let offset = 0;
        if (currentPage === 1) {
          // if sortBy different then reset
          offset = 40;
        } else if (lastSort === filterState.sortBy) {
          offset = (currentPage - 1) * itemsPerPage;
        } else {
          offset = 40;
        }

        const combinedItems = [];

        for (const type of filterState.type) {
          let itemsQuery = db.table(type.tablename + ".json");

          let itemsQueryLength = await itemsQuery.count();

          itemsQuery = filterByTypesQuery(itemsQuery, type);

          itemsQuery = await itemsQuery.toArray();

          itemsQuery = sortData(itemsQuery, filterState.sortBy);

          itemsQuery = filterByRarityQuery(itemsQuery, filterState.rarity);

          itemsQuery = filterByLevelRangeQuery(itemsQuery, filterState.levelRange);

          itemsQuery = filterByStatsQuery(itemsQuery, filterState.stats);

          itemsQuery = filterBySearchQuery(itemsQuery, lang, filterState.searchQuery);

          // This is used to properly handle offset for infinite scroll
          // may need a refactor as it is very ugly
          if (offset > 0 && offset < itemsQueryLength && currentPage >= 2) {
            let index = offset + itemsPerPage;
            itemsQuery = itemsQuery.slice(offset, index);
          } else if (offset > itemsQueryLength) {
            // need to handle end of list if no more items
            itemsQuery = itemsQuery.slice(offset - itemsQueryLength);
          } else {
            itemsQuery = itemsQuery.slice(0, itemsPerPage);
          }

          combinedItems.push(itemsQuery);
        }

        const flattenedItems = combinedItems.flat();
        return sortData(flattenedItems, filterState.sortBy);
      })
    );
  } catch (error) {
    console.error(error);
  }
};

const openDB = async () => {
  if (doesDBExists()) {
    try {
      if (!db.isOpen()) {
        db = await db.open();
      }
      return db;
    } catch (error) {
      throw error;
    }
  }
  return null;
};

const doesDBExists = async () => {
  const dbExists = await Dexie.exists("WakfuKiDatabase");
  if (dbExists) {
    return true;
  }
  return false;
};

const getDBInstance = async function (startIndex) {
  if (doesDBExists()) {
    let currIndex = startIndex + 1;
    if (isDbInitialized) {
      let openedDB = openDB();
      return openedDB;
    } else if (currIndex < 5) {
      console.log("isDbInitialized false.. retrying...", currIndex);
      setTimeout(() => {
        getDBInstance(currIndex + 1);
      }, 500);
    } else {
      console.log("failed to open instance of DB");
    }
  }
  console.log("DB Does not exists");
};

const deleteDB = () => {
  if (doesDBExists()) {
    db.delete()
      .then(() => {
        console.log("DB deleted");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        window.location.reload();
      });
  }
};

const closeDB = () => {
  if (doesDBExists()) {
    db.close();
  }
  return null;
};

const setupDatabaseCloseListener = () => {
  window.addEventListener("beforeunload", async () => {
    if (db && db.isOpen()) {
      console.log("Closing the database before unload...");
      db.close();
    }
  });
};

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const checkFileLength = async (fileName, db) => {
  for (const file in filesLength) {
    if (fileName === file) {
      let expectedItemCount = filesLength[file];
      let count = await db.table(fileName).count();
      if (count == expectedItemCount) {
        // TODO : maybe check for random object?
        let randomNumber = random(1, expectedItemCount);
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

const checkDataExists = async (selectedTypes, index) => {
  let recursionIndex = 0 + index;
  if (recursionIndex < 3) {
    if (selectedTypes) {
      selectedTypes.forEach(async (obj) => {
        let storeName = obj.tablename + ".json";
        await db.open();
        if (db.table(storeName)) {
          let isDataValid = await checkFileLength(storeName, db);
          if (isDataValid) {
            db.close();
            console.log("Data exists and is valid");
            return true;
          } else {
            console.log(`Data not exists/valid, now trying to store new data for ${storeName}`);
            await storeFile(storeName);
            let index = recursionIndex + 1;
            checkDataExists(selectedTypes, index);
          }
        } else {
          console.log("error while checking file length");
          db.close();
          return false;
        }
      });
    }
  } else {
    console.log("Error while trying to fetch and store data in checkDataExists");
    return false;
  }
};

// Store the version file for the first time
const storeVersion = async () => {
  await db.open();
  await db.transaction("rw", db.table("version.json"), async (tx) => {
    console.log(`Opened transaction for version.json`);
    await tx.table("version.json").add({ version: 1 });
    console.log(`Transaction for version.json finished`);
  });
};

const storeFile = async (fileName) => {
  try {
    console.log("fileName received is : ", fileName);
    const response = await fetch(`/api/${fileName}`);
    const compressedData = await response.arrayBuffer();
    const decompressedBlob = await DecompressBlob(compressedData);
    const text = await blobToText(decompressedBlob);
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
    console.error(`Error storing`, error);
  }
};

// Used to check that each table has its indexes correctly setup
// NOT TESTED - may cause issues int the future
const checkTableStructure = async (fileName) => {
  const structure = indexStructure[fileName].indexes;
  await openDB();

  const result = await db.transaction("r", db.table(fileName), async (tx) => {
    const indexes = tx.table(fileName).schema.indexes || [];

    if (indexes.length !== structure.length) {
      console.log(`Table Structure of ${fileName} is missing indexes..`);
      return false;
    } else {
      return true;
    }
  });

  return result;
};

const initializeDexieDatabase = async function (fileNames) {
  const dbExists = await Dexie.exists("WakfuKiDatabase");
  if (dbExists) {
    console.log("Database exists:", "WakfuKiDatabase");
    await db.open();
    // check if client DB is up to date
    db.transaction("rw", [db.table("version.json")], async (tx) => {
      let dbVersion = await tx.table("version.json").toArray();
      let currentDevVersion = 1;
      if (dbVersion[0].version !== currentDevVersion) {
        await tx.table("version.json").update(1, { version: currentDevVersion });
        console.log(`DB version changed to ${currentDevVersion} up to date`);
      }
    });
    // check table indexes integrity
    for (const fileName of fileNames) {
      await checkTableStructure(fileName);
    }
    isDbInitialized = true;
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

        db.version(index).stores({
          [fileName]: fieldsString,
        });
      } else {
        console.log(`Structure not found for ${fileName}`);
      }
      console.log("All files processed");
    }

    await storeVersion();
    //TODO: Include in regular routines instead of here
    // Need to check if exists first
    await storeFile("recipes.json");
    await storeFile("recipeCategories.json");
    await storeFile("recipeIngredients.json");
    await storeFile("recipeResults.json");
    await storeFile("resources.json");
    await storeFile("allRessources.json");
    await storeFile("allItems.json");
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
  checkDataExists,
  db,
  deleteDB,
  fetchData,
  fetchRecipe,
  getDBInstance,
  initializeDexieDatabase,
  setupDatabaseCloseListener,
  storeFile,
  waitForDbInitialization,
};
