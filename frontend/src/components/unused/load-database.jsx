import Dexie from "dexie";

const loadDatabase = () => {
    const db = new Dexie("WakfuKiDatabase").open();
    console.log("WakfuKiDatabase exists and is currently running version : ", "do it later");
    return db;
};

export default loadDatabase;
