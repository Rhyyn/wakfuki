import React, { useState, useEffect, useRef } from "react";
import { waitForDbInitialization, db } from "../../services/data-service.jsx";
import Card from "../Card/Card.jsx";
import cssModule from "./ItemList.module.scss";
import string_to_item_types from "../../data/string_to_item_types.json";

const ITEMS_PER_PAGE = 40;
const SCROLL_THRESHOLD = 100;

const ItemList = ({ filterState }) => {
  console.log(filterState);
  // console.log("ItemList rendering");
  // console.log("selectedItemTypes", selectedItemTypes);
  // console.log("selectedItemTypesLength", selectedItemTypes.length);
  // console.log("filterState", filterState);

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

  // searchQuery: "",
  //   rarity: [],
  //   levelRange: { from: 0, to: 230 },
  //   type: [],
  //   stats: [],
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

  // only fetch when item types changes
  const fetchItems = async () => {
    console.log("Fetching...");
    await waitForDbInitialization();
    await db.open();
    const selectedItemDict = await get_typeId_from_string(filterState.type);

    try {
      if (isLoading) return;
      setIsLoading(true);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      if (
        selectedItemDict &&
        selectedItemDict.length > 0 &&
        selectedItemDict.length === 1
      ) {
        let queryTable = db.table(selectedItemDict[0].itemTypeString + ".json");
        let itemQuery = await queryTable
          .where("baseParams.itemTypeId")
          .equals(parseInt(selectedItemDict[0].itemIds))
          .offset(startIndex)
          .limit(ITEMS_PER_PAGE)
          .toArray();

        refItemsValue.current = itemQuery;
        // forceUpdate();
      } else if (selectedItemDict && selectedItemDict > 2) {
        for (let i = 0; i < selectedItemDict.length; i++) {
          let queryTable = db.table(
            selectedItemDict[0].itemTypeString + ".json"
          );
          let itemsQuery = await queryTable
            .where("baseParams.itemTypeId")
            .anyOf(parseInt(selectedItemDict.itemIds))
            .offset(startIndex)
            .limit(ITEMS_PER_PAGE)
            .toArray();

          refItemsValue.current = refItemsValue.current + itemsQuery;
        }
        // forceUpdate();
      } else {
        console.log("Error while fetching items from the DB");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      console.log(refItemsValue);
      setIsLoading(false);
      db.close();
      console.log(".. Fetching completed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await newFetchItems().then(setIsLoading(false));
    };

    if (filterState !== null) {
      console.log("selectedItemTypes changed:", filterState.type);
      console.log("is loading ?: ", isLoading);
      // setCurrentPage(1); // Reset page to 1 when a new type is selected
      // fetchItems();
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
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default ItemList;
