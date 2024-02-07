import React, { useState, useEffect, useRef, useCallback } from "react";
import cssModule from "./SearchBar.module.scss";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../../Contexts/GlobalContext";

const SearchBar = ({
  handleSearchChange,
  filterStateSearchQuery,
  resetFiltersFlag,
}) => {
  const { t, i18n } = useTranslation();
  const isInitialMount = useRef(true);
  const { globalFilterState, dispatch } = useGlobalContext();
  const [userInput, setUserInput] = useState(globalFilterState.searchQuery);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedHandleSearchChange = useCallback(
    debounce((value) => {
      dispatch({
        type: "UPDATE_SEARCH_QUERY",
        payload: value,
      });
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    if (!isInitialMount.current) {
      const timeoutId = debouncedHandleSearchChange(userInput);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [userInput, debouncedHandleSearchChange]);

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
        spellCheck="false"
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
