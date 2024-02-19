import React, { useState, useEffect, useRef } from "react";
import cssModule from "./TypeFilter.module.scss";
import Image from "next/image";
import { checkDataExists } from "../../../services/data-service.jsx";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { useTranslation } from "next-i18next";
import tablenames from "../../../data/tablenames.json";

const TypeFilter = ({ resetFiltersFlag }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const selectedTypesRefs = useRef([]);
  const iconsRefs = useRef({});

  const setIconsRefs = (type, element) => {
    iconsRefs.current[type] = element;
  };

  const handleImageClick = (typeName, typesIds, tablename) => {
    if (selectedTypesRefs.current.some((obj) => obj.typeName === typeName)) {
      selectedTypesRefs.current = selectedTypesRefs.current.filter(
        (obj) => obj.typeName !== typeName
      );
    } else {
      selectedTypesRefs.current.push({
        typeName: typeName,
        typesIds: typesIds,
        tablename: tablename,
      });
    }

    const iconRef = iconsRefs.current[typeName];
    if (iconRef) {
      iconRef.classList.toggle(cssModule["selected"]);
    }

    if (checkDataExists(selectedTypesRefs.current, 0)) {
      handlePassingTypeChange(selectedTypesRefs.current);
    } else {
      console.log(
        `Error : at least one type in ${selectedTypesRefs.current} does not exist or is incomplete")}`
      );
    }
  };

  // Used to populate refs on mount if any exists
  // for mobile filter
  useEffect(() => {
    let size = Object.keys(globalFilterState.type).length;
    if (size > 0) {
      setTimeout(() => {
        globalFilterState.type.forEach((obj) => {
          const iconRef = iconsRefs.current[obj.typeName];
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
    selectedTypesRefs.current.forEach((obj) =>
      iconsRefs.current[obj.typeName].classList.toggle(cssModule["selected"])
    );
    selectedTypesRefs.current = [];
  }, [resetFiltersFlag]);

  return (
    <div className={cssModule["type-container"]}>
      <div className={cssModule["horizontal-separator"]}></div>
      <div className={cssModule["type-row-icon-container"]}>
        {Object.keys(tablenames).map((typeName) => (
          <div
            key={typeName}
            onClick={() =>
              handleImageClick(typeName, tablenames[typeName].types, tablenames[typeName].tablename)
            }
            data-image-name={typeName}
            ref={(element) => setIconsRefs(typeName, element)}
            className={cssModule["icon-container"]}
            title={t(typeName)}
          >
            <Image
              className={cssModule["icon"]}
              src={`/itemTypes/${typeName}.png`}
              width={28}
              height={28}
              unoptimized
              alt={typeName}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
