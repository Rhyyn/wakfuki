import { useEffect } from "react";
import "@/styles/globals.scss";
// import fetchAndStoreData from "../components/dataService.jsx"; // Adjust the path accordingly
import { initializeDexieDatabase } from "../components/dataService.jsx";
import fetchItemsByItemTypeId from "../components/queryItemTypes.jsx";
// import openDatabase from "../components/databaseService.jsx";

function MyApp({ Component, pageProps }) {
    // const fileNames = [
    //     "harvestLoots.json",
    //     "items.json",
    //     "jobsItems.json",
    //     "recipeIngredients.json",
    //     "recipeResults.json",
    //     "recipes.json",
    //     "resources.json",
    //     "states.json",
    //     "itemTypes.json",
    //     "actions.json",
    //     "equipmentItemTypes.json",
    //     "blueprints.json",
    //     "recipeCategories.json",
    //     "resourceTypes.json",
    //     "itemProperties.json",
    // ];

    const fileNames = [
        "states.json",
        "items.json",
        "itemStats.json"
    ];

    useEffect(() => {
        // fetchAndStoreData(fileNames);
        initializeDexieDatabase(fileNames);
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;
