"use client";
import React, { useState, useEffect, useRef } from "react";
// import dbInstance from "./database-open.jsx";
import { waitForDbInitialization, db } from "./data-service.jsx";
import Card from "./card.jsx";

const ITEMS_PER_PAGE = 40;
const SCROLL_THRESHOLD = 100;

const ItemList = ({ selectedType }) => {
    console.log("ItemList rendering");
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isInitialMount = useRef(true);

    const fetchItems = async () => {
        console.log("ding");
        await waitForDbInitialization();
        await db.open().then(() => {
            console.log(db._allTables);
        });

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
            if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
                setCurrentPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="cards-container">
            {items.map((item) => (
                <Card key={item.id} item={item} />
            ))}
            {isLoading && <p>Loading...</p>}
        </div>
    );
};

export default ItemList;
