import { useState, createContext } from "react";

const TrContext = createContext();

function TrProvider({ children }) {
  const [langCode, setLangCode] = useState("uk-UA");

  return (
    <TrContext.Provider value={{ langCode, setLangCode }}>
      {children}
    </TrContext.Provider>
  );
}

export { TrContext, TrProvider };
