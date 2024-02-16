import React, { useState, useEffect, useRef } from "react";
import cssModule from "./StatsFilter.module.scss";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import stats from "../../../data/stats.json";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { useModal } from "../../ModalComponents/Modal/ModalContext";

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
  const { openModal } = useModal();
  const { closeModal } = useModal();
  const [isDistanceChecked, setIsDistanceChecked] = useState(false);
  const [isMeleeChecked, setIsMeleeChecked] = useState(false);

  useEffect(() => {
    setLang(localStorage.getItem("language"));
  }, [t]);

  const stat_order = [
    31, 41, 191, 160, 1055, 1052, 1053, 1068, 184, 180, 150, 149, 26, 173, 175, 988, 20, 39, 85, 83,
    82, 84, 171, 177, 2001,
  ];

  const handleModal = () => {
    let modalId = openModal(t("maxStatsErrorPrefix"), 3000);
  };

  // triggered when values of stats are changed / deleted by the user
  // inside StatsValuesFilterer.jsx
  useEffect(() => {
    if (!isInitialMount.current) {
      const prevSelectedStatsRefs = [...selectedStatsRefs.current];
      selectedStatsRefs.current = [...globalFilterState.stats];
      prevSelectedStatsRefs.forEach((prevStat) => {
        if (!globalFilterState.stats.some((stat) => stat.property === prevStat.property)) {
          // check if stats are removed
          const element = statsRefs.current[prevStat.property];
          if (element) {
            element.classList.remove(cssModule["selected"]);
          }
        }
      });
    }
  }, [updateStatsFlag]);

  // resets filters
  useEffect(() => {
    if (!isInitialMount.current) {
      selectedStatsRefs.current.forEach((stat) => {
        const element = statsRefs.current[stat.property];
        if (element) {
          element.classList.remove(cssModule["selected"]);
        }
      });
      selectedStatsRefs.current = [];
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

  // handle the selected stats and call the passing function to update Global state
  const handleSelectedStatsRefs = (statID) => {
    let updatedStatsRefs = [...selectedStatsRefs.current]; // this is needed to avoid mutating the state
    const index = updatedStatsRefs.findIndex((stat) => stat.property === statID);
    if (index !== -1) {
      // if the stat exists, remove it || if the stat doesn't exist, add it
      updatedStatsRefs.splice(index, 1);
    } else {
      updatedStatsRefs.push({ property: statID, value: 1 }); // Maybe make property an array ?
    }
    selectedStatsRefs.current = updatedStatsRefs;
    handlePassingStatsChange();

    const statRef = statsRefs.current[statID];
    if (statRef) {
      statRef.classList.toggle(cssModule["selected"]);
    }
  };
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

  const toggle_stat = (e, statID) => {
    handleSelectedStatsRefs(statID);
  };

  const handleClick = (e, statID) => {
    const classList = Array.from(e.currentTarget.classList);
    if (classList.some((className) => className.includes("selected"))) {
      toggle_stat(e, statID);
    } else {
      if (globalFilterState.stats.length + 1 >= 7) {
        handleModal();
      } else {
        toggle_stat(e, statID);
      }
    }
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
              onClick={(e) => handleClick(e, id)}
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
