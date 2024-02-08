import cssModule from "./card.module.scss";
import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

// TODO: Add stats img to localstorage
// Fix missing stats img
// Figure out CDN for item img
// Cache image to localStorage maybe?
// Figure out global container div for middle container
// so it doesnt change height if no recipe

const Card = ({ item, lang }) => {
  const { t, i18n } = useTranslation();
  const [triToggle, setTriToggle] = useState(1);

  const handleTriToggleClick = (value) => {
    setTriToggle(value);
  };

  const handleCopyToClipBoard = () => {
    navigator.clipboard.writeText(item.title[lang]);
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

  const logNonSortedStats = (priority_order) => {
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
    logNonSortedStats(priority_order);
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
    <div className={cssModule["card"]}>
      <div className={cssModule["top-card-container"]}>
        <div className={cssModule["header-top-row"]}>
          <div className={cssModule["header-left-top-container"]}>
            <div
              className={`${cssModule["item-name-container"]} ${cssModule["test"]}`}
            >
              <span className={cssModule["item-name"]}>{item.title[lang]}</span>
            </div>
          </div>
          <div className={cssModule["header-right-top-container"]}>
            <div className={cssModule["image-square"]}></div>
          </div>
        </div>
        <div className={cssModule["header-bottom-row"]}>
          <div className={cssModule["item-type-level-container"]}>
            <div className={cssModule["item-type-icon-container"]}>
              <Image
                src="/itemTypes/120-amulette.png"
                className={cssModule["item-type-icon"]}
                alt="amulette"
                width={24}
                height={24}
              ></Image>
            </div>
            <span className={cssModule["item-type-level-text"]}>
              {t("Level")} -
            </span>
            <span className={cssModule["item-type-level-text-number"]}>
              {item.level}
            </span>
          </div>
          <div className={cssModule["item-rarity-container"]}>
            <div className={cssModule["item-rarity-icon-container"]}>
              <Image
                src={rarityIcon}
                className={cssModule["rarity-icon"]}
                alt="rarity icon"
                width={24}
                height={24}
                style={{ height: "auto" }}
              ></Image>
            </div>
            <span style={{ color: "#C2C2C2" }}> - </span>
            <span
              className={`${cssModule["item-rarity-text"]} ${cssModule[rarity]}`}
            >
              {rarity}
            </span>
          </div>
        </div>
      </div>
      <div // DROPRATES
        className={`${cssModule["middle-card-container"]} ${
          triToggle === 2 ? cssModule["visible"] : cssModule["hidden"]
        }`}
      >
        {item.droprates ? (
          Object.entries(item.droprates).map(([key, value], index) => (
            <div key={index} className={cssModule["item-drop-container"]}>
              <span
                className={cssModule["item-drop"]}
              >{`${key}: ${value}`}</span>
            </div>
          ))
        ) : (
          <span>Pas obtenable sur des monstres!</span>
        )}
      </div>
      <div // RECIPE
        className={`${cssModule["middle-card-container"]} ${
          triToggle === 0 ? cssModule["visible"] : cssModule["hidden"]
        }`}
      >
        <span>Pas de recette!</span>
      </div>
      <div // STATS - TODO : Maybe add onClick to filter by this stat?
        className={`${cssModule["middle-card-container"]} ${
          triToggle === 1 ? cssModule["visible"] : cssModule["hidden"]
        }`}
      >
        {item.equipEffects.map((effect, index) => (
          <div
            key={index}
            className={cssModule["item-stat-container"]}
            data-id={effect.effect.stats.display.property}
            onClick={(e) => handleClick(e)}
          >
            <Image 
              alt={effect.effect.stats.stat_string_desc[lang]} 
              width={20} 
              height={18}
              style={{ height: "auto" }}
              src={`/stats/${effect.effect.stats.property}.png`} />
            <span
              className={cssModule["stat-string-value"]}
              style={{
                color: effect.effect.stats.stat_string_value.startsWith("-")
                  ? "#FF6347"
                  : "#ffffff",
              }}
            >
              {effect.effect.stats.stat_string_value}
            </span>
            <span
              className={cssModule["stat-string-desc"]}
              style={{
                color: effect.effect.stats.stat_string_value.startsWith("-")
                  ? "#FF6347"
                  : "#C2C2C2",
              }}
            >
              {effect.effect.stats.stat_string_desc[lang]}
            </span>
          </div>
        ))}
      </div>
      <div className={cssModule["footer-container"]}>
        <div
          className={`${cssModule["footer-icon-container"]} ${
            triToggle === 0 ? cssModule["footer-icon-container-selected"] : null
          }`}
          onClick={() => handleTriToggleClick(0)}
        >
          {triToggle === 0 ? (
            <Image
              alt="Recipe"
              width={30}
              height={30}
              src="/UI-icons/Card/Footer/recipe-book-yellow.png"
            />
          ) : (
            <Image
              alt="Recipe"
              width={30}
              height={30}
              src="/UI-icons/Card/Footer/recipe-book-white.png"
            />
          )}
        </div>
        <div
          className={`${cssModule["footer-icon-container"]} ${
            triToggle === 1 ? cssModule["footer-icon-container-selected"] : null
          }`}
          onClick={() => handleTriToggleClick(1)}
        >
          {triToggle === 1 ? (
            <Image
              alt="Stats"
              width={30}
              height={30}
              src="/UI-icons/Card/Footer/stats-yellow.png"
            />
          ) : (
            <Image
              alt="Stats"
              width={30}
              height={30}
              src="/UI-icons/Card/Footer/stats-white.png"
            />
          )}
        </div>
        <div
          className={`${cssModule["footer-icon-container"]} ${cssModule["clipboard-copy"]}`}
          onClick={() => handleCopyToClipBoard()}
          title={t("copyToClipBoard")}
        >
          {triToggle === 2 ? (
            <Image
              alt="Copy"
              width={30}
              height={30}
              src="/UI-icons/Card/Footer/paste-yellow.png"
            />
          ) : (
            <Image
              alt="Copy"
              width={30}
              height={30}
              src="/UI-icons/Card/Footer/paste-white.png"
            />
          )}
        </div>
        <div
          className={`${cssModule["footer-icon-container"]} ${
            triToggle === 3 ? cssModule["footer-icon-container-selected"] : null
          }`}
          onClick={() => handleTriToggleClick(3)}
        >
          {triToggle === 3 ? (
            <Image
              alt="Droprates"
              width={30}
              height={30}
              src="/UI-icons/Card/Footer/dice-yellow.png"
            />
          ) : (
            <Image
              alt="Droprates"
              width={30}
              height={30}
              src="/UI-icons/Card/Footer/dice-white.png"
            />
          )}
        </div>
        <div
          className={`${cssModule["footer-icon-container"]} ${cssModule["add-icon"]}`}
          title="Disabled, coming soon!"
          style={{ opacity: 0.2 }}
        >
          <Image
            alt="Add"
            width={30}
            height={30}
            src="/UI-icons/Card/Footer/plus-white.png"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
