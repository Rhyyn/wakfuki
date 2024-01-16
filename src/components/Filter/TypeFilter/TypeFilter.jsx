import React, { useState, useEffect } from "react";
import cssModule from "./TypeFilter.module.scss";
import Image from "next/image";
import { check_data_exists } from "../../../services/data-service.jsx";

// TODO
// Create modal for errors

const TypeFilter = ({ handleTypeChange, resetFiltersFlag }) => {
  const [selectedImages, setSelectedImages] = useState([]);

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
    let newSelectedTypes = [];
    for (let i = 0; i < selectedImages.length; i++) {
      let temp_string = selectedImages[i].toString().split(/\-(.*)/);
      if (typeof temp_string[1] === "string") {
        newSelectedTypes.push(temp_string[1]);
      } else {
        console.log("Error while trying to set type of item");
      }
    }
    if (check_data_exists(newSelectedTypes, 0)) {
      // console.log("newSelectedTypes", newSelectedTypes);
      handleTypeChange(newSelectedTypes);
    } else {
      console.log("error data does not exists");
    }
  }, [selectedImages]);

  useEffect(() => {
    // console.log("useEffect in TypeFilter called");
    if (selectedImages.length > 0) {
      setSelectedImages([]);
    }
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
              className={`${cssModule["icon-container"]} ${
                selectedImages.includes(imageName) ? cssModule["selected"] : ""
              }`}
              onClick={() => handleImageClick(imageName)}
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
