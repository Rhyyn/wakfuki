"use client";
import React, { useState, useEffect, useRef } from "react";
import filesLength from "../../../public/files_length.json";
// import dbInstance from "./database-open.jsx";
import { waitForDbInitialization, db } from "../../services/data-service.jsx";
import Card from "../Card/Card.jsx";
import cssModule from "./ItemList.module.scss";

const ITEMS_PER_PAGE = 40;
const SCROLL_THRESHOLD = 100;

const ItemList = ({ selectedType }) => {
    console.log("ItemList rendering");
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState([]);
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

            let itemsQuery = db.table("recipes.json");
            const expectedItemCount = filesLength["recipes.json"] || 0;
            itemsQuery
                .count()
                .then((count) => {
                    if (count == expectedItemCount) {
                        // maybe check for random object?
                        console.log(
                            `Number of records in "recipes.json" table: ${count}, expected: ${expectedItemCount}`
                        );
                    }
                })
                .catch((error) => {
                    console.error(`Error getting count: ${error}`);
                });
            // if (selectedType.length > 1) {
            //     itemsQuery = itemsQuery
            //         .where("baseParams.itemTypeId")
            //         .anyOf(selectedType);
            // } else {
            //     itemsQuery = itemsQuery
            //         .where("baseParams.itemTypeId")
            //         .equals(selectedType);
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

    const fetchItems = async () => {
        console.log("Fetching...");
        await waitForDbInitialization();

        try {
            if (isLoading) return;

            setIsLoading(true);

            let itemsQuery = db.table("formatedItems.json");
            if (selectedType.length > 1) {
                itemsQuery = itemsQuery
                    .where("baseParams.itemTypeId")
                    .anyOf(selectedType);
            } else {
                itemsQuery = itemsQuery
                    .where("baseParams.itemTypeId")
                    .equals(selectedType);
            }

            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

            const itemsData = await itemsQuery
                .offset(startIndex)
                .limit(ITEMS_PER_PAGE)
                .toArray();

            // console.log(itemsData);

            setItems((prevItems) => [...prevItems, ...itemsData]);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setIsLoading(false);
            console.log(".. Fetching completed");
        }
    };

    useEffect(() => {
        if (selectedType !== null) {
            console.log("SelectedType changed:", selectedType);
            console.log("is loading ?: ", isLoading);
            // setCurrentPage(1); // Reset page to 1 when a new type is selected
            fetchItems();
        }
    }, [currentPage, selectedType]);

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
