import React, { useState, useEffect, useRef } from "react";
import { waitForDbInitialization, getDBInstance, fetchData } from "../../services/data-service.jsx";
import Card from "../Card/Card.jsx";
import cssModule from "./ItemList.module.scss";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../Contexts/GlobalContext.js";

// TODO :
// rarities does not get added on top of the list ?
// Pages and infinite scrolling

const ItemList = ({ filterState }) => {
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
      recipes: item.recipes
    }));
  };

  useEffect(() => {
    console.log("filterState changed");
    // console.log(filterState);
    // const fetchItems = async () => {
    // 	lang = localStorage.getItem("language");
    // 	let DATA = await fetchData(
    // 		filterState,
    // 		currentPage,
    // 		itemsPerPage,
    // 		lang
    // 	);
    // 	let slimmedDownData = transformDataForDisplay(DATA);
    // 	setItems(slimmedDownData);
    // 	setIsLoading(false);
    // };

    // if (filterState !== null) {
    // 	// setCurrentPage(1); // Reset page to 1 when a new type is selected\
    // 	setIsLoading(true);
    // 	fetchItems();

    // 	// console.log(isLoading);
    // 	// console.log(items);
    // }
  }, [currentPage, filterState]);

  let timer;
  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const fetchItems = async () => {
        console.log("GlobalFilterState changed", globalFilterState);
        lang = localStorage.getItem("language");
        let DATA = await fetchData(globalFilterState, currentPage, itemsPerPage, lang);
        let slimmedDownData = transformDataForDisplay(DATA);
        setItems(slimmedDownData);
        setIsLoading(false);
      };
      if (filterState !== null) {
        // setCurrentPage(1); // Reset page to 1 when a new type is selected\
        setIsLoading(true);
        fetchItems();

        // console.log(isLoading);
        // console.log(items);
      }
    }, 500);
  }, [globalFilterState]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      // console.log("scrollTop", Math.abs(scrollTop));
      // console.log("clientHeight", clientHeight);
      // console.log("scrollHeight", scrollHeight);
      // console.log(Math.abs(scrollHeight - clientHeight - scrollTop) < 1);
      if (scrollTop + clientHeight >= scrollHeight - scrollThreshold && !isFetching) {
        console.log("scrolled", isFetching);
        setCurrentPage((prevPage) => prevPage + 1);
        setIsFetching(true);

        setTimeout(() => {
          setIsFetching(false);
        }, 5000);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching]);

  return (
    <div className={cssModule["cards-container"]}>
      {isLoading && <p>Loading...</p>}
      {!isLoading && items.map((item) => <Card key={item.id} item={item} lang={lang} />)}
    </div>
  );
};

export default ItemList;
