import Dexie from "dexie";
import indexStructure from "../data/index-structure.json";
import filesLength from "../data/files_length.json";
import tablenames from "../data/tablenames.json";

let isDbInitialized = false;
let db = new Dexie("WakfuKiDatabase");

// TODO :
// Add version.json do the DB to check when user loads
// Fix bouclier.json
// Fix sublimations

const sortItemsByLevel = (data, order) => {
  return data.sort((a, b) => {
    const aValue = a.level;
    const bValue = b.level;

    return order === "ascending" ? aValue - bValue : bValue - aValue;
  });
};

const sortItemsAlphabetically = (data, order) => {
  return data.sort((a, b) => {
    const aValue = a.title.fr.toLowerCase();
    const bValue = b.title.fr.toLowerCase();

    return order === "ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });
};

const sortItemsByRarity = (data, order) => {
  return data.sort((a, b) => {
    const aValue = a.baseParams.rarity;
    const bValue = b.baseParams.rarity;

    return order === "ascending" ? aValue - bValue : bValue - aValue;
  });
};

const sortData = (data, sortOption) => {
  if (data && sortOption) {
    const { type, order } = sortOption;
    switch (type) {
      case "level":
        return sortItemsByLevel(data, order);

      case "alphabetical":
        return sortItemsAlphabetically(data, order);

      case "rarity":
        return sortItemsByRarity(data, order);

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
    // .where() does not work because
    // anyOfIgnoreCase does not seem to want to index properly
    // const langIndex = `title.${lang}`;
    // return itemsQuery.where(langIndex).anyOfIgnoreCase(searchQuery);
    return itemsQuery.filter((o) =>
      o.title[lang].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  return itemsQuery;
};

const ComputeRecipe = async (db, itemList) => {
  let recipeResultList = await db
    .table("recipeResults.json")
    .filter((r) => itemList.map((i) => i.id).includes(r.productedItemId))
    .toArray();
  let recipeList = await db
    .table("recipes.json")
    .filter((r) => recipeResultList.map((rr) => rr.recipeId).includes(r.id))
    .toArray();
  let recipeIngredientList = await db
    .table("recipeIngredients.json")
    .filter((ri) => recipeList.map((r) => r.id).includes(ri.recipeId))
    .toArray();
  let recipeAllRessourceList = await db
    .table("allRessources.json")
    .filter((ar) => recipeIngredientList.map((r) => r.itemId).includes(ar.id))
    .toArray();
  let recipeAllEquipmentList = await db
    .table("allItems.json")
    .filter((ae) => recipeIngredientList.map((r) => r.itemId).includes(ae.id))
    .toArray();

  let computedRecipeList = recipeResultList.map((rr) => ({
    itemId: rr.productedItemId,
    recipe: recipeList
      .filter((r) => r.id == rr.recipeId)
      ?.map((r) =>
        recipeIngredientList
          .filter((ri) => ri.recipeId == r.id)
          ?.map((ri) => ({
            quantity: ri.quantity,
            item: recipeAllRessourceList
              .concat(recipeAllEquipmentList)
              .find((ar) => ar.id == ri.itemId),
          }))
      ),
  }));

  return itemList.map((i) => ({
    ...i,
    recipes: computedRecipeList.filter((r) => r.itemId == i.id).flatMap((r) => r.recipe),
  }));
};

const fetchData = async (filterState, currentPage, itemsPerPage, lang) => {
  await waitForDbInitialization();
  try {
    const tableNames = filterState.type.map((obj) => db.table(obj.typeName + ".json"));
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
        const offset = (currentPage - 1) * itemsPerPage;
        const combinedItems = [];

        for (const type of filterState.type) {
          let itemsQuery = db.table(type.typeName + ".json");

          if (offset > 0) {
            itemsQuery = itemsQuery.offset(offset);
          }

          itemsQuery = filterByRarityQuery(itemsQuery, filterState.rarity);

          itemsQuery = filterByLevelRangeQuery(itemsQuery, filterState.levelRange);

          itemsQuery = filterByStatsQuery(itemsQuery, filterState.stats);

          itemsQuery = filterBySearchQuery(itemsQuery, lang, filterState.searchQuery);

          itemsQuery = itemsQuery.limit(itemsPerPage);

          let itemList = await itemsQuery.toArray();

          let itemListWithRecipes = await ComputeRecipe(db, itemList);

          combinedItems.push(itemListWithRecipes);
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
      console.log("expectedItemCount : ", expectedItemCount);
      console.log(`count of ${fileName} : `, count);
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
      // for (let i = 0; i < selectedTypes.length; i++) {
      selectedTypes.forEach(async (obj) => {
        console.log("data ext:", obj.typeName);
        let storeName = obj.typeName + ".json";
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

const storeFile = async (fileName) => {
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

    //TODO: Include in regular routines instead of here
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
  initializeDexieDatabase,
  waitForDbInitialization,
  db,
  storeFile,
  checkDataExists,
  getDBInstance,
  setupDatabaseCloseListener,
  fetchData,
};
