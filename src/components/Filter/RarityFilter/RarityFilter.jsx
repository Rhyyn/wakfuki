import React from "react";
import cssModule from "./RarityFilter.module.scss";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const RarityFilter = ({ handleRarityChange }) => {
    const { t, i18n } = useTranslation();
    const [selectedItems, setSelectedItems] = useState([]);
    const imageFileNames = [];
    for (let index = 0; index < 8; index++) {
        imageFileNames.push(`${index}.png`);
    }
    const rows = [imageFileNames.slice(0, 4), imageFileNames.slice(4)];

    const handleClick = (v) => {
        const isSelected = selectedItems.includes(v);

        if (isSelected) {
            setSelectedItems((prevSelected) =>
                prevSelected.filter((item) => item !== v)
            );
        } else {
            setSelectedItems((prevSelected) => [...prevSelected, v]);
        }
    };

    useEffect(() => {
        handleRarityChange(selectedItems);
    }, [selectedItems]);

    return (
        <div className={cssModule["rarity-container"]}>
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={cssModule["row"]}>
                    {row.map((imageName, index) => (
                        <div
                            key={index}
                            className={`${cssModule["rarity-item"]} ${
                                selectedItems.includes(index + rowIndex * 4)
                                    ? cssModule["selected"]
                                    : ""
                            }`}
                            onClick={() => handleClick(index + rowIndex * 4)}
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
