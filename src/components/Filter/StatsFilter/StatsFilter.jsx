import React, { useState, useEffect, useRef } from "react";
import cssModule from "./StatsFilter.module.scss";
import Image from "next/image";
import { useTranslation } from "react-i18next";

// TODO
// maitrisElementRandom should show if maitriseMelee or maitriseDistance is selected
// fix title attribute with locales

const TypeFilter = ({ resetFiltersFlag }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const { t, i18n } = useTranslation();
  const isInitialMount = useRef(true);
  const [lang, setLang] = useState();

  useEffect(() => {
    setLang(localStorage.getItem("language"));
  }, [t]);

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

  // if user selects PA -> create a new span with a default value - id = 1 - 31
  // update filterState
  // if user manually change value in span -> update filterState
  // if value = negative -> change id to Deboost if !== 0
  // sets back to default and modal error

  const getAlt = (statId) => {
    const stat = primary_stat[statId];
    if (stat) {
      return lang === "fr" ? stat.fr : stat.en;
    }
  };

  const handleImageClick = (imageName) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(imageName)) {
        return prevSelectedImages.filter((name) => name !== imageName);
      } else {
        return [...prevSelectedImages, imageName];
      }
    }, console.log(selectedImages));
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    console.log("useEffect in StatsFilter triggered");
    setSelectedCategory(1);
    if (selectedImages.length > 0) {
      setSelectedImages([]);
    }

    if (selectedItems.length > 0) {
      setSelectedItems([]);
    }
  }, [resetFiltersFlag]); // maybe wrong?

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
                key={id + 1} // Adding 1 because index 0 is not used
                className={`${cssModule["icon-container"]} ${
                  selectedItems.includes(id) ? cssModule["selected"] : ""
                }`}
                onClick={() => handleImageClick(id)}
                title={getAlt(id)}
              >
                <Image
                  className={cssModule["icon"]}
                  src={`/stats/primaryStats/${id}.png`}
                  width={24}
                  height={24}
                  unoptimized
                  alt={getAlt(id)}
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
                key={id + 1} // Adding 1 because index 0 is not used
                className={`${cssModule["icon-container"]} ${
                  selectedItems.includes(id) ? cssModule["selected"] : ""
                }`}
                onClick={() => handleImageClick(id)}
                title={getAlt(id)}
              >
                <Image
                  className={cssModule["icon"]}
                  src={`/stats/secondaryStats/${id}.png`}
                  width={24}
                  height={24}
                  unoptimized
                  alt={getAlt(id)}
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
                key={id + 1} // Adding 1 because index 0 is not used
                className={`${cssModule["icon-container"]} ${
                  selectedItems.includes(id) ? cssModule["selected"] : ""
                }`}
                onClick={() => handleImageClick(id)}
                title={getAlt(id)}
              >
                <Image
                  className={cssModule["icon"]}
                  src={`/stats/remainingStats/${id}.png`}
                  width={24}
                  height={24}
                  unoptimized
                  alt={getAlt(id)}
                />
              </div>
            ))}
        </div>
      </div> 
    </div>
  );
};

export default TypeFilter;
