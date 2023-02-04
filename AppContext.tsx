import { createContext } from "react";
import { GlobalProps } from "./public/Assets/Types/types";

const contextInitialValues: GlobalProps = {
  isArabic: null,
};

const AppContext = createContext<GlobalProps>(contextInitialValues);

export default AppContext;
