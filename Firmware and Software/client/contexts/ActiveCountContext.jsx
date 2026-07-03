import { createContext, useContext, useState } from "react";

const ActiveCountContext = createContext();

export const ActiveCountProvider = ({ children }) => {
  const [activeCount, setActiveCount] = useState(0);

  return (
    <ActiveCountContext.Provider value={{ activeCount, setActiveCount }}>
      {children}
    </ActiveCountContext.Provider>
  );
};

export const useActiveCount = () => useContext(ActiveCountContext);
