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

const TypeFilter = ({ resetFiltersFlag, updateStatsFlag }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const isInitialMount = useRef(true);
  const [lang, setLang] = useState();
  const selectedStatsRefs = useRef([]);
  const statsRefs = useRef({});
  const setstatsRefs = (statID, element) => {
    statsRefs.current[statID] = element;
  };

  useEffect(() => {
    setLang(localStorage.getItem("language"));
  }, [t]);

  const stat_order = [
    31, 41, 191, 160, 1055, 1052, 1053, 1068, 184, 180, 150, 149, 26, 173, 175, 988, 20, 39, 85, 83,
    82, 84, 171, 177, 2001,
  ];

  // triggered when values of stats are changed by the user
  // inside StatsValuesFilterer.jsx
  useEffect(() => {
    if (!isInitialMount.current) {
      console.log("updateStatsFlag");
      // needs to iterate differently since {property: X, value: 1}
      const missingElements = selectedStatsRefs.current.filter(
        (element) => !globalFilterState.some((stat) => stat.property === element)
      );

      missingElements.forEach((missingElement) => {
        statsRefs.current[missingElement].classList.toggle(cssModule["selected"]);
      });

      const updatedSelectedStatsRefs = selectedStatsRefs.current.filter((element) =>
        globalFilterState.some((stat) => stat.property === element)
      );

      selectedStatsRefs.current = updatedSelectedStatsRefs;
      selectedStatsConstructedRefs.current = globalFilterState;
    }
  }, [updateStatsFlag]);

  // resets filters
  useEffect(() => {
    if (!isInitialMount.current) {
      console.log("resetFiltersFlag");
      // needs to iterate differently since {property: X, value: 1}
      selectedStatsRefs.current.forEach((element) =>
        statsRefs.current[element].classList.toggle(cssModule["selected"])
      );
      selectedStatsRefs.current = [];
      selectedStatsConstructedRefs.current = [];
      setIsDistanceChecked(false);
      setIsMeleeChecked(false);
    }
  }, [resetFiltersFlag]);

  // used to populate refs on mount, used for mobile filter
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (globalFilterState.stats.length > 0) {
        const updatedRefs = globalFilterState.stats.map((stat) => {
          return stat;
        });

        updatedRefs.forEach((stat) => {
          selectedStatsRefs.current.push(stat);
          const statRef = statsRefs.current[stat.property];
          if (statRef) {
            statRef.classList.toggle(cssModule["selected"]);
          }
        });
      }
    }
  }, []);


  // global state update
  let timer;
  const handlePassingStatsChange = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch({
        type: "UPDATE_STATS",
        payload: selectedStatsRefs.current,
      });
    }, 500);
  };

  // handle the selected stats and call the passing function to update Global state
  const handleSelectedStatsRefs = (statID) => {
    if (globalFilterState.stats.some((stat) => stat.property === statID)) {
      selectedStatsRefs.current = globalFilterState.stats.filter(
        (stat) => stat.property !== statID
      );
    } else {
      selectedStatsRefs.current.push({ property: statID, value: 1 });
    }

    handlePassingStatsChange();

    const statRef = statsRefs.current[statID];
    if (statRef) {
      statRef.classList.toggle(cssModule["selected"]);
    }
  };

  // Used to check distance/melee if multi-elements is selected and vice versa
  // using states because !.includes on refs array doesn't work for some reason
  // this is a hack, probably needs refactoring later
  const [isDistanceChecked, setIsDistanceChecked] = useState(false);
  const [isMeleeChecked, setIsMeleeChecked] = useState(false);
  const toggle_stat = (statID) => {
    const handleAndSet = (statID) => {
      handleSelectedStatsRefs(statID);
      // handleConstructedRefObject(statID);
    };

    if (statID === 1053) {
      if (isDistanceChecked) {
        handleAndSet(statID);
        setIsDistanceChecked(false);
      } else {
        // needs a separate func to check array since {property: X, value: 1}
        if (globalFilterState.stats.some((stat) => stat.property === 1068)) {
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
        if (globalFilterState.stats.some((stat) => stat.property === 1068)) {
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

  const handleClick = (statID) => {
    toggle_stat(statID);
  };

  return (
    <div className={cssModule["type-container"]}>
      <div className={cssModule["horizontal-separator"]}></div>
      <div className={cssModule["type-row-icon-container"]}>
        <span className={cssModule["stat-title"]}>{t("Stats")}</span>
        <div className={cssModule["global-icon-container"]}>
          {stat_order.map((id) => (
            <div
              key={id}
              ref={(element) => setstatsRefs(id, element)}
              className={cssModule["icon-container"]}
              data-id={id}
              onClick={(e) => handleClick(id)}
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
