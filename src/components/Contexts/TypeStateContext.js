import { createContext, useContext, useReducer } from "react";

const initialState = {
  stateValue: {},
};

const TypeStateContext = createContext();


export const TypeSateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);
  // console.log("TypeStateContext", state);
  return (
    <TypeStateContext.Provider value={{ state, dispatch }}>
      {children}
    </TypeStateContext.Provider>
  );
};


export const useTypeStateContext = () => {
  const context = useContext(TypeStateContext);
  if (!context) {
    throw new Error("useTypeStateContext must be used within a TypeSate");
  }
  return context;
};

const globalReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_GLOBAL_VALUE":
      return { ...state, stateValue: action.payload };
    default:
      return state;
  }
};
