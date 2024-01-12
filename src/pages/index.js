import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../../styles/Home.module.scss";
import { useTranslation } from "next-i18next";
import fetchItemsById from "../components/QueryItemTypes/QueryItemTypes";
import { ItemList, length_recipes } from "../components/ItemList/ItemsList.jsx";
import { store_file } from "../services/data-service.jsx";
import { Filter } from "../components/Filter/Filter.jsx";
import { Header } from "../components/Header/Header.jsx";
import "./i18n";

const Home = () => {
    const { t } = useTranslation("common");
    const [selectedType, setSelectedType] = useState(null);
    const [filterState, setFilterState] = useState({
        searchQuery: "",
        rarity: [],
        levelRange: { from: 0, to: 230 },
        type: [],
        stats: [],
    });

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
        setFilterState((prevState) => ({
            ...prevState,
            searchQuery: newSearchQuery,
        }));
    };

    const handleRarityChange = (newRarity) => {
        setFilterState((prevState) => ({ ...prevState, rarity: newRarity }));
    };

    const handleLevelChange = (newLevelRange) => {
        setFilterState((prevState) => ({
            ...prevState,
            levelRange: newLevelRange,
        }));
    };

    const handleTypeChange = (newType) => {
        setFilterState((prevState) => ({ ...prevState, type: newType }));
    };

    const handleStatsChange = (newStats) => {
        setFilterState((prevState) => ({ ...prevState, stats: newStats }));
    };

    useEffect(() => {
        console.log(filterState);
    }, [filterState]);

    return (
        <>
            <Head>
                <title>{t("common:WakfuKi")}</title>
                <meta
                    name="description"
                    content={t("common:Generated by create next app")}
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Filter
                    handleLogClick={handleLogClick}
                    length_recipes={length_recipes}
                    store_file={store_file}
                    handleTypeFilter={handleTypeFilter}
                    handleRarityChange={handleRarityChange}
                    handleTypeChange={handleTypeChange}
                    handleSearchChange={handleSearchChange}
                    handleLevelChange={handleLevelChange}
                ></Filter>

                <div className={styles["global-container"]}>
                    <Header></Header>
                    <div className={styles["item-list"]}>
                        <h3>{t("common:Item lists")}</h3>
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
