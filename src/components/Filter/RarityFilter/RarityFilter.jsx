import React, { useRef } from "react";
import cssModule from "./RarityFilter.module.scss";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const RarityFilter = ({ handleRarityChange, resetFiltersFlag }) => {
  const { t, i18n } = useTranslation();
  const [selectedItems, setSelectedItems] = useState([]);
  const imageFileNames = [];

  const selectedRaritiesRefs = useRef([]);
  const iconsRefs = useRef({});
  const setIconsRefs = (rarity, element) => {
    iconsRefs.current[rarity] = element;
  };

  for (let index = 0; index < 8; index++) {
    imageFileNames.push(`${index}.png`);
  }
  const rows = [imageFileNames.slice(0, 4), imageFileNames.slice(4)];

  const handleClick = (rarity) => {
    if (selectedRaritiesRefs.current.includes(rarity)) {
      selectedRaritiesRefs.current = selectedRaritiesRefs.current.filter(
        (value) => value !== rarity
      );
    } else {
      selectedRaritiesRefs.current.push(rarity);
    }

    const iconRef = iconsRefs.current[rarity + ".png"];
    if (iconRef) {
      iconRef.classList.toggle(cssModule["selected"]);
    }

    handlePassingRaritiesChange(selectedRaritiesRefs.current);
  };

  let timer;
  const handlePassingRaritiesChange = (newSelectedRarities) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleRarityChange(newSelectedRarities);
    }, 500);
  };

  useEffect(() => {
    selectedRaritiesRefs.current.forEach((element) =>
      iconsRefs.current[element + ".png"].classList.toggle(cssModule["selected"])
    );
    selectedRaritiesRefs.current = [];
  }, [resetFiltersFlag]);

  return (
    <div className={cssModule["rarity-container"]}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={cssModule["row"]}>
          {row.map((imageName, index) => (
            <div
              key={index}
              onClick={() => handleClick(index + rowIndex * 4)}
              ref={(element) => setIconsRefs(imageName, element)}
              className={cssModule["rarity-item"]}
            >
              <div className={cssModule["image-container"]}>
                <Image
                  src={`/rarities/${imageName}`}
                  alt={`Rarity ${index}`}
                  width={24}
                  height={36}
                  unoptimized
                  title={t(index + rowIndex * 4)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
