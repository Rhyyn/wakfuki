import React, { useEffect, useState, useRef } from "react";
import cssModule from "./StatsValuesFilterer.module.scss";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useDevice } from "../Contexts/DeviceContext";
import { useGlobalContext } from "../Contexts/GlobalContext";

// TODO : add sorting dropdown

const StatsValuesFilterer = ({
  setUpdateStatsFlag,
  handleStatsValuesFiltererInputChange,
  setIsMobileFilterShowing,
  isMobileFilterShowing,
  handleResetFilters,
}) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { t } = useTranslation();
  const { deviceType } = useDevice();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isComponentReady, setIsComponentReady] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const [selectedStats, setSelectedStats] = useState([]);

  useEffect(() => {
    setIsComponentReady(true);
  }, []);

  useEffect(() => {
    let newStats = [];
    globalFilterState.stats.forEach((stat) => {
      newStats.push(stat);
    });

    setSelectedStats(newStats);
  }, [globalFilterState.stats]); // this does not trigger for some reason?

  let timer;
  const handleValueInputChange = (value, element) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleStatsValuesFiltererInputChange(value, element);
    }, 500);
  };

  // Update state when user click the cross delete button
  const updateState = (element) => {
    setUpdateStatsFlag(true);
    const newElements = globalFilterState.stats.filter(
      (stat) => stat.property !== element.property
    );
    dispatch({
      type: "UPDATE_STATS",
      payload: newElements,
    });
  };

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
    isComponentReady && (
      <div className={cssModule["items-values-filtering-container"]}>
        <div className={cssModule["items-values-editor-container"]}>
          {selectedStats &&
            selectedStats.length > 0 &&
            selectedStats.map((element) => (
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
                  defaultValue={element.value}
                  onChange={(e) => handleValueInputChange(e.target.value, element)}
                  className={cssModule["value-input"]}
                />
                <Image
                  className={cssModule["cross-icon"]}
                  alt="Delete Icon"
                  width={16}
                  height={16}
                  src="/cross_icon_yellow.png"
                  onClick={() => updateState(element)}
                />
              </div>
            ))}
        </div>
        <div className={cssModule["items-sorting-container"]}>
          {deviceType !== "desktop" && !isMobileFilterShowing && (
            <div className={cssModule["icon-container"]}>
              <Image
                src="/UI-icons/Header/filter-yellow.svg"
                alt="menu icon"
                width={30}
                height={30}
                onClick={() => setIsMobileFilterShowing(!isMobileFilterShowing)}
              />
            </div>
          )}
          {deviceType !== "desktop" && isMobileFilterShowing && (
            <div className={`${cssModule["icon-container"]} ${cssModule["selected"]}`}>
              <Image
                src="/UI-icons/Header/filter-black.svg"
                alt="menu icon"
                width={30}
                height={30}
                onClick={() => setIsMobileFilterShowing(!isMobileFilterShowing)}
              />
            </div>
          )}

          {deviceType != "desktop" && <div className={cssModule["vertical-separator"]}></div>}
          <div className={cssModule["icon-container"]}>
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
          </div>
          <div className={cssModule["vertical-separator"]}></div>
          <div className={cssModule["icon-container"]}>
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
          </div>
        </div>
        <div
          className={`${cssModule["sorting-options-container"]} ${
            showSortDropdown ? cssModule["selected-sort"] : cssModule["hide-sort"]
          }`}
          ref={dropdownContainerRef}
          style={
            deviceType === "mobile" && globalFilterState.stats.length > 0
              ? globalFilterState.stats.length <= 3
                ? { top: "160px", left: "50%", transform: "translateX(-50%)" }
                : { top: "190px", left: "50%", transform: "translateX(-50%)" }
              : { top: "120px", right: "10px" }
          }
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
    )
  );
};

export default StatsValuesFilterer;
