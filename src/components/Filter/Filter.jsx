import React, { useState, useRef, useEffect } from "react";
import cssModule from "./Filter.module.scss";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { RarityFilter } from "./RarityFilter/RarityFilter";
import SearchBar from "./SearchBar/SearchBar";
import LevelFilter from "./LevelFilter/LevelFilter";
import TypeFilter from "./TypeFilter/TypeFilter";
import StatsFilter from "./StatsFilter/StatsFilter";
import { motion, AnimatePresence } from "framer-motion";
import { useDevice } from "../Contexts/DeviceContext";
import { useGlobalContext } from "../Contexts/GlobalContext";

// NEED A WAY TO CHECK IF TABLE OF TYPE IS ALREADY POPULATED
// IF NOT GO POPULATE
// ELSE GO HAM

const Filter = ({
  handleResetFilters,
  handleSortingOptionsChange,
  handleStatsChange,
  resetFiltersFlag,
  updateStatsFlag,
}) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [isComponentReady, setIsComponentReady] = useState(false);
  const { deviceType } = useDevice();
  const isInitialRender = useRef(true);

  useEffect(() => {
    setIsComponentReady(true);
  }, []);

  const handleSortingOptionsClick = (value) => {
    if (value) {
      dispatch({
        type: "UPDATE_SORT_BY",
        payload: { type: value.split(".")[0], order: value.split(".")[1] },
      });
    }
    setShowSortDropdown(false);
  };

  const handleSortingOptionsDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target) &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener("mousedown", handleDocumentClick);
    } else {
      document.removeEventListener("mousedown", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [showSortDropdown]);

  return (
    <motion.div
      key="unique-key"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isComponentReady && (
        <div
          className={cssModule["filter-container"]}
          style={
            deviceType === "mobile" && globalFilterState.stats.length > 3
              ? { top: "140px" }
              : deviceType !== "mobile"
              ? { top: "0px" }
              : { top: "105px" }
          }
        >
          <div className={cssModule["header-container"]}>
            {deviceType !== "mobile" && (
              <h2 className={cssModule["header-title"]}>{t("Filtres")}</h2>
            )}
            {deviceType === "desktop" && (
              <div className={cssModule["header-icons-container"]}>
                <Image
                  className={cssModule["reset-icon"]}
                  src="/reset_icon_yellow.png"
                  width={32}
                  height={32}
                  unoptimized
                  alt="reset-icon"
                  title={t("Mise à zéro des Filtres")}
                  onClick={() => handleResetFilters()}
                />
                <div className={cssModule["vertical-separator"]}></div>
                <Image
                  className={cssModule["sort-icon"]}
                  src="/sort_icon_yellow.png"
                  width={32}
                  height={32}
                  unoptimized
                  alt="sort-icon"
                  title={t("Trier par")}
                  onClick={handleSortingOptionsDropdown}
                  ref={dropdownRef}
                />
                <div
                  className={`${cssModule["sorting-options-container"]} ${
                    showSortDropdown ? cssModule["selected"] : cssModule["hide"]
                  }`}
                  ref={dropdownContainerRef}
                >
                  <span
                    className={cssModule["sorting-option"]}
                    onClick={() => handleSortingOptionsClick("level.ascending")}
                  >
                    {t("level.ascending")}
                  </span>
                  <span
                    className={cssModule["sorting-option"]}
                    onClick={() => handleSortingOptionsClick("level.descending")}
                  >
                    {t("level.descending")}
                  </span>
                  <span
                    className={cssModule["sorting-option"]}
                    onClick={() => handleSortingOptionsClick("rarity.ascending")}
                  >
                    {t("rarity.ascending")}
                  </span>
                  <span
                    className={cssModule["sorting-option"]}
                    onClick={() => handleSortingOptionsClick("rarity.descending")}
                  >
                    {t("rarity.descending")}
                  </span>
                </div>
              </div>
            )}
          </div>
          {deviceType !== "mobile" && <div className={cssModule["horizontal-separator"]}></div>}
          <RarityFilter resetFiltersFlag={resetFiltersFlag} />
          <SearchBar resetFiltersFlag={resetFiltersFlag} />
          <div className={cssModule["horizontal-separator"]}></div>
          <LevelFilter resetFiltersFlag={resetFiltersFlag} />
          <TypeFilter resetFiltersFlag={resetFiltersFlag} />
          <StatsFilter
            handleStatsChange={handleStatsChange}
            resetFiltersFlag={resetFiltersFlag}
            updateStatsFlag={updateStatsFlag}
          />
        </div>
      )}
    </motion.div>
  );
};

export { Filter };
