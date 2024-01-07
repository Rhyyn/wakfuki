import React from "react";
import cssModule from "./SearchBar.module.scss";
import { useTranslation } from 'react-i18next';

export const SearchBar = () => {
    const { t, i18n } = useTranslation();
    return (
        <div className={cssModule["search-bar-container"]}>
            <input className={cssModule["input"]} placeholder={t('Chercher')}></input>
        </div>
    );
};
