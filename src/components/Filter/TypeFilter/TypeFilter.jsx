import React, { useState, useEffect } from "react";
import cssModule from "./TypeFilter.module.scss";
import Image from "next/image";

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
    handleTypeChange(selectedImages);
    console.log("handleTypeChange(Selectedtypes)");
  }, [selectedImages]);

  useEffect(() => {
    console.log('useEffect in TypeFilter called');
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
        {["134-casque", "138-epaulettes", "120-amulette", "136-plastron"].map((imageName) => (
          <div
            key={imageName}
            className={`${cssModule["icon-container"]} ${
              selectedImages.includes(imageName)
                ? cssModule["selected"]
                : ""
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
      <div className={cssModule["type-row-icon-container"]}>
        {["132-cape", "103-anneau", "133-ceinture", "119-bottes"].map((imageName) => (
          <div
            key={imageName}
            className={`${cssModule["icon-container"]} ${
              selectedImages.includes(imageName)
                ? cssModule["selected"]
                : ""
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
      <div className={cssModule["type-row-icon-container"]}>
        {["518-arme1main", "519-arme2main", "571-secondemain", "520-secondemain"].map((imageName) => (
          <div
            key={imageName}
            className={`${cssModule["icon-container"]} ${
              selectedImages.includes(imageName)
                ? cssModule["selected"]
                : ""
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
