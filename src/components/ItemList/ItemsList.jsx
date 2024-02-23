import React, { useState, useEffect, useRef } from "react";
import { fetchData } from "../../services/data-service.jsx";
import Card from "../Card/Card.jsx";
import cssModule from "./ItemList.module.scss";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../Contexts/GlobalContext.js";

const ItemList = ({ resetFiltersFlag }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 40;
  const [lastSort, setLastSort] = useState(globalFilterState.sortBy); // used to tell if sorting has changed
  let lang = localStorage.getItem("language");

  const transformDataForDisplay = (rawData) => {
    return rawData.map((item) => ({
      title: item.title,
      level: item.level,
      id: item.id,
      droprates: item.droprates,
      baseParams: item.baseParams,
      equipEffects: item.equipEffects,
      gfxId: item.gfxId,
      recipes: item.recipes,
    }));
  };

  // need to refactor the timeout to make isLoading true before 700ms
  // otherwise there is a blank then a loading before the data is displayed
  let timer;
  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const fetchItems = async () => {
        lang = localStorage.getItem("language");
        let DATA = [];
        if (lastSort !== globalFilterState.sortBy) {
          // used for sorting reset if sorting has changed
          DATA = await fetchData(globalFilterState, 1, itemsPerPage, lang, lastSort);
          setCurrentPage(1);
          setLastSort(globalFilterState.sortBy);
        } else {
          DATA = await fetchData(globalFilterState, currentPage, itemsPerPage, lang);
        }
        let slimmedDownData = transformDataForDisplay(DATA);
        setItems(slimmedDownData);
        setIsLoading(false);
      };
      if (globalFilterState !== null && !resetFiltersFlag) {
        setIsLoading(true);
        fetchItems();
      } else {
        // why?
        setItems([]);
      }
    }, 700);
  }, [globalFilterState]);

  const isFetchingRef = useRef(false);
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      const fetchItems = async (page) => {
        lang = localStorage.getItem("language");
        let DATA = await fetchData(globalFilterState, page, itemsPerPage, lang);
        let slimmedDownData = transformDataForDisplay(DATA);
        const newItems = items.concat(slimmedDownData);
        setItems(newItems);
        isFetchingRef.current = false;
      };

      // percent of the scroll is at least 78%
      const percent = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
      if (percent >= 78 && !isFetchingRef.current) {
        isFetchingRef.current = true;
        let page = currentPage + 1;
        fetchItems(page);
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  // used for debugging
  // useEffect(() => {
  //   console.log(items);
  // }, [items]);

  return (
    <div className={cssModule["cards-container"]}>
      {isLoading && <p>Loading...</p>}
      {!isLoading &&
        items.map((item) => (
          <Card
            key={item.id}
            item={item}
            lang={lang}
          />
        ))}
    </div>
  );
};

export default ItemList;
