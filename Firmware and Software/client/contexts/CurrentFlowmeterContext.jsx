import { createContext, useContext, useState } from "react";

const CurrentFlowmeterContext = createContext();

export const CurrentFlowmeterProvider = ({ children }) => {
  const [currentFlowmeter, setCurrentFlowmeter] = useState(null);

  return (
    <CurrentFlowmeterContext.Provider
      value={{ currentFlowmeter, setCurrentFlowmeter }}
    >
      {children}
    </CurrentFlowmeterContext.Provider>
  );
};

export const useCurrentFlowmeter = () => useContext(CurrentFlowmeterContext);
