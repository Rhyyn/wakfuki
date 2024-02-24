import React, { useState, useEffect, useRef } from "react";
import cssModule from "./StatsFilter.module.scss";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { useDevice } from "../../Contexts/DeviceContext";
import { useModal } from "../../ModalComponents/Modal/ModalContext";
import all_positives_stats from "../../../data/all_positives_stats.json";
import all_negatives_stats from "../../../data/all_negatives_stats.json";

const TypeFilter = ({ resetFiltersFlag, updateStatsFlag }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { deviceType } = useDevice();
  const { t, i18n } = useTranslation();
  const isInitialMount = useRef(true);
  const [lang, setLang] = useState();
  const selectedStatsRefs = useRef([]);
  const statsRefs = useRef({});
  const setstatsRefs = (statID, element) => {
    statsRefs.current[statID] = element;
  };
  const { openModal } = useModal();
  const selectBtnRef = useRef(null);
  const customDropdownRef = useRef(null);
  const selectDropdownRef = useRef(null);
  const isDropdownOpen = useRef(false);

  useEffect(() => {
    setLang(localStorage.getItem("language"));
  }, [t]);

  const stat_order = [31, 41, 191, 160, 1055, 1052, 1053, 1068, 184, 180, 150, 149];

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
          if (element && element.nodeName === "DIV") {
            element.classList.remove(cssModule["selected"]);
          } else if (element && element.nodeName === "INPUT") {
            element.checked = !element.checked;
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
        if (element && element.nodeName === "DIV") {
          element.classList.remove(cssModule["selected"]);
        } else if (element && element.nodeName === "INPUT") {
          element.checked = !element.checked;
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
          if (statRef && statRef.nodeName === "DIV") {
            console.log("statRef", statRef);
            statRef.classList.add(cssModule["selected"]);
          } else if (statRef && statRef.nodeName === "INPUT") {
            statRef.checked = !statRef.checked;
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
      // used to trigger error modal
      if (globalFilterState.stats.length + 1 >= 7) {
        handleModal();
      } else {
        toggle_stat(e, statID);
      }
    }
  };

  const handleShowStatsDropdown = () => {
    isDropdownOpen.current = !isDropdownOpen.current;
    selectDropdownRef.current.classList.toggle(cssModule["active"]);
    selectBtnRef.current.classList.toggle(cssModule["select-button-active"]);
    selectBtnRef.current.setAttribute(
      "aria-expanded",
      selectBtnRef.current.getAttribute("aria-expanded") === "true" ? "false" : "true"
    );
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
              title={lang === "fr" ? all_positives_stats[id].fr : all_positives_stats[id].en}
            >
              <Image
                className={cssModule["icon"]}
                src={`/stats/${id}.png`}
                width={24}
                height={24}
                unoptimized
                alt={lang === "fr" ? all_positives_stats[id].fr : all_positives_stats[id].en}
              />
            </div>
          ))}
        </div>
        <div
          className={cssModule["custom-dropdown"]}
          ref={customDropdownRef}
        >
          <button
            className={cssModule["select-button"]}
            role="combobox"
            aria-labelledby="select button"
            aria-haspopup="listbox"
            aria-expanded="false"
            aria-controls="select-dropdown"
            onClick={() => handleShowStatsDropdown()}
            ref={selectBtnRef}
          >
            <span className="selected-value">More Stats</span>
            <span className="arrow"></span>
          </button>
          <ul
            role="listbox"
            id={cssModule["select-dropdown"]}
            style={{
              bottom: "252px",
              maxHeight: "212px",
              ...(deviceType === "mobile" ? { width: "230px" } : { width: "210px" }),
            }}
            ref={selectDropdownRef}
          >
            {Object.keys(all_positives_stats)
              .filter((key) => !stat_order.includes(parseInt(key)))
              .map((key) => (
                <li
                  key={key}
                  role="option"
                >
                  <input
                    type="checkbox"
                    id={key}
                    name={all_positives_stats[key][lang]}
                    ref={(element) => setstatsRefs(parseInt(key), element)}
                    onClick={(e) => handleClick(e, parseInt(key))}
                  />
                  <label
                    htmlFor={key}
                    style={deviceType !== "mobile" ? { maxWidth: "140px" } : { maxWidth: "180px" }}
                  >
                    {all_positives_stats[key][lang]}
                  </label>
                </li>
              ))}
            {Object.keys(all_negatives_stats)
              .filter((key) => !stat_order.includes(parseInt(key)))
              .map((key) => (
                <li
                  key={key}
                  role="option"
                >
                  <input
                    type="checkbox"
                    id={key}
                    name={all_negatives_stats[key][lang]}
                    ref={(element) => setstatsRefs(key, element)}
                    onClick={(e) => handleClick(e, key)}
                  />
                  <label
                    htmlFor={key}
                    style={{
                      color: "#FF6347",
                      ...(deviceType !== "mobile" ? { maxWidth: "140px" } : { maxWidth: "180px" }),
                    }}
                  >
                    {all_negatives_stats[key][lang]}
                  </label>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TypeFilter;
