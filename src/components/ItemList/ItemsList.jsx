import React, { useState, useEffect, useRef } from "react";
import { waitForDbInitialization, getDBInstance, fetchData } from "../../services/data-service.jsx";
import Card from "../Card/Card.jsx";
import cssModule from "./ItemList.module.scss";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../Contexts/GlobalContext.js";

// TODO :
// rarities does not get added on top of the list ?
// Pages and infinite scrolling

const ItemList = ({ resetFiltersFlag }) => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const itemsPerPage = 40;
  const scrollThreshold = 100;
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

  let timer;
  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const fetchItems = async () => {
        // console.log("GlobalFilterState changed", globalFilterState);
        lang = localStorage.getItem("language");
        let DATA = await fetchData(globalFilterState, currentPage, itemsPerPage, lang);
        let slimmedDownData = transformDataForDisplay(DATA);
        setItems(slimmedDownData);
        setIsLoading(false);
      };
      if (globalFilterState !== null && !resetFiltersFlag) {
        // setCurrentPage(1); // Reset page to 1 when a new type is selected\
        setIsLoading(true);
        fetchItems();
      } else {
        console.log("this should not trigger");
        setItems([]);
      }
    }, 1000);
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

      // scrollTop / scrollHeight * 100
      const percent = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
      // console.log(percent);
      if (percent >= 78 && !isFetchingRef.current) {
        console.log("here");
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

  useEffect(() => {
    console.log(items);
  }, [items]);

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
