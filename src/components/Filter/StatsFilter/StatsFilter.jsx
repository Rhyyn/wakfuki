import React, { useState, useEffect, useRef } from "react";
import cssModule from "./StatsFilter.module.scss";
import Image from "next/image";
import { useTranslation } from "react-i18next";

// TODO
// maitrisElementRandom should show if maitriseMelee or maitriseDistance is selected
// need a max number of selected stats

const TypeFilter = ({
  handleStatsChange,
  resetFiltersFlag,
  filterStateStats,
  updateStatsFlag,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const { t, i18n } = useTranslation();
  const isInitialMount = useRef(true);
  const [lang, setLang] = useState();
  const selectedStatsRefs = useRef([]);
  const selectedStatsConstructedRefs = useRef([]);
  const iconsRefs = useRef({});
  const setIconsRefs = (statID, element) => {
    iconsRefs.current[statID] = element;
  };
  const inputRefs = useRef({});
  const setInputRefs = (statID, element) => {
    inputRefs.current[statID] = element;
  };

  useEffect(() => {
    setLang(localStorage.getItem("language"));
  }, [t]);

  // this is a hack
  // this is bad
  // but it works :)
  const primary_stat = {
    31: {
      fr: "PA",
      en: "AP",
    },
    41: {
      fr: "PM",
      en: "MP",
    },
    191: {
      fr: "PW",
      en: "WP",
    },
    160: {
      fr: "Portée",
      en: "Range",
    },
    1055: {
      fr: "Maîtrise Berserk",
      en: "Berserk Mastery",
    },
    1052: {
      fr: "Maîtrise Mêlée",
      en: "Melee Mastery",
    },
    1053: {
      fr: "Maîtrise Distance",
      en: "Distance Mastery",
    },
    1068: {
      fr: "Maîtrise dans X éléments aléatoires",
      en: "Mastery in X randoms elements",
    },
    184: {
      fr: "Contrôle",
      en: "Control",
    },
    180: {
      fr: "Maîtrise Dos",
      en: "Rear Mastery",
    },
    150: {
      fr: "% Coup critique",
      en: "% Critical Hit",
    },
    149: {
      fr: "Maîtrise Critique",
      en: "Critical Mastery",
    },
  };
  const primary_stat_order = [
    31, 41, 191, 160, 1055, 1052, 1053, 1068, 184, 180, 150, 149,
  ];

  const secondary_stat = {
    26: {
      fr: "Maîtrise Soin",
      en: "Healing Mastery",
    },
    173: {
      fr: "Tacle",
      en: "Lock",
    },
    175: {
      fr: "Esquive",
      en: "Dodge",
    },
    988: {
      fr: "Résistance Critique",
      en: "Critical Resistance",
    },
    20: {
      fr: "PV",
      en: "HP",
    },
    39: {
      fr: "Armure donnée",
      en: "Armor given",
    },
    85: {
      fr: "Résistance Air",
      en: "Air Resistance",
    },
    83: {
      fr: "Résistance Eau",
      en: "Water Resistance",
    },
    82: {
      fr: "Résistance Feu",
      en: "Fire Resistance",
    },
    84: {
      fr: "Résistance Terre",
      en: "Earth Resistance",
    },
  };
  const secondary_stat_order = [26, 173, 175, 988, 20, 39, 85, 83, 82, 84];

  const remaining_stats = {
    171: {
      fr: "Initiative",
      en: "Initiative",
    },
    177: {
      fr: "Volonté",
      en: "Force of Will",
    },
    2001: {
      fr: "Quantité Récolte",
      en: "Harvesting Quantity",
    },
  };
  const remaining_stats_order = [171, 177, 2001];

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

    // console.log(selectedStatsConstructedRefs.current);
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

    const iconRef = iconsRefs.current[statID];
    if (iconRef) {
      iconRef.classList.toggle(cssModule["selected"]);
    }
  };

  const handleClick = (statID) => {
    handleSelectedStatsRefs(statID);
    handleConstructedRefObject(statID);
  };

  let timer;
  const handlePassingStatsChange = (newSelectedStats) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleStatsChange(newSelectedStats);
    }, 500);
  };

  useEffect(() => {
    selectedStatsRefs.current.forEach((element) =>
      iconsRefs.current[element].classList.toggle(cssModule["selected"])
    );
    selectedStatsRefs.current = [];
  }, [resetFiltersFlag]); // maybe wrong?

  useEffect(() => {
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
    selectedStatsConstructedRefs.current = filterStateStats
  }, [updateStatsFlag]);

  return (
    <div className={cssModule["type-container"]}>
      <div className={cssModule["horizontal-separator"]}></div>
      <div
        className={`${cssModule["type-row-icon-container"]} ${cssModule["top-row"]}`}
        onClick={() => setSelectedCategory(1)}
      >
        <span
          className={`${cssModule["stat-title"]} ${
            selectedCategory === 1
              ? cssModule["selected-title"]
              : cssModule["unselected-title"]
          }`}
        >
          {t("Primary Stats")}
        </span>
        <div
          className={`${cssModule["global-icon-container"]} ${
            selectedCategory === 1
              ? cssModule["selectedCategory"]
              : cssModule["hidden"]
          }`}
        >
          {selectedCategory === 1 &&
            primary_stat_order.map((id) => (
              <div
                key={id}
                ref={(element) => setIconsRefs(id, element)}
                className={cssModule["icon-container"]}
                data-id={id}
                onClick={() => handleClick(id)}
                title={
                  lang === "fr" ? primary_stat[id].fr : primary_stat[id].en
                }
              >
                <Image
                  className={cssModule["icon"]}
                  src={`/stats/primaryStats/${id}.png`}
                  width={24}
                  height={24}
                  unoptimized
                  alt={
                    lang === "fr" ? primary_stat[id].fr : primary_stat[id].en
                  }
                />
              </div>
            ))}
        </div>
      </div>
      <div
        className={cssModule["type-row-icon-container"]}
        onClick={() => setSelectedCategory(2)}
      >
        <span
          className={`${cssModule["stat-title"]} ${
            selectedCategory === 2
              ? cssModule["selected-title"]
              : cssModule["unselected-title"]
          }`}
        >
          {t("Secondary Stats")}
        </span>
        <div
          className={`${cssModule["global-icon-container"]} ${
            selectedCategory === 2
              ? cssModule["selectedCategory"]
              : cssModule["hidden"]
          }`}
        >
          {selectedCategory === 2 &&
            secondary_stat_order.map((id) => (
              <div
                key={id}
                ref={(element) => setIconsRefs(id, element)}
                className={cssModule["icon-container"]}
                data-id={id}
                onClick={() => handleClick(id)}
                title={
                  lang === "fr" ? primary_stat[id].fr : primary_stat[id].en
                }
              >
                <Image
                  className={cssModule["icon"]}
                  src={`/stats/secondaryStats/${id}.png`}
                  width={24}
                  height={24}
                  unoptimized
                  alt={
                    lang === "fr" ? primary_stat[id].fr : primary_stat[id].en
                  }
                />
              </div>
            ))}
        </div>
      </div>
      <div
        className={cssModule["type-row-icon-container"]}
        onClick={() => setSelectedCategory(3)}
      >
        <span
          className={`${cssModule["stat-title"]} ${
            selectedCategory === 3
              ? cssModule["selected-title"]
              : cssModule["unselected-title"]
          }`}
        >
          {t("Remaining Stats")}
        </span>
        <div
          className={`${cssModule["global-icon-container"]} ${
            selectedCategory === 3
              ? cssModule["selectedCategory"]
              : cssModule["hidden"]
          }`}
        >
          {selectedCategory === 3 &&
            remaining_stats_order.map((id) => (
              <div
                key={id}
                ref={(element) => setIconsRefs(id, element)}
                className={cssModule["icon-container"]}
                data-id={id}
                onClick={() => handleClick(id)}
                title={
                  lang === "fr" ? primary_stat[id].fr : primary_stat[id].en
                }
              >
                <Image
                  className={cssModule["icon"]}
                  src={`/stats/remainingStats/${id}.png`}
                  width={24}
                  height={24}
                  unoptimized
                  alt={
                    lang === "fr" ? primary_stat[id].fr : primary_stat[id].en
                  }
                />
              </div>
            ))}
        </div>
      </div>
      {/* {selectedStatsRefs.current.length > 0 ? (
        <div className={cssModule["value-editor-container"]}>
          {Object.entries(selectedStatsRefs.current).map(
            ([selectedStatID, statElement]) =>
              Object.values(iconsRefs.current).map((iconId, iconElement) => {
                if (
                  parseInt(iconId.attributes.getNamedItem("data-id").value) ===
                  parseInt(statElement)
                ) {
                  return (
                    <div
                      key={iconId.attributes[2]}
                      className={cssModule["value-editor"]}
                      ref={(element) => setInputRefs(iconId, element)}
                    >
                      <Image
                        alt={iconId.attributes.getNamedItem("title").value}
                        width={24}
                        height={24}
                        src={`/stats/primaryStats/${
                          iconId.attributes.getNamedItem("data-id").value
                        }.png`}
                      />
                      <input className={cssModule["value-input"]} />
                    </div>
                  );
                }
                // return <div key={iconId.attributes.getNamedItem("data-id").value}>{statElement}</div>;
                return null;
              })
          )} 
          
        </div>
      ) : null} */}
    </div>
  );
};

export default TypeFilter;
