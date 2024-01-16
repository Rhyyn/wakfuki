import React, { useState, useEffect, useRef } from "react";
import filesLength from "../../../public/files_length.json";
import { waitForDbInitialization, db } from "../../services/data-service.jsx";
import Card from "../Card/Card.jsx";
import cssModule from "./ItemList.module.scss";
import string_to_item_types from "../../data/string_to_item_types.json";

const ITEMS_PER_PAGE = 40;
const SCROLL_THRESHOLD = 100;

// need function to check if data exist and if its valid
// call fetch and store if not

const ItemList = ({ selectedItemTypes, filterState }) => {
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

  const length_recipes = async () => {
    await waitForDbInitialization();
    await db.open().then(() => {
      console.log(db._allTables);
    });

    try {
      if (isLoading) return;

      setIsLoading(true);
      console.log("loading itemList");
      // let itemsQuery = db.table("recipes.json");
      // const expectedItemCount = filesLength["recipes.json"] || 0;
      // itemsQuery
      //   .count()
      //   .then((count) => {
      //     if (count == expectedItemCount) {
      //       // maybe check for random object?
      //       console.log(
      //         `Number of records in "recipes.json" table: ${count}, expected: ${expectedItemCount}`
      //       );
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(`Error getting count: ${error}`);
      //   });
      // if (selectedItemTypes.length > 1) {
      //     itemsQuery = itemsQuery
      //         .where("baseParams.itemTypeId")
      //         .anyOf(selectedItemTypes);
      // } else {
      //     itemsQuery = itemsQuery
      //         .where("baseParams.itemTypeId")
      //         .equals(selectedItemTypes);
      // }

      // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

      // const itemsData = await itemsQuery
      //     .offset(startIndex)
      //     .limit(ITEMS_PER_PAGE)
      //     .toArray();

      // console.log(itemsData);

      // setItems((prevItems) => [...prevItems, ...itemsData]);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const get_typeId_from_string = async (selectedTypes) => {
    let itemsQuery = [];
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

  // only fetch when item types changes
  const fetchItems = async () => {
    console.log("Fetching...");
    await waitForDbInitialization();
    await db.open();
    const selectedItemDict = await get_typeId_from_string(selectedItemTypes);
    console.log("selectedItemDict", selectedItemDict[0]);
    console.log("selectedItemDict length", selectedItemDict.length);
    console.log("selectedItemDict[0].itemIds", parseInt(selectedItemDict[0].itemIds));

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
        console.log("queryTable",queryTable);
        let itemQuery = await queryTable
          .where("baseParams.itemTypeId")
          .equals(parseInt(selectedItemDict[0].itemIds))
          .offset(startIndex)
          .limit(ITEMS_PER_PAGE)
          .toArray();

        console.log("inside");
        console.log(itemQuery);
        refItemsValue.current = itemQuery;
        // setItems((prevItems) => [...prevItems, ...itemQuery]);
      } else if (selectedItemDict && selectedItemDict > 2) {
        let queryTable = db.table(selectedItemDict + ".json");
        let itemsQuery = queryTable
          .where("baseParams.itemTypeId")
          .anyOf(selectedItemDict)
          .offset(startIndex)
          .limit(ITEMS_PER_PAGE)
          .toArray();

        setItems((prevItems) => [...prevItems, ...itemsQuery]);
      } else {
        console.log("Error while fetching items from the DB");
      }
      // let itemsQuery = db.table("formatedItems.json");
      // if (selectedItemTypes.length > 1) {
      //   itemsQuery = itemsQuery
      //     .where("baseParams.itemTypeId")
      //     .anyOf(selectedItemTypes);
      // } else {
      //   itemsQuery = itemsQuery
      //     .where("baseParams.itemTypeId")
      //     .equals(selectedItemTypes);
      // }

      // const itemsData = await itemsQuery
      //   .offset(startIndex)
      //   .limit(ITEMS_PER_PAGE)
      //   .toArray();

      // console.log(itemsData);

      // setItems((prevItems) => [...prevItems, ...itemsData]);
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
    if (selectedItemTypes !== null) {
      console.log("selectedItemTypes changed:", selectedItemTypes);
      console.log("is loading ?: ", isLoading);
      // setCurrentPage(1); // Reset page to 1 when a new type is selected
      fetchItems();
    }
  }, [currentPage, selectedItemTypes]);

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
      <h1>HELLO INSIDE</h1>
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default ItemList;
