import React from "react";
import { useTranslation } from "react-i18next";

const RecipeCard = ({ item, lang }) => {
  const { t, i18n } = useTranslation();

  //TODO: translation, better card presentation

  return (
    <div>
      {item.recipes.length != 0 ? (
        item.recipes[0].map((recipeItem, index) => (
          <div
            key={`${item.id}-${index}`}
            data-id={`${item.id}-${index}`}
          >
            {recipeItem.quantity} x {recipeItem.item.title.fr} ({recipeItem.item.rarity})
          </div>
        ))
      ) : (
        <div>Pas de recette</div>
      )}
    </div>
  );
};

export default RecipeCard;
