import { useState, useRef, useEffect } from "react";
import cssModule from "./Filter.module.scss";
import Image from "next/image";
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
  handleRarityChange,
  handleTypeChange,
  handleSearchChange,
  handleLevelChange,
  handleResetFilters,
  handleSortingOptionsChange,
  resetFiltersFlag,
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const { t, i18n } = useTranslation();

  const handleSortingOptionsClick = (value) => {
    if (value) {
      if (value == "level.ascending") {
        handleSortingOptionsChange({ type: "level", order: "ascending" });
      }
      if (value == "level.descending") {
        handleSortingOptionsChange({ type: "level", order: "descending" });
      }
      if (value == "alphabetical.ascending") {
        handleSortingOptionsChange({
          type: "alphabetical",
          order: "ascending",
        });
      }
      if (value == "alphabetical.descending") {
        handleSortingOptionsChange({
          type: "alphabetical",
          order: "descending",
        });
      }
      if (value == "rarity.ascending") {
        handleSortingOptionsChange({ type: "rarity", order: "ascending" });
      }
      if (value == "rarity.descending") {
        handleSortingOptionsChange({ type: "rarity", order: "descending" });
      }
    }
    setShowSortDropdown(false);
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
  }, []);

  const handleSortingOptionsDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
  };

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
              Level ascending
            </span>
            <span
              className={cssModule["sorting-option"]}
              onClick={() => handleSortingOptionsClick("level.descending")}
            >
              Level descending
            </span>
            <span
              className={cssModule["sorting-option"]}
              onClick={() => handleSortingOptionsClick("alphabetical.ascending")}
            >
              Name ascending
            </span>
            <span
              className={cssModule["sorting-option"]}
              onClick={() => handleSortingOptionsClick("alphabetical.descending")}
            >
              Name descending
            </span>
            <span
              className={cssModule["sorting-option"]}
              onClick={() => handleSortingOptionsClick("rarity.ascending")}
            >
              Rarity ascending
            </span>
            <span
              className={cssModule["sorting-option"]}
              onClick={() => handleSortingOptionsClick("rarity.descending")}
            >
              Rarity descending
            </span>
          </div>
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
