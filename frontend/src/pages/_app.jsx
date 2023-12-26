import { useEffect } from "react";
import "../../styles/globals.scss";
import {initializeDexieDatabase} from "../components/data-service.jsx";

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

    const fileNames = ["states.json", "formatedItems.json", "itemsStats.json"];

    useEffect(() => {
        console.log("MyApp component is mounting or updating...");

        initializeDexieDatabase(fileNames);

        console.log("MyApp component rendering complete.");
    }, [fileNames]);

    return <Component {...pageProps} />;
}

export default MyApp;
