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
};

const PageStateContext = createContext<PageStateContextType>({} as PageStateContextType);

export const PageStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [pageState, setPageState] = useState<PageState>(localStorageService.getPageState());

  return (
    <PageStateContext.Provider value={{ pageState, setPageState }}>{children}</PageStateContext.Provider>
  );
};

export function usePageState() {
  const context = useContext(PageStateContext);
  return context;
}