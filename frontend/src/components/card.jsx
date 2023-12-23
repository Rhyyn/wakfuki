"use client";
import styles from "@/styles/Home.module.scss";
import cardCSS from "../styles/card.module.scss";
import { db } from "./data-service.jsx";
import { clsx } from "clsx";

const Card = ({ item }) => {
    // const combinedClasses = classNames(...[cardCSS.cardFilterIcon, cardCSS.toggleStatImg]);
    // const combinedClasses = classNames("cardFilterIcon")

    const rarities = {
        1: "Commun",
        2: "Rare",
        3: "Mythique",
        4: "Légendaire",
        5: "Épique",
        6: "Souvenir",
        7: "Relique",
    };

    // console.log(item);
    const rarity = rarities[item.baseParams.rarity];
    const rarityIcon = `/rarities/${item.baseParams.rarity}.png`;
    // console.log(rarity);

    item.equipEffects.map((effect, index) =>
        console.log(effect.effect.stats.display.fr)
    );

    return (
        <div className={cardCSS["card-container"]}>
            <div className={cardCSS.card}>
                <div className={cardCSS["top-card-container"]}>
                    <div className={cardCSS["left-top-card-container"]}>
                        <div
                            className={`${cardCSS["item-name-container"]} ${cardCSS["test"]}`}
                        >
                            <a
                                href="/fr/encyclopedie/objet/120/8222"
                                className={cardCSS["item-name"]}
                            >
                                {item.title.fr}
                            </a>
                        </div>
                        <div className={cardCSS["item-type-level-container"]}>
                            <div
                                className={cardCSS["item-type-icon-container"]}
                            >
                                <img
                                    src="/itemTypes/120.png"
                                    className={cardCSS["item-type-icon"]}
                                ></img>
                            </div>
                            <a
                                href="/fr/encyclopedie/objet/120/8222"
                                className={cardCSS["item-type-level-text"]}
                            >
                                Amulette - {item.level}
                            </a>
                        </div>
                        <div className={cardCSS["item-rarity-container"]}>
                            <div
                                className={
                                    cardCSS["item-rarity-icon-container"]
                                }
                            >
                                <img
                                    src={rarityIcon}
                                    className={cardCSS["rarity-icon"]}
                                ></img>
                            </div>
                            <span
                                className={`${cardCSS["item-rarity-text"]} ${cardCSS[rarity]}`}
                            >
                                {rarity}
                            </span>
                        </div>
                    </div>
                    <div className={cardCSS["right-top-card-container"]}>
                        <div className={cardCSS["image-square"]}></div>
                    </div>
                </div>
                <div className={cardCSS["middle-card-container"]}>
                    {item.equipEffects.map((effect, index) => (
                        <div
                            key={index}
                            className={cardCSS["item-stat-container"]}
                        >
                            <span className={cardCSS["item-stat"]}>
                                {effect.effect.stats.display.fr}
                            </span>
                        </div>
                    ))}
                </div>
                <div className={cardCSS["bottom-card-container"]}>
                    <div className={cardCSS["bottom-toggle-icon-container"]}>
                        <img
                            src="/toggleDropOn.png"
                            className={
                                cardCSS[("card-filter-icon", "toggle-drop-img")]
                            }
                        ></img>
                    </div>
                    <div className={cardCSS["bottom-toggle"]}></div>
                    <div className={cardCSS["bottom-toggle-icon-container"]}>
                        <img
                            src="/toggleCraftOn.png"
                            className={
                                cardCSS[
                                    ("card-filter-icon", "toggle-craft-img")
                                ]
                            }
                        ></img>
                    </div>
                    {/* <div
                        className={cardCSS["left-bottom-card-container"]}
                    ></div>
                    <div className={cardCSS["right-bottom-card-container"]}></div> */}
                </div>
            </div>
        </div>
    );
};

export default Card;
