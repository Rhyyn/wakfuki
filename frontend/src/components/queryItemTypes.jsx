import Dexie from "dexie";
import { db } from "./dataService.jsx";

async function fetchItemsById() {
    console.log(db);
    try {
        db.table("states.json").where("definition.id")
            .above(0)
            .limit(20)
            .toArray()
            .then((result) => {
                const ids = result.map((entry) => entry.definition.id);
                console.log(ids);
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    }
}


export default fetchItemsById;
