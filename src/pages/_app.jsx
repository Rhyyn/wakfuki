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
  "amulette.json",
  "anneau.json",
  "cape.json",
  "bottes.json",
  "casque.json",
  "ceinture.json",
  "epaulettes.json",
  "plastron.json",
  "familiers.json",
  "arme1main.json",
  "arme2main.json",
  "secondemain.json",
  "emblemes.json",
  "montures.json",
  "outils.json",
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
