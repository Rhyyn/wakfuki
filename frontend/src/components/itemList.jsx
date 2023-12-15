import React, { useState, useEffect, useRef } from "react";
import { db } from "./dataService";
import Card from "./card.jsx";

const ITEMS_PER_PAGE = 40;
const SCROLL_THRESHOLD = 100;

const ItemList = ({ selectedType }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [index, setIndex] = useState(2);
    const isInitialMount = useRef(true);
    const usedIds = [];

    const fetchItems = async () => {
        try {
            if (isLoading) return;

            await db.open();

            setIsLoading(true);

            let itemsQuery = db.table("items.json");
            // let itemStatsQuery = db.table("itemsStats.json");
            // console.log(typeof selectedType);

            if (selectedType.length > 1) {
                itemsQuery = itemsQuery
                    .where("definition.item.baseParameters.itemTypeId")
                    .anyOf(selectedType);
            } else {
                itemsQuery = itemsQuery
                    .where("definition.item.baseParameters.itemTypeId")
                    .equals(selectedType);
            }
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            // console.log(startIndex);

            const itemsData = await itemsQuery
                .offset(startIndex)
                .limit(ITEMS_PER_PAGE)
                .toArray();
            // console.log(itemsData);

            itemsData.forEach((i) => {
                if (i.definition.item.baseParameters.itemTypeId === 304) {
                    console.log(i);
                }
            })

            // const uniqueActionIds = new Set();
            // itemsData.forEach((i) => {
            //     if (i.definition.equipEffects.length > 0) {
            //         const actionId =
            //             i.definition.equipEffects[0].effect.definition.actionId;
            //         if (!uniqueActionIds.has(actionId)) {
            //             // console.log('Logging:', actionId);
            //             uniqueActionIds.add(actionId);
            //         }
            //     }
            //     // console.log('Before condition:', actionId);

            //     // console.log('After condition:', actionId);
            // });

            // const usedIds = Array.from(uniqueActionIds);
            // console.log(
            //     " / Type is :",
            //     selectedType + "| After Loop - usedIds:",
            //     usedIds
            // );

            setItems((prevItems) => [...prevItems, ...itemsData]);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setIsLoading(false);
            db.close();
        }
    };

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

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            fetchItems();
        }
    }, [currentPage, selectedType]);

    return (
        <div className="cards-container">
            {items.map((item) => (
                <Card key={item.definition.item.id} item={item} />
            ))}
        </div>
    );
};

export default ItemList;
