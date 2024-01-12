import React, { useState, useEffect } from "react";
import cssModule from "./TypeFilter.module.scss";
import Image from "next/image";

const TypeFilter = ({ handleTypeChange }) => {
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
    }, [selectedImages]);

    return (
        <div className={cssModule["type-container"]}>
            {/* <h3 className={cssModule["type-title"]}>Types</h3> */}
            <div className={cssModule["horizontal-separator"]}></div>
            <div
                className={`${cssModule["type-row-icon-container"]} ${cssModule["top-row"]}`}
            >
                {["134", "138", "120", "136"].map((imageName) => (
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
                            alt="casque/helmet"
                        />
                    </div>
                ))}
            </div>
            <div className={cssModule["type-row-icon-container"]}>
                {["132", "103", "133", "119"].map((imageName) => (
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
                            alt="casque/helmet"
                        />
                    </div>
                ))}
            </div>
            <div className={cssModule["type-row-icon-container"]}>
                {["518", "519", "571", "520"].map((imageName) => (
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
                            alt="casque/helmet"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TypeFilter;
