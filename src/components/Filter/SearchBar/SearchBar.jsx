import React, { useState, useEffect } from "react";
import cssModule from "./SearchBar.module.scss";
import { useTranslation } from "react-i18next";

const SearchBar = ({ handleSearchChange }) => {
    const [userInput, setUserInput] = useState("");
    const { t, i18n } = useTranslation();

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const debouncedHandleSearchChange = React.useRef(
        debounce(handleSearchChange, 300)
    ).current;

    useEffect(() => {
        debouncedHandleSearchChange(userInput);

        return () => clearTimeout(debouncedHandleSearchChange);
    }, [userInput, debouncedHandleSearchChange]);

    const handleChange = (event) => {
        setUserInput(event.target.value);
    };

    return (
        <div className={cssModule["search-bar-container"]}>
            <input
                className={cssModule["input"]}
                placeholder={t("Chercher")}
                value={userInput}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBar;
