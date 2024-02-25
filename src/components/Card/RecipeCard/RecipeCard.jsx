import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchRecipe } from "../../../services/data-service.jsx";

const RecipeCard = ({ item, lang }) => {
  const { t, i18n } = useTranslation();
  const [isRecipeLoading, setIsRecipeLoading] = useState(true);
  const [cardItem, setItem] = useState(item);

  useEffect(() => {
    const fetchCardRecipe = async (item) => {
      let fetchRecipeRes = await fetchRecipe(item);
      if (fetchRecipeRes !== undefined) {
        item.recipes = fetchRecipeRes;
      }
      setIsRecipeLoading(false);
      setItem(item);
    };
    fetchCardRecipe(item);
  }, []);

  return (
    <div>
      {isRecipeLoading ? (
        <div>Recipe is loading, please wait a few seconds...</div>
      ) : cardItem.recipes && cardItem.recipes.length != 0 ? (
        cardItem.recipes[0].map((recipeItem, index) => (
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
