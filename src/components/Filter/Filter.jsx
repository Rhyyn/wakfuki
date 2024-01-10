import React from "react";
import cssModule from "./Filter.module.scss";
import Image from "next/image";
// import { useTranslation } from 'next-i18next';
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch.jsx";
import { RarityFilter } from "./RarityFilter/RarityFilter";
import { SearchBar } from "./SearchBar/SearchBar";
import LevelFilter  from "./LevelFilter/LevelFilter";
import TypeFilter from "./TypeFilter/TypeFilter";
import StatsFilter from "./StatsFilter/StatsFilter"

// NEED A WAY TO CHECK IF TABLE OF TYPE IS ALREADY POPULATED
// IF NOT GO POPULATE
// ELSE GO HAM

const Filter = ({
    handleLogClick,
    length_recipes,
    store_file,
    handleTypeFilter,
}) => {
    const { t, i18n } = useTranslation();
    return (
        <div className={cssModule["filter-container"]}>
            <div className={cssModule["header-container"]}>
                <h2 className={cssModule["header-title"]}>{t("Filtres")}</h2>
                <div className={cssModule["header-icons-container"]}>
                    <Image
                        className={cssModule["header-icon"]}
                        src="/reset_icon_yellow.png"
                        width={32}
                        height={32}
                        unoptimized
                        alt="reset-icon"
                        title={t("Mise à zéro des Filtres")}
                    />
                    <div className={cssModule["vertical-separator"]}></div>
                    <Image
                        className={cssModule["header-icon"]}
                        src="/sort_icon_yellow.png"
                        width={32}
                        height={32}
                        unoptimized
                        alt="sort-icon"
                        title={t("Trier par")}
                    />
                </div>
            </div>
            {/* <button onClick={handleLogClick}>Log Data</button>
            <button onClick={() => store_file("bottes_scrapped_data_formated.json")}>
                TEST CALL
            </button>
            <button onClick={() => length_recipes()}>TEST CALL LENGTH</button> */}
            <div className={cssModule["horizontal-separator"]}></div>
            <RarityFilter />
            <SearchBar />
            <div className={cssModule["horizontal-separator"]}></div>
            <LevelFilter />
            <LanguageSwitch />
            <TypeFilter />
            <StatsFilter />

            {/* <button
                className="cat-buttons"
                onClick={() => handleTypeFilter([254, 108, 110, 115, 113])}
            >
                Arme à 1 main
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter([223, 114, 101, 111, 253, 117])}
            >
                Arme à 2 mains
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter([112, 189])}
            >
                Seconde Main
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter(120)}
            >
                Amulette
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter(103)}
            >
                Anneau
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter(119)}
            >
                Bottes
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter(132)}
            >
                Cape
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter(134)}
            >
                Casque
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter(133)}
            >
                Ceinture
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter(138)}
            >
                Epaulettes
            </button>
            <button
                className="cat-buttons"
                onClick={() => handleTypeFilter(136)}
            >
                Plastron
            </button> */}
        </div>
    );
};

export { Filter };
