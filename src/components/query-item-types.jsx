import Dexie from "dexie";

async function fetchItemsById(types) {
    const dbExists = await Dexie.exists("WakfuKiDatabase");
    if (dbExists) {
        console.log("Database exists:", "WakfuKiDatabase");

        const db = new Dexie("WakfuKiDatabase");

        try {
            await db.open();
            let itemsQuery = db.table("items.json");
            // let itemStatsQuery = db.table("itemsStats.json");
            // console.log(typeof selectedType);

            try {
                if (types.length > 1) {
                    itemsQuery = itemsQuery
                        .where("definition.item.baseParameters.itemTypeId")
                        .anyOf(types)
                } else {
                    itemsQuery = itemsQuery
                        .where("definition.item.baseParameters.itemTypeId")
                        .equals(types)
                }

                console.log("Executing query:", itemsQuery);
                const itemsData = await itemsQuery.limit(20).toArray();
                console.log("Query results:", itemsData);
            } catch (error) {
                console.error("Error performing query:", error);
            }

            // itemsData.forEach((i) => {
            //     if (i.definition.item.baseParameters.itemTypeId === 304) {
            //         console.log(i);
            //     }
            // })
        } catch (error) {
            console.error("Error performing query:", error);
        } finally {
            db.close();
            console.log("Database closed.");
        }
    } else {
        console.log("db WakfuKitDatabase does not exists");
    }
}

export default fetchItemsById;
