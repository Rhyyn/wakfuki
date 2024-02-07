import React, { useRef } from "react";
import cssModule from "./RarityFilter.module.scss";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../../Contexts/GlobalContext";

export const RarityFilter = ({ resetFiltersFlag }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const imageFileNames = [
    "0.png",
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
  ];

  const selectedRaritiesRefs = useRef([]);
  const iconsRefs = useRef({});
  const setIconsRefs = (rarity, element) => {
    iconsRefs.current[rarity] = element;
  };

  // Populate selectedRaritiesRefs when mounting for mobile filter
  useEffect(() => {
    if (globalFilterState.rarity) {
      for (let i = 0; i < globalFilterState.rarity.length; i++) {
        selectedRaritiesRefs.current.push(globalFilterState.rarity[i]);
      }
    }
  }, []);

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

  // Used to wait for the user to stop selecting rarities
  // and then update the global filter or after 500ms
  let timer;
  const handlePassingRaritiesChange = (newSelectedRarities) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch({
        type: "UPDATE_RARITY",
        payload: newSelectedRarities,
      });
    }, 500);
  };


  useEffect(() => {
    selectedRaritiesRefs.current.forEach((element) =>
      iconsRefs.current[element + ".png"].classList.toggle(
        cssModule["selected"]
      )
    );
    selectedRaritiesRefs.current = [];
  }, [resetFiltersFlag]);

  return (
    <div className={cssModule["rarity-container"]}>
      {imageFileNames.map((image, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          ref={(element) => setIconsRefs(image, element)}
          className={cssModule["rarity-item"]}
        >
          <Image
            src={`/rarities/${image}`}
            alt={`Rarity ${index}`}
            width={24}
            height={40}
            quality={100}
            title={t(index)}
          />
        </div>
      ))}
    </div>
  );
};
