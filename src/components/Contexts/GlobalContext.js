import { createContext, useContext, useReducer } from "react";

const filterfilterState = {
  searchQuery: "",
  rarity: [],
  levelRange: { from: 0, to: 230 },
  type: [],
  stats: [],
  sortBy: { type: "level", order: "ascending" },
};

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [filterState, dispatch] = useReducer(globalReducer, filterfilterState);
  // console.log("GlobalContext", filterState);
  return (
    <GlobalContext.Provider value={{ filterState, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a TypeSate");
  }
  return context;
};


const globalReducer = (filterState, action) => {
  switch (action.type) {
    case "UPDATE_GLOBAL_filterState":
      return { ...filterState, filterfilterState: action.payload };
    case "UPDATE_SEARCH_QUERY":
      if (typeof(action.payload) === "string") {
        console.log("setting search query: ", action.payload);
        return { ...filterState, searchQuery: action.payload };
      }
      console.log("Error while trying to set search query", action.payload);
      return filterState;
    case "UPDATE_RARITY":
      if (typeof(action.payload) == "object") {
        console.log("setting rarity: ", action.payload);
        return { ...filterState, rarity: action.payload };
      }
      console.log("Error while trying to set rarity", action.payload);
      return filterState;
    case "UPDATE_LEVEL_RANGE":
      if (typeof(action.payload) == "object") {
        console.log("setting level_range: ", action.payload);
        return { ...filterState, levelRange: action.payload };
      }
      console.log("Error while trying to set level_range", action.payload);
      return filterState;
    case "UPDATE_TYPE":
      if (typeof(action.payload) == "object") {
        console.log("setting type: ", action.payload);
        return { ...filterState, type: action.payload };
      }
      console.log("Error while trying to set type", action.payload);
      return filterState;
    case "UPDATE_STATS":
      if (typeof(action.payload) == "object") {
        console.log("setting stats: ", action.payload);
        return { ...filterState, stats: action.payload };
      }
      console.log("Error while trying to set stats", action.payload);
      return filterState;
    case "UPDATE_SORT_BY":
      return { ...filterState, sortBy: action.payload };
    default:
      return filterState;
  }
};
