import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDevice } from "../Contexts/DeviceContext";
import { useGlobalContext } from "../Contexts/GlobalContext";
import cssModule from "./Filter.module.scss";
import LevelFilter from "./LevelFilter/LevelFilter";
import { RarityFilter } from "./RarityFilter/RarityFilter";
import SearchBar from "./SearchBar/SearchBar";
import StatsFilter from "./StatsFilter/StatsFilter";
import TypeFilter from "./TypeFilter/TypeFilter";

const Filter = ({ handleResetFilters, handleStatsChange, resetFiltersFlag, updateStatsFlag }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [isComponentReady, setIsComponentReady] = useState(false);
  const { deviceType } = useDevice();
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

  return deviceType === "mobile" ? (
    <motion.div
      key="unique-key"
      initial={{
        opacity: 0,
        y: -100,
        transition: { duration: 0.3 },
      }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100, transition: { duration: 0.3 } }}
    >
      {isComponentReady && (
        <div
          className={cssModule["filter-container"]}
          style={
            deviceType === "mobile" && globalFilterState.stats.length > 3
              ? { top: "140px" }
              : deviceType !== "mobile"
              ? { top: "60px" }
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
  ) : (
    isComponentReady && (
      <motion.div
        key="unique-key"
        initial={{
          opacity: 0,
          y: 0,
          x: -10,
          transition: { duration: 0.3 },
        }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        className={cssModule["filter-container"]}
        style={
          deviceType === "mobile" && globalFilterState.stats.length > 3
            ? { top: "140px" }
            : deviceType !== "mobile"
            ? { top: "60px" }
            : { top: "105px" }
        }
      >
        <div className={cssModule["header-container"]}>
          {deviceType !== "mobile" && <h2 className={cssModule["header-title"]}>{t("Filtres")}</h2>}
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
      </motion.div>
    )
  );
};

export { Filter };
