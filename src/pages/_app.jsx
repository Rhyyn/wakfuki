import { AnimatePresence, motion } from "framer-motion";
import { appWithTranslation, useTranslation } from "next-i18next";
import { Poppins } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import "../../styles/globals.scss";
import { DeviceProvider } from "../components/Contexts/DeviceContext";
import { GlobalContextProvider } from "../components/Contexts/GlobalContext";
import Modal from "../components/ModalComponents/Modal/Modal";
import { ModalProvider } from "../components/ModalComponents/Modal/ModalContext";
import Spinner from "../components/Spinner/Spinner";
import {
  initializeDexieDatabase,
  setupDatabaseCloseListener,
  waitForDbInitialization,
} from "../services/data-service.jsx";
import { GoogleTagManager } from "@next/third-parties/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

const fileNames = [
  // "states.json",
  // "actions.json",
  // "blueprints.json",
  // "equipmentItemTypes.json", types of items such as wand, ax etc
  // "harvestLoots.json", Jobs gathering items
  "version.json",
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
  "resources.json",
  "allRessources.json",
  "allItems.json",
];

function MyApp({ Component, pageProps }) {
  const { t, i18n } = useTranslation();
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isComponentReady, setIsComponentReady] = useState(false);

  const setLanguageToLocalStorage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    localStorage.setItem("languageSet", "true");
  };

  const setupLanguage = () => {
    const browserLanguage = navigator.language.split("-")[0];
    if (localStorage.getItem("language") !== null) {
      i18n.changeLanguage(localStorage.getItem("language"));
      return;
    } else if (browserLanguage === "fr" || "en") {
      setLanguageToLocalStorage(browserLanguage);
      return;
    } else {
      setLanguageToLocalStorage("en");
      return;
    }
  };

  useEffect(() => {
    console.log("MyApp component is mounting or updating...");
    setupLanguage();
    setIsComponentReady(true);
  }, []);

  useEffect(() => {
    if (isComponentReady) {
      const initializeApp = async () => {
        await initializeDexieDatabase(fileNames);
        await waitForDbInitialization();
        setTimeout(() => {
          setIsDbLoading(false);
          setupDatabaseCloseListener();
          console.log("MyApp component rendered.");
        }, 1000);
      };
      initializeApp();
    }
  }, [isComponentReady]);

  return (
    isComponentReady && (
      <main className={poppins.className}>
        <AnimatePresence>
          {isDbLoading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, transiton: { duration: 1 } }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: isDbLoading ? "block" : "none",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(30, 30, 30, 0.8)",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
                {i18n.language === "en"
                  ? "Hold on, it won't take long..."
                  : "Patientez, ça ne prendra pas longtemps..."}
              </h3>
              <Spinner></Spinner>
            </motion.div>
          )}
        </AnimatePresence>
        <DeviceProvider>
          <GlobalContextProvider>
            <ModalProvider>
              <Component {...pageProps} />
              <GoogleTagManager gtmId="GTM-K8NNNNJX" />
              <Modal />
            </ModalProvider>
          </GlobalContextProvider>
        </DeviceProvider>
      </main>
    )
  );
}

export default appWithTranslation(MyApp);
