import { AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useEffect, useState } from "react";
import cssModule from "../../styles/Items.module.scss";
import { useDevice } from "../components/Contexts/DeviceContext";
import { useGlobalContext } from "../components/Contexts/GlobalContext";
import { Filter } from "../components/Filter/Filter.jsx";
import Header from "../components/Header/Header.jsx";
import ItemList from "../components/ItemList/ItemsList.jsx";
import Navbar from "../components/Navbar/Navbar";
import SettingsModal from "../components/SettingsModal/SettingsModal";
import StatsValuesFilterer from "../components/StatsValuesFilterer/StatsValuesFilterer";
import "./i18n";

const Items = () => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { t } = useTranslation();
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
  const [isModalShowing, setIsModalShowing] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  const [resetFiltersFlag, setResetFiltersFlag] = useState(false);
  const handleResetFilters = () => {
    dispatch({
      type: "UPDATE_GLOBAL_globalFilterState",
      payload: {
        searchQuery: "",
        rarity: [],
        levelRange: { from: 0, to: 230 },
        type: [],
        stats: [],
        sortBy: { type: "level", order: "ascending" },
      },
    });
    setResetFiltersFlag(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setResetFiltersFlag(false);
    }, 500);
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
    setUpdateStatsFlag(true);

    dispatch({
      type: "UPDATE_STATS",
      payload: updatedStats,
    });
  };

  const handleMobileNav = () => {
    if (isMobileFilterShowing) {
      setIsMobileFilterShowing(!isMobileFilterShowing);
    }
    setIsMobileNavVisible(!isMobileNavVisible);
  };

  const handleShowFilter = () => {
    if (isMobileNavVisible) {
      setIsMobileNavVisible(!isMobileNavVisible);
    }
    setIsMobileFilterShowing(!isMobileFilterShowing);
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

      {deviceType === "desktop" && (
        <div>
          <Navbar></Navbar>
          <Filter
            handleStatsChange={handleStatsChange}
            handleResetFilters={handleResetFilters}
            handleSortingOptionsChange={handleSortingOptionsChange}
            resetFiltersFlag={resetFiltersFlag}
            updateStatsFlag={updateStatsFlag}
          ></Filter>
        </div>
      )}

      <AnimatePresence>
        {deviceType === "mobile" && isMobileFilterShowing && (
          <div>
            <Filter
              handleStatsChange={handleStatsChange}
              handleResetFilters={handleResetFilters}
              handleSortingOptionsChange={handleSortingOptionsChange}
              resetFiltersFlag={resetFiltersFlag}
              updateStatsFlag={updateStatsFlag}
            ></Filter>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deviceType === "mobile" && isMobileNavVisible && <Navbar></Navbar>}
      </AnimatePresence>

      <div className={cssModule["global-container"]}>
        <Header
          setIsModalShowing={setIsModalShowing}
          handleMobileNav={handleMobileNav}
        />
        <StatsValuesFilterer
          handleStatsValuesFiltererInputChange={handleStatsValuesFiltererInputChange}
          setUpdateStatsFlag={setUpdateStatsFlag}
          setIsMobileFilterShowing={setIsMobileFilterShowing}
          handleShowFilter={handleShowFilter}
          isMobileFilterShowing={isMobileFilterShowing}
          handleResetFilters={handleResetFilters}
        />

        <div
          className={cssModule["item-list"]}
          style={globalFilterState.stats.length > 0 ? { top: "130px" } : { top: "80px" }}
        >
          {globalFilterState.type && globalFilterState.type.length !== 0 && (
            <ItemList resetFiltersFlag={resetFiltersFlag} />
          )}
        </div>
      </div>
    </>
  );
};

export default Items;
