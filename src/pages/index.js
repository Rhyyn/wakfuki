import Head from "next/head";
import { useState, useEffect, useCallback, useRef } from "react";
import cssModule from "../../styles/Home.module.scss";
import { useTranslation } from "next-i18next";
import fetchItemsById from "../components/QueryItemTypes/QueryItemTypes";
import ItemList from "../components/ItemList/ItemsList.jsx";
import { storeFile } from "../services/data-service.jsx";
import { Filter } from "../components/Filter/Filter.jsx";
import Header from "../components/Header/Header.jsx";
import Image from "next/image";
import "./i18n";
import { filter } from "lodash";

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
        (newStat) => !prevState.stats.some((existingStat) => existingStat.property === newStat.property)
      );
  
      const updatedStats = prevState.stats.filter(
        (existingStat) => newStats.some((newStat) => newStat.property === existingStat.property)
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

        <div className={cssModule["global-container"]}>
          <Header />
          <div className={cssModule["items-values-filtering-container"]}>
            <div className={cssModule["items-values-editor-container"]}>
              {filterState.stats &&
                filterState.stats.map((element) => (
                  <div
                    key={element.property}
                    className={cssModule["value-editor"]}
                  >
                    <Image
                      alt={element.property}
                      width={24}
                      height={24}
                      src={`/stats/${element.property}.png`}
                    />
                    <input
                      value={element.value}
                      onChange={(e) => handleInput(e.target.value, element)}
                      className={cssModule["value-input"]}
                    />
                    <Image
                      className={cssModule["cross-icon"]}
                      alt="Delete Icon"
                      width={16}
                      height={16}
                      src="/cross_icon_yellow.png"
                      onClick={() => updateStats(element.property)}
                    />
                  </div>
                ))}
            </div>
            <div className={cssModule["items-sorting-container"]}>
              <Image
                className={cssModule["header-icon"]}
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
                className={cssModule["header-icon"]}
                src="/sort_icon_yellow.png"
                width={32}
                height={32}
                unoptimized
                alt="sort-icon"
                title={t("Trier par")}
                // onClick={handleSortingOptionsDropdown}
                // ref={dropdownRef}
              />
            </div>
          </div>
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
