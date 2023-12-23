"use client";
import styles from "@/styles/Home.module.scss";
import cardCSS from "../styles/card.module.scss";
import { db } from "./data-service.jsx";
import { clsx } from "clsx";

const Card = ({ item }) => {
    // const combinedClasses = classNames(...[cardCSS.cardFilterIcon, cardCSS.toggleStatImg]);
    // const combinedClasses = classNames("cardFilterIcon")

    return (
        <div className={cardCSS["card-container"]}>
            <div className={cardCSS.card}>
                <div className={cardCSS["top-card-container"]}>
                    <div className={cardCSS["left-top-card-container"]}>
                        <div className={`${cardCSS["item-name-container"]} ${cardCSS["test"]}`}>
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
                                Amulette - {item.definition.item.level}
                            </a>
                        </div>
                        <div className={cardCSS["item-rarity-container"]}>
                            <div
                                className={
                                    cardCSS["item-rarity-icon-container"]
                                }
                            >
                                <img
                                    src="/rarities/3.png"
                                    className={cardCSS["rarity-icon"]}
                                ></img>
                            </div>
                            <span className={cardCSS["item-rarity-text"]}>
                                Légendaire
                            </span>
                        </div>
                    </div>
                    <div className={cardCSS["right-top-card-container"]}>
                        <div className={cardCSS["image-square"]}></div>
                    </div>
                </div>
                <div className={cardCSS["middle-card-container"]}>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>{item.id}</span>
                    </div>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>1 Portée</span>
                    </div>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>220 PV</span>
                    </div>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>17 Tacle</span>
                    </div>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>17 Esquive</span>
                    </div>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>
                            71 Maîtrise sur 3 éléments aléatoires
                        </span>
                    </div>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>
                            24 Maîtrise Distance
                        </span>
                    </div>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>
                            4% Coup critique
                        </span>
                    </div>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>
                            20 Résistance Élémentaire
                        </span>
                    </div>
                    <div className={cardCSS["item-stat-container"]}>
                        <div className={cardCSS["temp-stat-image"]}></div>
                        <span className={cardCSS["item-stat"]}>
                            20 Résistance Élémentaire
                        </span>
                    </div>
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
