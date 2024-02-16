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
import { useDevice } from "../components/Contexts/DeviceContext";
import { useGlobalContext } from "../components/Contexts/GlobalContext";
import "./i18n";

const Home = () => {
  const { globalFilterState, dispatch } = useGlobalContext();
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

  const handleSortingOptionsChange = (newSortingOption) => {
    console.log(newSortingOption);
    setFilterState((prevState) => ({
      ...prevState,
      sortBy: newSortingOption,
    }));
    console.log(filterState.sortBy);
  };

  const handleStatsChange = (newStats) => {
    console.log("handleStatsChange called with newStats: ", newStats);
    setFilterState((prevState) => {
      const filteredNewStats = newStats.filter(
        (newStat) =>
          !prevState.stats.some((existingStat) => existingStat.property === newStat.property)
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

  useEffect(() => {
    setUpdateStatsFlag(false);
  }, [updateStatsFlag]);

  // this is triggered when values of stats are changed by the user
  const handleStatsValuesFiltererInputChange = (input, inputElement) => {
    const updatedStats = globalFilterState.stats.map((stat) => {
      if (stat.property === inputElement.property) {
        return { ...stat, value: input };
      }
      return stat;
    });
    console.log("bingo");
    setUpdateStatsFlag(true);

    dispatch({
      type: "UPDATE_STATS",
      payload: updatedStats,
    });
  };

  const [isModalShowing, setIsModalShowing] = useState(false);

  // TODO: Fix the filter not loading last state
  // Fix AnimatePresence not working when unmounting

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
          <AnimatePresence>
            <Filter
              handleStatsChange={handleStatsChange}
              handleResetFilters={handleResetFilters}
              handleSortingOptionsChange={handleSortingOptionsChange}
              resetFiltersFlag={resetFiltersFlag}
              updateStatsFlag={updateStatsFlag}
            ></Filter>
          </AnimatePresence>
        )}

        <div className={cssModule["global-container"]}>
          <Header setIsModalShowing={setIsModalShowing} />
          <StatsValuesFilterer
            handleStatsValuesFiltererInputChange={handleStatsValuesFiltererInputChange}
            setUpdateStatsFlag={setUpdateStatsFlag}
            setIsMobileFilterShowing={setIsMobileFilterShowing}
            isMobileFilterShowing={isMobileFilterShowing}
            handleResetFilters={handleResetFilters}
          />

          <div
            className={cssModule["item-list"]}
            style={globalFilterState.stats.length > 0 ? { top: "130px" } : { top: "65px" }}
          >
            {globalFilterState.type && globalFilterState.type.length !== 0 && (
              <ItemList
                key={globalFilterState.type}
                filterState={globalFilterState}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
