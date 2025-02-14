"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { defaultLocale, getDict } from "@/dicts";

type DictContextType = {
  dict: Awaited<ReturnType<typeof getDict>>;
};

const DictContext = createContext<DictContextType>({
  dict: {} as Awaited<ReturnType<typeof getDict>>,
});

export const DictProvider = ({
  params,
  children,
}: {
  params: Promise<{ lang: "en" | "ja" }>;
  children: ReactNode;
}) => {
  const [dict, setDict] = useState<Awaited<ReturnType<typeof getDict>> | null>(
    null
  );

  useEffect(() => {
    async function loadDict() {
      const { lang } = await params;
      const dict = await getDict(lang);
      setDict(dict);
    }
    loadDict();
  }, [params]);

  if (!dict) {
    return null;
  }

  return (
    <DictContext.Provider value={{ dict }}>{children}</DictContext.Provider>
  );
};

// Custom hook để lấy dict từ context
export function useDict() {
  return useContext(DictContext).dict;
}
