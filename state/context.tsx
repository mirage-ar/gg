"use client";

import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";

interface ApplicationContext {
  hasOnboarded: boolean;
  setHasOnboarded: (hasOnboarded: boolean) => void;
}

const defaultContext: ApplicationContext = {
  hasOnboarded: false,
  setHasOnboarded: () => {},
};

const Context = createContext(defaultContext);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("hasOnboarded")) {
      setHasOnboarded(true);
    }
  }, []);

  const value: ApplicationContext = {
    hasOnboarded,
    setHasOnboarded,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApplicationContext() {
  return useContext(Context);
}
