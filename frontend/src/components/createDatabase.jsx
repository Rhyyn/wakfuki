import Dexie from "dexie";


function createDatabase() {
    const db = new Dexie("WakfuKiDatabase")
}

export default db;