import React, { useState, useEffect, useRef } from "react";
import cssModule from "./TypeFilter.module.scss";
import Image from "next/image";
import { checkDataExists } from "../../../services/data-service.jsx";
import { useTypeStateContext } from "../../Contexts/TypeStateContext";

// TODO
// Create modal for errors

const TypeFilter = ({
  handleTypeChange,
  filterStateType,
  resetFiltersFlag,
}) => {
  const selectedTypesRefs = useRef([]);
  const iconsRefs = useRef({});
  const { state, dispatch } = useTypeStateContext();

  const setIconsRefs = (imageName, element) => {
    iconsRefs.current[imageName] = element;
  };

  const handleImageClick = (imageName) => {
    if (selectedTypesRefs.current.includes(imageName)) {
      selectedTypesRefs.current = selectedTypesRefs.current.filter(
        (name) => name !== imageName
      );
      dispatch({
        type: "UPDATE_GLOBAL_VALUE",
        payload: selectedTypesRefs.current,
      });
    } else {
      selectedTypesRefs.current.push(imageName);
      dispatch({
        type: "UPDATE_GLOBAL_VALUE",
        payload: selectedTypesRefs.current,
      });
    }

    const iconRef = iconsRefs.current[imageName];
    if (iconRef) {
      iconRef.classList.toggle(cssModule["selected"]);
    }

    getNumberFromTypeString(selectedTypesRefs.current);
  };

  useEffect(() => {
    let size = Object.keys(state.stateValue).length;
    if (size > 0) {
      setTimeout(() => {
        state.stateValue.forEach((imageName) => {
          const iconRef = iconsRefs.current[imageName];
          if (iconRef) {
            iconRef.classList.toggle(cssModule["selected"]);
          }
        });
        selectedTypesRefs.current = state.stateValue;
      }, 0);
    }
  }, []);

  // TODO needs refactoring
  const getNumberFromTypeString = (selectedTypes) => {
    let newSelectedTypes = [];
    for (let i = 0; i < selectedTypes.length; i++) {
      let temp_string = selectedTypes[i].toString().split(/\-(.*)/);
      if (typeof temp_string[1] === "string") {
        newSelectedTypes.push(temp_string[1]);
      } else {
        console.log("Error while trying to set type of item");
      }
    }
    if (checkDataExists(newSelectedTypes, 0)) {
      // console.log("newSelectedTypes", newSelectedTypes);
      handlePassingTypeChange(newSelectedTypes);
    } else {
      console.log("error data does not exists");
    }
  };

  // this exists to delay fetching if the user
  // selects x types, so we get 1 request
  // instead of x
  let timer;
  const handlePassingTypeChange = (newSelectedTypes) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleTypeChange(newSelectedTypes);
    }, 700);
  };

  useEffect(() => {
    selectedTypesRefs.current.forEach((element) =>
      iconsRefs.current[element].classList.toggle(cssModule["selected"])
    );
    selectedTypesRefs.current = [];
  }, [resetFiltersFlag]);

  return (
    <div className={cssModule["type-container"]}>
      <div className={cssModule["horizontal-separator"]}></div>
      <div
        className={`${cssModule["type-row-icon-container"]} ${cssModule["top-row"]}`}
      >
        {["134-casque", "138-epaulettes", "120-amulette", "136-plastron"].map(
          (imageName) => (
            <div
              key={imageName}
              onClick={() => handleImageClick(imageName)}
              data-image-name={imageName}
              ref={(element) => setIconsRefs(imageName, element)}
              className={cssModule["icon-container"]}
            >
              <Image
                className={cssModule["icon"]}
                src={`/itemTypes/${imageName}.png`}
                width={28}
                height={28}
                unoptimized
                alt={imageName}
              />
            </div>
          )
        )}
      </div>
      <div className={cssModule["type-row-icon-container"]}>
        {["132-cape", "103-anneau", "133-ceinture", "119-bottes"].map(
          (imageName) => (
            <div
              key={imageName}
              className={cssModule["icon-container"]}
              onClick={() => handleImageClick(imageName)}
              data-image-name={imageName}
              ref={(element) => setIconsRefs(imageName, element)}
            >
              <Image
                className={cssModule["icon"]}
                src={`/itemTypes/${imageName}.png`}
                width={28}
                height={28}
                unoptimized
                alt={imageName}
              />
            </div>
          )
        )}
      </div>
      <div className={cssModule["type-row-icon-container"]}>
        {[
          "518-arme1main",
          "519-arme2main",
          "571-secondemain",
          "520-bouclier",
        ].map((imageName) => (
          <div
            key={imageName}
            className={cssModule["icon-container"]}
            onClick={() => handleImageClick(imageName)}
            data-image-name={imageName}
            ref={(element) => setIconsRefs(imageName, element)}
          >
            <Image
              className={cssModule["icon"]}
              src={`/itemTypes/${imageName}.png`}
              width={28}
              height={28}
              unoptimized
              alt={imageName}
            />
          </div>
        ))}
      </div>
      <div
        className={`${cssModule["type-row-icon-container"]} ${cssModule["top-row"]}`}
      >
        {["812-sublimation", "582-familiers", "611-montures", "646-emblemes"].map(
          (imageName) => (
            <div
              key={imageName}
              onClick={() => handleImageClick(imageName)}
              data-image-name={imageName}
              ref={(element) => setIconsRefs(imageName, element)}
              className={cssModule["icon-container"]}
            >
              <Image
                className={cssModule["icon"]}
                src={`/itemTypes/${imageName}.png`}
                width={28}
                height={28}
                unoptimized
                alt={imageName}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TypeFilter;
