import cardCSS from "./Card.module.scss";
import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const Card = ({ item, lang }) => {
  const { t, i18n } = useTranslation();
  const [triToggle, setTriToggle] = useState(2);

  const handleTriToggleClick = (e) => {
    setTriToggle(e);
    console.log(triToggle);
  };

  const rarities = {
    1: "Commun",
    2: "Rare",
    3: "Mythique",
    4: "Légendaire",
    5: "Épique",
    6: "Souvenir",
    7: "Relique",
  };

  // console.log(item.droprates);
  const rarity = rarities[item.baseParams.rarity];
  const rarityIcon = `/rarities/${item.baseParams.rarity}.png`;
  // console.log(rarity);

  // item.equipEffects.map((effect, index) =>
  //     console.log(effect.effect.stats.display.fr)
  // );
  const handleClick = (e) => {
    const propertyValue = e.currentTarget.dataset.id;
    console.log(propertyValue);
  };

  // console.log(item);

  return (
    <div className={cardCSS["card-container"]}>
      <div className={cardCSS["card"]}>
        <div className={cardCSS["top-card-container"]}>
          <div className={cardCSS["header-top-row"]}>
            <div className={cardCSS["header-left-top-container"]}>
              <div
                className={`${cardCSS["item-name-container"]} ${cardCSS["test"]}`}
              >
                <a
                  href="/fr/encyclopedie/objet/120/8222"
                  className={cardCSS["item-name"]}
                >
                  {item.title[lang]}
                </a>
              </div>
            </div>
            <div className={cardCSS["header-right-top-container"]}>
              <div className={cardCSS["image-square"]}></div>
            </div>
          </div>
          <div className={cardCSS["header-bottom-row"]}>
            <div className={cardCSS["header-left-bottom-container"]}>
              <div className={cardCSS["item-type-level-container"]}>
                <div className={cardCSS["item-type-icon-container"]}>
                  <Image
                    src="/itemTypes/120-amulette.png"
                    className={cardCSS["item-type-icon"]}
                    alt="amulette"
                    width={32}
                    height={32}
                  ></Image>
                </div>
                <span className={cardCSS["item-type-level-text"]}>
                  {t("Level")} -
                </span>
                <span className={cardCSS["item-type-level-text-number"]}>
                  {item.level}
                </span>
              </div>
              <div className={cardCSS["item-rarity-container"]}>
                <div className={cardCSS["item-rarity-icon-container"]}>
                  <Image
                    src={rarityIcon}
                    className={cardCSS["rarity-icon"]}
                    alt="rarity icon"
                    width={32}
                    height={32}
                    style={{ height: "auto" }}
                  ></Image>
                </div>
                <span
                  className={`${cardCSS["item-rarity-text"]} ${cardCSS[rarity]}`}
                >
                  {rarity}
                </span>
              </div>
            </div>
            <div className={cardCSS["header-right-bottom-container"]}>
              <div className={cardCSS["toggle-tabs-container"]}>
                <div
                  onClick={() => handleTriToggleClick(0)}
                  className={`${cardCSS["toggle-icon"]} ${
                    cardCSS["drop-icon"]
                  } ${
                    triToggle === 0
                      ? cardCSS["opacity-100"]
                      : cardCSS["opacity-30"]
                  }`}
                ></div>
                <div
                  onClick={() => handleTriToggleClick(1)}
                  className={`${cardCSS["toggle-icon"]} ${
                    cardCSS["recipe-icon"]
                  } ${
                    triToggle === 1
                      ? cardCSS["opacity-100"]
                      : cardCSS["opacity-30"]
                  }`}
                ></div>
                <div
                  onClick={() => handleTriToggleClick(2)}
                  className={`${cardCSS["toggle-icon"]} ${
                    cardCSS["item-icon"]
                  }  ${
                    triToggle === 2
                      ? cardCSS["opacity-100"]
                      : cardCSS["opacity-30"]
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${cardCSS["middle-card-container"]} ${
            triToggle === 0 ? cardCSS["visible"] : cardCSS["hidden"]
          }`}
        >
          {item.droprates ? (
            Object.entries(item.droprates).map(([key, value], index) => (
              <div key={index} className={cardCSS["item-drop-container"]}>
                <span
                  className={cardCSS["item-drop"]}
                >{`${key}: ${value}`}</span>
              </div>
            ))
          ) : (
            <span>Pas obtenable sur des monstres!</span>
          )}
        </div>
        <div
          className={`${cardCSS["middle-card-container"]} ${
            triToggle === 1 ? cardCSS["visible"] : cardCSS["hidden"]
          }`}
        >
          <span>Pas de recette!</span>
        </div>
        <div
          className={`${cardCSS["middle-card-container"]} ${
            triToggle === 2 ? cardCSS["visible"] : cardCSS["hidden"]
          }`}
        >
          {item.equipEffects.map((effect, index) => (
            <div
              key={index}
              className={cardCSS["item-stat-container"]}
              data-id={effect.effect.stats.display.property}
              onClick={(e) => handleClick(e)}
            >
              <span className={cardCSS["item-stat"]}>
                {effect.effect.stats.display[lang]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
