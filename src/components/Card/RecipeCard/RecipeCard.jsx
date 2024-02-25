import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { fetchRecipe } from "../../../services/data-service.jsx";

const RecipeCard = ({ item, lang }) => {
  const { t, i18n } = useTranslation();
  const [isRecipeLoading, setIsRecipeLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      let fetchedRecipes = await fetchRecipe(item);
      if (fetchedRecipes !== undefined) {
        setRecipes(fetchedRecipes);
      }
      setIsRecipeLoading(false);
    };
    fetchRecipes();
  }, [item]);

  return (
    <div>
      {isRecipeLoading ? (
        <div>Recipe is loading, please wait a few seconds...</div>
      ) : recipes && recipes.length !== 0 ? (
        recipes.map((recipe) =>
          recipe.ingredients.map((ingredient, index) => (
            <div
              key={`${item.id}-${index}`}
              data-id={`${item.id}-${index}`}
            >
              {ingredient.quantity} x {ingredient.item.title[lang]} ({ingredient.item.rarity})
            </div>
          ))
        )
      ) : (
        <div>Pas de recette</div>
      )}
    </div>
  );
};

export default RecipeCard;
