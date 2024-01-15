import { useEffect } from "react";
import "../../styles/globals.scss";
import { initializeDexieDatabase } from "../services/data-service.jsx";
import { appWithTranslation } from "next-i18next";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

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

function MyApp({ Component, pageProps }) {
  console.log("MyApp component rendered.");
  useEffect(() => {
    console.log("MyApp component is mounting or updating...");

    initializeDexieDatabase(fileNames);

    console.log("MyApp component rendering complete.");

    // console.trace("Stack trace:");
  });

  return (
    <main className={poppins.className}>
      <Component {...pageProps} />
    </main>
  );
}

export default appWithTranslation(MyApp);
