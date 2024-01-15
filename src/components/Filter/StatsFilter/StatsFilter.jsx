import React, { useState, useEffect } from "react";
import cssModule from "./StatsFilter.module.scss";
import Image from "next/image";

// maitrisElementRandom should show if maitriseMelee or maitriseDistance is selected

const TypeFilter = ({ resetFiltersFlag }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);

  const primary_stat = [
    "pa",
    "pm",
    "wakfu",
    "portee", // end of row1
    "maitriseBerserk",
    "maitriseMelee",
    "maitriseDistance",
    "maitriseElementRandom", // end of row2
    "controle",
    "maitriseDos",
    "critique",
    "maitriseCritique", // end of row3
  ];
  const secondary_stat = [
    "maitriseSoin",
    "volonte",
    "tacle",
    "esquive", // end of row1
    "initiative",
    "resCritique",
    "hp",
    "armure", // end of row2
    "resAir",
    "resEau",
    "resFeu",
    "resTerre", // end of row3
  ];

  const remaining_stats = [
    "malusResdos",
    "prospection",
    "ressourceRecolte",
    "sagesse",
    "up",
  ];

  const handleImageClick = (imageName) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(imageName)) {
        return prevSelectedImages.filter((name) => name !== imageName);
      } else {
        return [...prevSelectedImages, imageName];
      }
    });
  };

  useEffect(() => {
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
        <span className={cssModule["stat-title"]}>Stats Principales</span>
        <div className={cssModule["global-icon-container"]}>
          {selectedCategory === 1 &&
            primary_stat.map((itemName) => (
              <div
                key={itemName}
                className={`${cssModule["icon-container"]} ${
                  selectedItems.includes(itemName) ? cssModule["selected"] : ""
                }`}
                onClick={() => handleImageClick(itemName)}
              >
                <Image
                  className={cssModule["icon"]}
                  src={`/stats/${itemName}.png`}
                  width={24}
                  height={24}
                  unoptimized
                  alt={itemName}
                  title={itemName}
                />
              </div>
            ))}
        </div>
      </div>
      <div
        className={cssModule["type-row-icon-container"]}
        onClick={() => setSelectedCategory(2)}
      >
        <span className={cssModule["stat-title"]}>Stats Secondaires</span>
        <div className={cssModule["global-icon-container"]}>
          {selectedCategory === 2 &&
            secondary_stat.map((itemName) => (
              <div
                key={itemName}
                className={`${cssModule["icon-container"]} ${
                  selectedItems.includes(itemName) ? cssModule["selected"] : ""
                }`}
                onClick={() => handleImageClick(itemName)}
              >
                <Image
                  className={cssModule["icon"]}
                  src={`/stats/${itemName}.png`}
                  width={24}
                  height={24}
                  unoptimized
                  alt={itemName}
                />
              </div>
            ))}
        </div>
      </div>
      <div
        className={cssModule["type-row-icon-container"]}
        onClick={() => setSelectedCategory(3)}
      >
        <span className={cssModule["stat-title"]}>Stats Restantes</span>
        <div className={cssModule["global-icon-container"]}>
          {selectedCategory === 3 &&
            remaining_stats.map((itemName) => (
              <div
                key={itemName}
                className={`${cssModule["icon-container"]} ${
                  selectedItems.includes(itemName) ? cssModule["selected"] : ""
                }`}
                onClick={() => handleImageClick(itemName)}
              >
                <Image
                  className={cssModule["icon"]}
                  src={`/stats/${itemName}.png`}
                  width={24}
                  height={24}
                  unoptimized
                  alt={itemName}
                />
              </div>
            ))}
        </div>
      </div>
      {/* <div
                className={`${cssModule["type-row-icon-container"]} ${cssModule["top-row"]}`}
            >
                {stats.map((itemName) => (
                    <div
                        key={itemName}
                        className={`${cssModule["icon-container"]} ${
                            selectedItems.includes(itemName)
                                ? cssModule["selected"]
                                : ""
                        }`}
                        onClick={() => handleImageClick(itemName)}
                    >
                        <Image
                            className={cssModule["icon"]}
                            src={`/stats/${itemName}.png`}
                            width={24}
                            height={24}
                            unoptimized
                            alt={itemName}
                        />
                    </div>
                ))}
            </div> */}
    </div>
  );
};

export default TypeFilter;
