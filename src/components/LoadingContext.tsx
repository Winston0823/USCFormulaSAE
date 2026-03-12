"use client";
import { createContext, useContext } from "react";

const LoadingContext = createContext<{ signalReady: () => void }>({
  signalReady: () => {},
});

export const useLoadingSignal = () => useContext(LoadingContext);
export { LoadingContext };
