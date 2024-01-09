import { useEffect } from "react";
import "../../styles/globals.scss";
import { initializeDexieDatabase } from "../services/data-service.jsx";
import LanguageSwitch from "../components/LanguageSwitch/LanguageSwitch";
import { appWithTranslation } from 'next-i18next';
import { useTranslation } from "next-i18next";

function MyApp({ Component, pageProps }) {
    const fileNames = [
        "states.json",
        "actions.json",
        "blueprints.json",
        "equipmentItemTypes.json",
        "harvestLoots.json",
        "recipes.json",
        "recipeIngredients.json",
        "recipeResults.json",
        "recipeCategories.json",
        "amulette_scrapped_data_formated.json",
        "anneau_scrapped_data_formated.json",
        "cape_scrapped_data_formated.json",
        "bottes_scrapped_data_formated.json",
        "casque_scrapped_data_formated.json",
        "ceinture_scrapped_data_formated.json",
        "epaulettes_scrapped_data_formated.json",
        "plastron_scrapped_data_formated.json",
        "familiers_scrapped_data_formated.json",
        "arme1main_scrapped_data_formated.json",
        "arme2main_scrapped_data_formated.json",
        "secondemain_scrapped_data_formated.json",
        "emblemes_scrapped_data_formated.json",
        "montures_scrapped_data_formated.json",
        "outils_scrapped_data_formated.json",
    ];
    const { i18n } = useTranslation();
    useEffect(() => {
        console.log("MyApp component is mounting or updating...");

        initializeDexieDatabase(fileNames);

        console.log("MyApp component rendering complete.");
    }, [fileNames]);

    return (
        <>
            {/* <LanguageSwitch /> */}
            <Component {...pageProps} />
        </>
    );
}

export default appWithTranslation(MyApp);
