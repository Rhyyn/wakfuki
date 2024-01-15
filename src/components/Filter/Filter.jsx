import React from "react";
import cssModule from "./Filter.module.scss";
import Image from "next/image";
// import { useTranslation } from 'next-i18next';
import { useTranslation } from "react-i18next";
import { RarityFilter } from "./RarityFilter/RarityFilter";
import SearchBar from "./SearchBar/SearchBar";
import LevelFilter from "./LevelFilter/LevelFilter";
import TypeFilter from "./TypeFilter/TypeFilter";
import StatsFilter from "./StatsFilter/StatsFilter";

// NEED A WAY TO CHECK IF TABLE OF TYPE IS ALREADY POPULATED
// IF NOT GO POPULATE
// ELSE GO HAM

const Filter = ({
  handleLogClick,
  length_recipes,
  store_file,
  handleTypeFilter,
  handleRarityChange,
  handleTypeChange,
  handleSearchChange,
  handleLevelChange,
  handleResetFilters,
  resetFiltersFlag
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={cssModule["filter-container"]}>
      <div className={cssModule["header-container"]}>
        <h2 className={cssModule["header-title"]}>{t("Filtres")}</h2>
        <div className={cssModule["header-icons-container"]}>
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
          />
        </div>
      </div>
      <div className={cssModule["horizontal-separator"]}></div>
      <RarityFilter
        handleRarityChange={handleRarityChange}
        resetFiltersFlag={resetFiltersFlag}
      />
      <SearchBar
        handleSearchChange={handleSearchChange}
        resetFiltersFlag={resetFiltersFlag}
      />
      <div className={cssModule["horizontal-separator"]}></div>
      <LevelFilter
        handleLevelChange={handleLevelChange}
        // handleResetFilters={handleResetFilters}
        resetFiltersFlag={resetFiltersFlag}
      />
      <TypeFilter
        handleTypeChange={handleTypeChange}
        resetFiltersFlag={resetFiltersFlag}
      />
      <StatsFilter />
    </div>
  );
};

export { Filter };
