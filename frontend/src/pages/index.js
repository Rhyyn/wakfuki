// index.js
import Head from "next/head";
import { useState } from "react";
// import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import fetchItemsById from "../components/query-item-types.jsx";
import Card from "../components/card.jsx";
import ItemList from "../components/items-list.jsx";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [selectedType, setSelectedType] = useState(null);
    const handleLogClick = async () => {
        try {
            fetchItemsById(); // Adjust this based on your actual logic
        } catch (error) {
            console.error("Error fetching and processing data:", error);
        }
    };

    const handleTypeFilter = (types) => {
        console.log("Filtering items by types:", types);
        setSelectedType(types);
        // fetchItemsById(types);
    };

    return (
        <>
            <Head>
                <title>WakfuKi</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={`${styles.main} ${inter.className}`}>
                <div>
                    <button onClick={handleLogClick}>Log Data</button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter([254, 108, 110, 115, 113])}>
                        Arme à 1 main
                    </button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter([223, 114, 101, 111, 253, 117])}>
                        Arme à 2 mains
                    </button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter([112, 189])}>
                        Seconde Main
                    </button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter(120)}>Amulette</button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter(103)}>Anneau</button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter(119)}>Bottes</button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter(132)}>Cape</button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter(134)}>Casque</button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter(133)}>Ceinture</button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter(138)}>Epaulettes</button>
                    <button className="cat-buttons" onClick={() => handleTypeFilter(136)}>Plastron</button>
                </div>
                {selectedType != null && <ItemList key={selectedType.toString()} selectedType={selectedType} />}
            </main>
        </>
    );
}