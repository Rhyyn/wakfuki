import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import styles from "../../styles/Home.module.scss";
import { useTranslation } from "next-i18next";
import fetchItemsById from "../components/QueryItemTypes/QueryItemTypes";
import { ItemList, length_recipes } from "../components/ItemList/ItemsList.jsx";
import { store_file } from "../services/data-service.jsx";
import { Filter } from "../components/Filter/Filter.jsx";
import { Header } from "../components/Header/Header.jsx";
import "./i18n";

const Home = () => {
    const { t } = useTranslation();
    const [selectedType, setSelectedType] = useState(null);
    const [filterState, setFilterState] = useState({
        searchQuery: "",
        rarity: [],
        levelRange: { from: 0, to: 230 },
        type: [],
        stats: [],
    });

    const [resetFiltersFlag, setResetFiltersFlag] = useState(false);

    const handleResetFilters = () => {
        console.log("handleResetFilters called");
        setFilterState({
            searchQuery: "",
            rarity: [],
            levelRange: { from: 0, to: 230 },
            type: [],
            stats: [],
        });
        setResetFiltersFlag(true);
    };

    // const handleResetFilters = useCallback(() => {
    //     console.log("handleResetFilters called");
    //     setFilterState({
    //         searchQuery: "",
    //         rarity: [],
    //         levelRange: { from: 0, to: 230 },
    //         type: [],
    //         stats: [],
    //     });

    //     setResetFiltersFlag(true);
    // }, [filterState]);

    useEffect(() => {
        setResetFiltersFlag(false);
    }, [resetFiltersFlag]);

    const handleLogClick = async () => {
        try {
            fetchItemsById();
        } catch (error) {
            console.error("Error fetching and processing data:", error);
        }
    };

    const handleTypeFilter = (types) => {
        console.log("Filtering items by types:", types);
        setSelectedType(types);
        // fetchItemsById(types);
    };

    const handleSearchChange = (newSearchQuery) => {
        console.log("handleSearchChange called");
        setFilterState((prevState) => ({
            ...prevState,
            searchQuery: newSearchQuery,
        }));
    };

    const handleRarityChange = (newRarity) => {
        console.log("handleRarityChange called");
        setFilterState((prevState) => ({ ...prevState, rarity: newRarity }));
    };

    const handleLevelChange = (newLevelRange) => {
        console.log("handleLevelChange called");
        setFilterState((prevState) => ({
            ...prevState,
            levelRange: newLevelRange,
        }));
    };

    const handleTypeChange = (newType) => {
        console.log("handleTypeChange called");
        setFilterState((prevState) => ({ ...prevState, type: newType }));
    };

    const handleStatsChange = (newStats) => {
        console.log("handleTypeChange called");
        setFilterState((prevState) => ({ ...prevState, stats: newStats }));
    };

    useEffect(() => {
        console.log(filterState);
    }, [filterState]);

    return (
        <>
            <Head>
                <title>WakfuKi</title>
                <meta name="description" content={t("Titre_desc")} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Filter
                    handleLogClick={() => handleLogClick}
                    length_recipes={length_recipes}
                    store_file={store_file}
                    handleTypeFilter={() => handleTypeFilter}
                    handleRarityChange={() => handleRarityChange}
                    handleTypeChange={() => handleTypeChange}
                    handleSearchChange={() => handleSearchChange}
                    handleLevelChange={() => handleLevelChange}
                    handleResetFilters={handleResetFilters}
                    resetFiltersFlag={resetFiltersFlag}
                ></Filter>

                <div className={styles["global-container"]}>
                    {/* <Header></Header> */}
                    <div className={styles["item-list"]}>
                        {selectedType != null && (
                            <ItemList
                                key={selectedType.toString()}
                                selectedType={selectedType}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
