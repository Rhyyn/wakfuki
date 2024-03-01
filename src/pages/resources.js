import { AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useState } from "react";
import cssModule from "../../styles/Resources.module.scss";
import { useDevice } from "../components/Contexts/DeviceContext.js";
import { useGlobalContext } from "../components/Contexts/GlobalContext.js";
import SettingsModal from "../components/SettingsModal/SettingsModal";
import Header from "../components/Header/Header.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import "../config/i18n";

const Resources = () => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { t } = useTranslation();
  const { deviceType } = useDevice();
  const [isMobileFilterShowing, setIsMobileFilterShowing] = useState(false);
  const [isModalShowing, setIsModalShowing] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  const handleMobileNav = () => {
    setIsMobileNavVisible(!isMobileNavVisible);
  };

  return (
    <>
      <Head>
        <title>WakfuKi</title>
        <meta
          name="description"
          content={t("Titre_desc")}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      {isModalShowing && <SettingsModal setIsModalShowing={setIsModalShowing} />}
      <div>
        {(deviceType !== "mobile" || isMobileFilterShowing) && (
          <div>
            <Navbar></Navbar>
            {/* <Filter
              handleStatsChange={handleStatsChange}
              handleResetFilters={handleResetFilters}
              handleSortingOptionsChange={handleSortingOptionsChange}
              resetFiltersFlag={resetFiltersFlag}
              updateStatsFlag={updateStatsFlag}
            ></Filter> */}
          </div>
        )}
        <AnimatePresence>
          {deviceType === "mobile" && isMobileNavVisible && (
            <Navbar isMobileNavVisible={isMobileNavVisible}></Navbar>
          )}
        </AnimatePresence>

        <div className={cssModule["global-container"]}>
          <Header
            setIsModalShowing={setIsModalShowing}
            handleMobileNav={handleMobileNav}
          />
          <div className={cssModule["resources-container"]}>
            <h1>Hello this is Resources</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resources;
