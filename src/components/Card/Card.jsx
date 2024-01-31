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


  const logNonSortedStats = () => {
    item.equipEffects.forEach((element) => {
      if (!priority_order.includes(element.effect.stats.property)) {
        console.log(
          element.effect.stats.property,
          element.effect.stats.display.en,
          "Is not sorted"
        );
      }
    });
  };

  const sortEffectsWithPriority = (item) => {
    const priority_order = [
      20, // HP
      1068, // Random Mastery
      120, // Elemental Mastery
      122, // Feu Mastery
      123, // Earth Mastery
      124, // Water Mastery
      125, // Air Mastery
      1053, // Distance Mastery
      1052, // Melee Mastery
      1055, // Berserk Mastery
      180, // Rear Mastery
      26, // Healing Mastery
      149, // Critical Mastery
      150, // Critical Chance
      160, // Range
      31, // AP
      41, // MP
      191, // WP
      173, // Lock
      175, // Dodge
      171, // Initiative
      177, // Force of Will
      184, // Control
      875, // Block
      39, // Armor given
      988, // Critical Resistance
      80, // Elemental Resistance
      71, // Rear Resistance
      1069, // Random Resistance
      82, // Fire Resistance
      83, // Water Resistance
      84, // Earth Resistance
      85, // Air Resistance
      979, // Lvl to elemental spells
      2001, // Harvesting Quantity
      21, // - HP
      130, // - Elemental Mastery
      132, // - Feu Mastery
      1060, // - Distance Mastery
      1059, // - Melee Mastery
      1061, // - Berserk Mastery
      181, // - Rear Mastery
      1056, // - Critical Mastery
      168, // - Critical Chance
      56, // - AP
      161, // - Range
      57, // - MP
      192, // - WP
      174, // - Lock
      176, // - Dodge
      172, // - Initiative
      876, // - Block
      1063, // - Rear Resistance
      1062, // - Critical Resistance
      90, // - Elemental Resistance ?
      100, // - Elemental Resistance ?
      97, // - Fire Resistance
      98, // - Water Resistance
      96, // - Earth Resistance
    ];
    logNonSortedStats();
    item.equipEffects.sort((a, b) => {
      const firstIndex = priority_order.indexOf(a.effect.stats.property);
      const secondIndex = priority_order.indexOf(b.effect.stats.property);

      return (
        (firstIndex === -1 ? 25 : firstIndex) -
        (secondIndex === -1 ? 25 : secondIndex)
      );
    });
  };
  sortEffectsWithPriority(item);

  const rarity = rarities[item.baseParams.rarity];
  const rarityIcon = `/rarities/${item.baseParams.rarity}.png`;
  const handleClick = (e) => {
    const propertyValue = e.currentTarget.dataset.id;
    console.log(propertyValue);
  };


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
              {/* <span className={cardCSS["item-stat"]}>
                {effect.effect.stats.display[lang]}
              </span> */}
              <span
                className={cardCSS["item-stat"]}
                style={{
                  color: effect.effect.stats.display[lang].startsWith("-")
                    ? "#FF6347"
                    : "inherit",
                }}
              >
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
