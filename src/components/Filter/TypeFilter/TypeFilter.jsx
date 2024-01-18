import React, { useState, useEffect, useRef } from "react";
import cssModule from "./TypeFilter.module.scss";
import Image from "next/image";
import { check_data_exists } from "../../../services/data-service.jsx";
import _ from "lodash";

// TODO
// Create modal for errors

const TypeFilter = ({ handleTypeChange, resetFiltersFlag }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const selectedTypesRef = useRef([]);

  // maybe use a ref that we pass to handleImageClick
  // add clas seleted to that ref if it doesnt have it
  // otherwise remove it
  const handleImageClick = (imageName) => {
    if (selectedTypesRef.current.includes(imageName)) {
      selectedTypesRef.current = selectedTypesRef.current.filter(
        (name) => name !== imageName
      );
    } else {
      selectedTypesRef.current.push(imageName);
    }

    // Update the visual representation using the ref
    const iconRef = iconRefs.current[imageName];
    if (iconRef) {
      iconRef.classList.toggle(cssModule["selected"]);
    }

    getNumberFromTypeString(selectedTypesRef.current);
  };


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
    if (check_data_exists(newSelectedTypes, 0)) {
      // console.log("newSelectedTypes", newSelectedTypes);
      handlePassingTypeChange(newSelectedTypes);
    } else {
      console.log("error data does not exists");
    }
  };

  let timer;
  const handlePassingTypeChange = (newSelectedTypes) => {
    console.log("Clearing timer");
    clearTimeout(timer);
    console.log("Setting new timer");
    timer = setTimeout(() => {
      console.log("Timer expired, calling handleTypeChange");
      handleTypeChange(newSelectedTypes);
      console.log("handleTypeChange called");
    }, 500);
  };

  useEffect(() => {
    selectedTypesRef.current = [];
  }, [resetFiltersFlag]);

  // const debouncedHandleTypeChange = useCallback(
  //   _.debounce((types) => {
  //     handleTypeChange(types);
  //   }, 100),
  //   [handleTypeChange]
  // );
  // DEBOUNCE TEST USING LODASH

  const iconRefs = useRef({});
  const setIconRef = (imageName, element) => {
    iconRefs.current[imageName] = element;
  };

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
              className={`${cssModule["icon-container"]} ${
                selectedTypesRef.current.includes(imageName)
                  ? cssModule["selected"]
                  : ""
              }`}
              onClick={() => handleImageClick(imageName)}
              data-image-name={imageName}
              ref={(element) => setIconRef(imageName, element)}
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
              className={`${cssModule["icon-container"]} ${
                selectedImages.includes(imageName) ? cssModule["selected"] : ""
              }`}
              onClick={() => handleImageClick(imageName)}
              data-image-name={imageName}
              ref={(element) => setIconRef(imageName, element)}
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
            className={`${cssModule["icon-container"]} ${
              selectedImages.includes(imageName) ? cssModule["selected"] : ""
            }`}
            onClick={() => handleImageClick(imageName)}
            data-image-name={imageName}
            ref={(element) => setIconRef(imageName, element)}
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
    </div>
  );
};

export default TypeFilter;
