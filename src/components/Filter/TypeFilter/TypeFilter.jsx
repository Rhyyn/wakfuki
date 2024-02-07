import React, { useState, useEffect, useRef } from "react";
import cssModule from "./TypeFilter.module.scss";
import Image from "next/image";
import { checkDataExists } from "../../../services/data-service.jsx";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import string_to_item_types from "../../../data/string_to_item_types.json";

// TODO
// Create modal for errors

const TypeFilter = ({ resetFiltersFlag }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const selectedTypesRefs = useRef([]);
  const iconsRefs = useRef({});

  const setIconsRefs = (type, element) => {
    iconsRefs.current[type] = element;
  };

  const handleImageClick = (type) => {
    if (selectedTypesRefs.current.includes(type)) {
      selectedTypesRefs.current = selectedTypesRefs.current.filter(
        (typeName) => typeName !== type
      );
    } else {
      selectedTypesRefs.current.push(type);
    }

    const iconRef = iconsRefs.current[type];
    if (iconRef) {
      iconRef.classList.toggle(cssModule["selected"]);
    }

    if (checkDataExists(selectedTypesRefs.current, 0)) {
      handlePassingTypeChange(selectedTypesRefs.current);
    } else {
      console.log(`Error : at least one type in ${selectedTypesRefs.current} does not exist or is incomplete")}`);
    }
  };

  // Used to populate refs on mount if any exists
  // for mobile filter
  useEffect(() => {
    let size = Object.keys(globalFilterState.type).length;
    if (size > 0) {
      setTimeout(() => {
        globalFilterState.type.forEach((type) => {
          const iconRef = iconsRefs.current[type];
          if (iconRef) {
            iconRef.classList.toggle(cssModule["selected"]);
          }
        });
        selectedTypesRefs.current = globalFilterState.type;
      }, 50); // small delay because for some reason 0 did not work
    }
  }, []);


  // this exists to delay fetching if the user
  // selects x types, so we get 1 request
  // instead of x
  let timer;
  const handlePassingTypeChange = (newSelectedTypes) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch({
        type: "UPDATE_TYPE",
        payload: newSelectedTypes,
      });
    }, 600);
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
      <div className={cssModule["type-row-icon-container"]}>
        {Object.keys(string_to_item_types).map((type) => (
          <div
            key={type}
            onClick={() => handleImageClick(type)}
            data-image-name={type}
            ref={(element) => setIconsRefs(type, element)}
            className={cssModule["icon-container"]}
          >
            <Image
              className={cssModule["icon"]}
              src={`/itemTypes/${type}.png`}
              width={28}
              height={28}
              unoptimized
              alt={type}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
