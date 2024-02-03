import Head from "next/head";
import { useState, useEffect, useCallback, useRef } from "react";
import cssModule from "../../styles/Home.module.scss";
import { useTranslation } from "next-i18next";
import fetchItemsById from "../components/QueryItemTypes/QueryItemTypes";
import ItemList from "../components/ItemList/ItemsList.jsx";
import { storeFile } from "../services/data-service.jsx";
import { Filter } from "../components/Filter/Filter.jsx";
import Header from "../components/Header/Header.jsx";
import StatsValuesFilterer from "../components/StatsValuesFilterer/StatsValuesFilterer";
import SettingsModal from "../components/SettingsModal/SettingsModal";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useDevice } from "../components/DeviceContext/DeviceContext";
import "./i18n";

const Home = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(null);
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    rarity: [],
    levelRange: { from: 0, to: 230 },
    type: [],
    stats: [],
    sortBy: { type: "level", order: "ascending" },
  });
  const { deviceType } = useDevice();
  const [isMobileFilterShowing, setIsMobileFilterShowing] = useState(false);

  const [resetFiltersFlag, setResetFiltersFlag] = useState(false);
  const handleResetFilters = () => {
    console.log("handleResetFilters called");
    setFilterState({
      searchQuery: "",
      rarity: [],
      levelRange: { from: 0, to: 230 },
      type: [],
      stats: [],
      sortBy: { type: "level", order: "ascending" },
    });
    setResetFiltersFlag(true);
  };

  useEffect(() => {
    setResetFiltersFlag(false);
  }, [resetFiltersFlag]);

  const handleLogClick = async () => {
    try {
      fetchItemsById();
    } catch (error) {
      console.error("Error fetching and processing data:", error);
    }
  };

  const handleSortingOptionsChange = (newSortingOption) => {
    console.log(newSortingOption);
    setFilterState((prevState) => ({
      ...prevState,
      sortBy: newSortingOption,
    }));
    console.log(filterState.sortBy);
  };

  const handleSearchChange = (newSearchQuery) => {
    setFilterState((prevState) => ({
      ...prevState,
      searchQuery: newSearchQuery,
    }));
  };

  const handleRarityChange = (newRarity) => {
    setFilterState((prevState) => ({ ...prevState, rarity: newRarity }));
  };

  const handleLevelChange = (newLevelRange) => {
    console.log(newLevelRange);
    setFilterState((prevState) => ({
      ...prevState,
      levelRange: newLevelRange,
    }));
  };

  const handleTypeChange = (newType) => {
    setFilterState((prevState) => ({ ...prevState, type: newType }));
  };

  const handleStatsChange = (newStats) => {
    setFilterState((prevState) => {
      const filteredNewStats = newStats.filter(
        (newStat) =>
          !prevState.stats.some(
            (existingStat) => existingStat.property === newStat.property
          )
      );

      const updatedStats = prevState.stats.filter((existingStat) =>
        newStats.some((newStat) => newStat.property === existingStat.property)
      );

      const finalStats = [...updatedStats, ...filteredNewStats];

      return {
        ...prevState,
        stats: finalStats,
      };
    });
  };

  const [updateStatsFlag, setUpdateStatsFlag] = useState(false);
  const updateStats = (elementProperty) => {
    const updatedStats = filterState.stats.filter(
      (stat) => stat.property !== elementProperty
    );

    setFilterState((prevFilterState) => ({
      ...prevFilterState,
      stats: updatedStats,
    }));
    setUpdateStatsFlag(true);
  };

  useEffect(() => {
    setUpdateStatsFlag(false);
  }, [updateStatsFlag]);

  const handleInput = (input, inputElement) => {
    const updatedStats = filterState.stats.map((element) => {
      if (element.property === inputElement.property) {
        return { ...element, value: input };
      }
      return element;
    });

    setFilterState({ ...filterState, stats: updatedStats });
  };

  const [isModalShowing, setIsModalShowing] = useState(false);
  const handleCogClick = () => {
    setIsModalShowing(true);
  };

  return (
    <>
      <Head>
        <title>WakfuKi</title>
        <meta name="description" content={t("Titre_desc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isModalShowing && (
        <SettingsModal setIsModalShowing={setIsModalShowing} />
      )}
      <div>
        <AnimatePresence>
          {(deviceType !== "mobile" || isMobileFilterShowing) && (
            <Filter
              storeFile={storeFile}
              handleRarityChange={handleRarityChange}
              handleTypeChange={handleTypeChange}
              handleSearchChange={handleSearchChange}
              handleLevelChange={handleLevelChange}
              handleResetFilters={handleResetFilters}
              handleSortingOptionsChange={handleSortingOptionsChange}
              handleStatsChange={handleStatsChange}
              resetFiltersFlag={resetFiltersFlag}
              filterStateStats={filterState.stats}
              updateStatsFlag={updateStatsFlag}
            ></Filter>
          )}
        </AnimatePresence>

        <div className={cssModule["global-container"]}>
          <Header setIsModalShowing={setIsModalShowing} />
          <StatsValuesFilterer
            stats={filterState.stats}
            updateStats={updateStats}
            handleInput={handleInput}
            setIsMobileFilterShowing={setIsMobileFilterShowing}
            isMobileFilterShowing={isMobileFilterShowing}
          />

          <div className={cssModule["item-list"]}>
            {filterState.type && filterState.type.length !== 0 && (
              <ItemList key={filterState.type} filterState={filterState} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
