"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import localStorageService, { PageState } from "@/services/local-storage.service";

type PageStateContextType = {
  pageState: PageState;
  setPageState: (pageState: PageState) => void;
  isSwitchingNetwork: boolean;
  setIsSwitchingNetwork: (isSwitchingNetwork: boolean) => void;
};

const PageStateContext = createContext<PageStateContextType>({} as PageStateContextType);

export const PageStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [pageState, setPageState] = useState<PageState>(localStorageService.getPageState());
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  return (
    <PageStateContext.Provider value={{ pageState, setPageState, isSwitchingNetwork, setIsSwitchingNetwork }}>{children}</PageStateContext.Provider>
  );
};

export function usePageState() {
  const context = useContext(PageStateContext);
  return context;
}