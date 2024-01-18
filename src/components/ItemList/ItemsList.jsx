import React, { useState, useEffect, useRef } from "react";
import { waitForDbInitialization, db } from "../../services/data-service.jsx";
import Card from "../Card/Card.jsx";
import cssModule from "./ItemList.module.scss";
import string_to_item_types from "../../data/string_to_item_types.json";

const ITEMS_PER_PAGE = 40;
const SCROLL_THRESHOLD = 100;

// TODO :
// rarities does not get added on top of the list ?
// Pages and infinite scrolling

const ItemList = ({ filterState }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const refItemsValue = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const [isFetching, setIsFetching] = useState(false);

  const get_typeId_from_string = async (selectedTypes) => {
    let itemsQuery = [];
    console.log("selectedTypes", selectedTypes);
    if (selectedTypes) {
      for (let i = 0; i < selectedTypes.length; i++) {
        const itemTypeString = selectedTypes[i];
        const itemIds = string_to_item_types[itemTypeString];

        if (itemIds) {
          const itemQueryObject = {
            itemTypeString: itemTypeString,
            itemIds: itemIds,
          };
          itemsQuery.push(itemQueryObject);
        }
      }
    }

    return itemsQuery;
  };

  const sortItemsByLevel = (data, order) => {
    return data.sort((a, b) => {
      const aValue = a.level;
      const bValue = b.level;

      return order === "ascending" ? aValue - bValue : bValue - aValue;
    });
  };

  const sortItemsAlphabetically = (data, order) => {
    return data.sort((a, b) => {
      const aValue = a.title.fr.toLowerCase();
      const bValue = b.title.fr.toLowerCase();

      return order === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const sortItemsByRarity = (data, order) => {
    return data.sort((a, b) => {
      const aValue = a.baseParams.rarity;
      const bValue = b.baseParams.rarity;

      return order === "ascending" ? aValue - bValue : bValue - aValue;
    });
  };

  const sortData = (data, sortOption) => {
    if (data && sortOption) {
      const { type, order } = sortOption;

      switch (type) {
        case "level":
          return sortItemsByLevel(data, order);

        case "alphabetical":
          return sortItemsAlphabetically(data, order);

        case "rarity":
          return sortItemsByRarity(data, order);

        default:
          console.log("Invalid sorting type");
          return data;
      }
    } else {
      console.log("Invalid data or sort option");
      return data;
    }
  };
  const newFetchItems = async () => {
    if (isLoading) {
      return;
    }
    console.log("newFetchItems called..");
    console.log("isLoading...", isLoading);
    await waitForDbInitialization();
    console.log("db.open..");
    await db.open();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    try {
      const tableNames = filterState.type.map((type) =>
        db.table(type + ".json")
      );

      await db.transaction("rw", tableNames, async () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const combinedItems = [];

        console.log("start of for loop on filterState.type");
        for (const type of filterState.type) {
          console.log("start of for loop on filterState.type");
          let itemsQuery = db.table(type + ".json");

          console.log("itemsQuery before if rarity : ", itemsQuery);
          if (filterState.rarity.length > 0) {
            itemsQuery = itemsQuery.filter(
              (o) => o.baseParams.rarity == filterState.rarity[0]
            );
          }
          console.log("itemsQuery before if searchQuery : ", itemsQuery);
          if (filterState.searchQuery.length > 0) {
            itemsQuery = itemsQuery.filter(
              (o) =>
                o.title.fr.toLowerCase() ==
                filterState.searchQuery.toLowerCase().count()
            );
          }
          console.log("itemsQuery before if levelRange : ", itemsQuery);
          if (
            filterState.levelRange.from > 0 ||
            filterState.levelRange.to < 230
          ) {
            itemsQuery = itemsQuery.filter(
              (o) =>
                o.level >= filterState.levelRange.from &&
                o.level <= filterState.levelRange.to
            );
          }
          console.log("itemsQuery before completeQuery : ", itemsQuery);
          let completeQuery = await itemsQuery.toArray();
          console.log("itemsQuery after completeQuery :", itemsQuery);

          combinedItems.push(completeQuery);
        }

        const flattenedItems = combinedItems.flat();
        const sortedItems = sortData(flattenedItems, filterState.sortBy);

        refItemsValue.current = flattenedItems;
        setItems(refItemsValue.current);
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
    } finally {
      console.log("isLoading...", isLoading);
      db.close();
      console.log("db closed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await newFetchItems();
      setIsLoading(false);
      //.then(setIsLoading(false));
    };

    if (filterState !== null) {
      console.log("selectedItemTypes changed:", filterState.type);
      console.log("is loading ?: ", isLoading);
      // setCurrentPage(1); // Reset page to 1 when a new type is selected
      fetchData();
    }
  }, [currentPage, filterState]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD &&
        !isFetching
      ) {
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
      {!isLoading && items.map((item) => <Card key={item.id} item={item} />)}
    </div>
  );
};

export default ItemList;
