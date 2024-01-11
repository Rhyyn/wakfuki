import React, { useState } from "react";
import cssModule from "./StatsFilter.module.scss";
import Image from "next/image";

const TypeFilter = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const stats = [
        "air",
        "armure",
        "controle",
        "critique",
        "eau",
        "esquive",
        "feu",
        "initiative",
        "maitriseElementRandom",
        "maitriseMelee",
        "maitriseSoin",
        "malusResdos",
        "pa",
        "pm",
        "portee",
        "prospection",
        "pv",
        "resAir",
        "resCritique",
        "resEau",
        "resFeu",
        "ressourceRecolte",
        "resTerre",
        "sagesse",
        "tacle",
        "terre",
        "up",
        "volonte",
        "wakfu",
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

    return (
        <div className={cssModule["type-container"]}>
            <h3 className={cssModule["type-title"]}>Stats</h3>
            <div className={cssModule["horizontal-separator"]}></div>
            <div
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
            </div>
            {/* <div className={cssModule["type-row-icon-container"]}>
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
            </div> */}
        </div>
    );
};

export default TypeFilter;
