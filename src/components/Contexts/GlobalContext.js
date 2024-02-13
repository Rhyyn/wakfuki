import { createContext, useContext, useReducer } from "react";

const globalFilterState = {
  searchQuery: "",
  rarity: [],
  levelRange: { from: 0, to: 230 },
  type: [],
  stats: [],
  sortBy: { type: "level", order: "ascending" },
};

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, globalFilterState);
  return (
    <GlobalContext.Provider value={{ globalFilterState: state, dispatch }}>
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

const globalReducer = (globalFilterState, action) => {
  switch (action.type) {
    case "UPDATE_GLOBAL_globalFilterState":
      return { ...globalFilterState, globalFilterState: action.payload };
    case "UPDATE_SEARCH_QUERY":
      if (typeof action.payload === "string") {
        console.log("setting search query: ", action.payload);
        return { ...globalFilterState, searchQuery: action.payload };
      }
      console.log("Error while trying to set search query", action.payload);
      return globalFilterState;
    case "UPDATE_RARITY":
      if (typeof action.payload == "object") {
        console.log("setting rarity: ", action.payload);
        return { ...globalFilterState, rarity: action.payload };
      }
      console.log("Error while trying to set rarity", action.payload);
      return globalFilterState;
    case "UPDATE_LEVEL_RANGE":
      if (typeof action.payload == "object") {
        console.log("setting level_range: ", action.payload);
        return { ...globalFilterState, levelRange: action.payload };
      }
      console.log("Error while trying to set level_range", action.payload);
      return globalFilterState;
    case "UPDATE_TYPE":
      if (typeof action.payload == "object") {
        console.log("setting type: ", action.payload);
        return { ...globalFilterState, type: action.payload };
      }
      console.log("Error while trying to set type", action.payload);
      return globalFilterState;
    case "UPDATE_STATS":
      if (Array.isArray(action.payload)) {
        console.log("setting stats: ", action.payload);
        return { ...globalFilterState, stats: action.payload };
      }
      console.log("Error while trying to set stats", action.payload);
      return globalFilterState;
    case "UPDATE_SORT_BY":
      return { ...globalFilterState, sortBy: action.payload };
    default:
      return globalFilterState;
  }
};
