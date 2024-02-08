import React, { useState, useEffect, useRef } from "react";
import cssModule from "./StatsFilter.module.scss";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import stats from "../../../data/stats.json";
import { useGlobalContext } from "../../Contexts/GlobalContext";

// TODO
// need a max number of selected stats
// need to combine selectedStatsRefs with selectedStatsConstructedRefs
// for better readability - need a way to combine the id with the name for fetch table

const TypeFilter = ({
  handleStatsChange,
  resetFiltersFlag,
  filterStateStats,
  updateStatsFlag,
}) => {
  const { filterState, dispatch } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const isInitialMount = useRef(true);
  const [lang, setLang] = useState();
  const selectedStatsRefs = useRef([]);
  const selectedStatsConstructedRefs = useRef([]);
  const iconsRefs = useRef({});
  const setIconsRefs = (statID, element) => {
    iconsRefs.current[statID] = element;
  };

  useEffect(() => {
    setLang(localStorage.getItem("language"));
  }, [t]);

  const stat_order = [
    31, 41, 191, 160, 1055, 1052, 1053, 1068, 184, 180, 150, 149, 26, 173, 175,
    988, 20, 39, 85, 83, 82, 84, 171, 177, 2001,
  ];


  const handleConstructedRefObject = (statID) => {
    if (selectedStatsConstructedRefs.current.length > 0) {
      const index = selectedStatsConstructedRefs.current.findIndex(
        (element) => element.property === statID
      );

      if (index !== -1) {
        selectedStatsConstructedRefs.current.splice(index, 1);
      } else {
        selectedStatsConstructedRefs.current.push({
          property: statID,
          value: 1,
        });
      }
    } else {
      selectedStatsConstructedRefs.current.push({
        property: statID,
        value: 1,
      });
    }
    handlePassingStatsChange(selectedStatsConstructedRefs.current);
  };

  const handleSelectedStatsRefs = (statID) => {
    if (selectedStatsRefs.current.includes(statID)) {
      selectedStatsRefs.current = selectedStatsRefs.current.filter(
        (value) => value !== statID
      );
    } else {
      selectedStatsRefs.current.push(statID);
    } 

    // {property: X, value: 1}
    dispatch({
      type: "UPDATE_STATS",
      payload: selectedStatsRefs.current,
    });

    const iconRef = iconsRefs.current[statID];
    if (iconRef) {
      iconRef.classList.toggle(cssModule["selected"]);
    }
  };

  // using states because !.includes on refs array doesn't work for some reason
  // this is a hack, probably needs refactoring later
  // Used to check distance/melee if multi-elements is selected and vice versa
  const [isDistanceChecked, setIsDistanceChecked] = useState(false);
  const [isMeleeChecked, setIsMeleeChecked] = useState(false);
  const toggle_stat = (statID) => {
    const handleAndSet = (statID) => {
      handleSelectedStatsRefs(statID);
      handleConstructedRefObject(statID);
    };
    
    if (statID === 1053) {
      if (isDistanceChecked) {
        handleAndSet(statID);
        setIsDistanceChecked(false);
      } else {
        // needs a separate func to check array since {property: X, value: 1}
        if (selectedStatsRefs.current.includes(1068)) {
          handleAndSet(statID);
        } else {
          [1068, statID].forEach(handleAndSet);
        }
        setIsDistanceChecked(true);
      }
    } else if (statID === 1052) {
      if (isMeleeChecked) {
        handleAndSet(statID);
        setIsMeleeChecked(false);
      } else {
        if (selectedStatsRefs.current.includes(1068)) {
          handleAndSet(statID);
        } else {
          [1068, statID].forEach(handleAndSet);
        }
        setIsMeleeChecked(true);
      }
    } else {
      handleAndSet(statID);
    }
  };

  const handleClick = (statID, e) => {
    toggle_stat(statID);
  };

  let timer;
  const handlePassingStatsChange = (newSelectedStats) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleStatsChange(newSelectedStats);
    }, 500);
  };

  useEffect(() => {
    // needs to iterate differently since {property: X, value: 1}
    selectedStatsRefs.current.forEach((element) =>
      iconsRefs.current[element].classList.toggle(cssModule["selected"])
    );
    selectedStatsRefs.current = [];
    selectedStatsConstructedRefs.current = [];
    setIsDistanceChecked(false);
    setIsMeleeChecked(false);
  }, [resetFiltersFlag]);

  useEffect(() => {
    // needs to iterate differently since {property: X, value: 1}
    const missingElements = selectedStatsRefs.current.filter(
      (element) => !filterStateStats.some((stat) => stat.property === element)
    );

    missingElements.forEach((missingElement) => {
      iconsRefs.current[missingElement].classList.toggle(cssModule["selected"]);
    });

    const updatedSelectedStatsRefs = selectedStatsRefs.current.filter(
      (element) => filterStateStats.some((stat) => stat.property === element)
    );

    selectedStatsRefs.current = updatedSelectedStatsRefs;
    selectedStatsConstructedRefs.current = filterStateStats;
  }, [updateStatsFlag]);

  return (
    <div className={cssModule["type-container"]}>
      <div className={cssModule["horizontal-separator"]}></div>
      <div className={cssModule["type-row-icon-container"]}>
        <span className={cssModule["stat-title"]}>{t("Stats")}</span>
        <div className={cssModule["global-icon-container"]}>
          {stat_order.map((id) => (
            <div
              key={id}
              ref={(element) => setIconsRefs(id, element)}
              className={cssModule["icon-container"]}
              data-id={id}
              onClick={(e) => handleClick(id, e)}
              title={lang === "fr" ? stats[id].fr : stats[id].en}
            >
              <Image
                className={cssModule["icon"]}
                src={`/stats/${id}.png`}
                width={24}
                height={24}
                unoptimized
                alt={lang === "fr" ? stats[id].fr : stats[id].en}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeFilter;
