import React, { useState, useEffect, useRef } from "react";
import cssModule from "./SearchBar.module.scss";
import { useTranslation } from "react-i18next";

const SearchBar = ({
  handleSearchChange,
  filterStateSearchQuery,
  resetFiltersFlag,
}) => {
  const [userInput, setUserInput] = useState(filterStateSearchQuery);
  const { t, i18n } = useTranslation();
  const isInitialMount = useRef(true);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedHandleSearchChange = useRef(
    debounce(handleSearchChange, 500)
  ).current;

  useEffect(() => {
    if (!isInitialMount.current) {
      const timeoutId = debouncedHandleSearchChange(userInput);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [userInput]);

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  useEffect(() => {
    if (!isInitialMount.current) {
      console.log("useEffect in SearchBar triggered");
      if (userInput.length > 0) {
        setUserInput("");
      }
    }
    isInitialMount.current = false;
  }, [resetFiltersFlag]);

  return (
    <div className={cssModule["search-bar-container"]}>
      <input
        type="text"
        className={cssModule["input"]}
        placeholder={t("Chercher")}
        value={userInput}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
