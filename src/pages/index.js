import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import styles from "../../styles/Home.module.scss";
import { useTranslation } from "next-i18next";
import fetchItemsById from "../components/QueryItemTypes/QueryItemTypes";
import ItemList from "../components/ItemList/ItemsList.jsx";
import { store_file } from "../services/data-service.jsx";
import { Filter } from "../components/Filter/Filter.jsx";
import Header from "../components/Header/Header.jsx";
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
      sortBy: newSortingOption
    }));
    console.log(filterState.sortBy);
  }

  const handleSearchChange = (newSearchQuery) => {
    // console.log("handleSearchChange called");
    setFilterState((prevState) => ({
      ...prevState,
      searchQuery: newSearchQuery,
    }));
  };

  const handleRarityChange = (newRarity) => {
    console.log("handleRarityChange called", newRarity);
    setFilterState((prevState) => ({ ...prevState, rarity: newRarity }));
  };

  const handleLevelChange = (newLevelRange) => {
    // console.log("handleLevelChange called");
    setFilterState((prevState) => ({
      ...prevState,
      levelRange: newLevelRange,
    }));
  };

  const handleTypeChange = (newType) => {
    // console.log("handleTypeChange called");
    setFilterState((prevState) => ({ ...prevState, type: newType }));
    console.log("newType", newType);
  };

  const handleStatsChange = (newStats) => {
    // console.log("handleTypeChange called");
    setFilterState((prevState) => ({ ...prevState, stats: newStats }));
  };

  useEffect(() => {
    console.log("INDEX.JS -- filterState", filterState);
    console.log("INDEX.JS -- filterState.type.length", filterState.type.length);
  }, [filterState]);

  return (
    <>
      <Head>
        <title>WakfuKi</title>
        <meta name="description" content={t("Titre_desc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Filter
          handleLogClick={() => handleLogClick}
          store_file={store_file}
          handleRarityChange={handleRarityChange}
          handleTypeChange={handleTypeChange}
          handleSearchChange={handleSearchChange}
          handleLevelChange={handleLevelChange}
          handleResetFilters={handleResetFilters}
          handleSortingOptionsChange={handleSortingOptionsChange}
          resetFiltersFlag={resetFiltersFlag}
        ></Filter>

        <div className={styles["global-container"]}>
          {/* <Header /> THIS GUY CAUSING BAD RE RENDERS */}
          <div className={styles["item-list"]}>
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
