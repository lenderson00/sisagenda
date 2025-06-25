import { atom, useAtom } from "jotai";

type ViewType = "list" | "calendar";

const supplierView = atom<ViewType>("list");

export const useSupplierView = () => {
  const [viewMode, setViewMode] = useAtom(supplierView);

  const toggleView = () => {
    setViewMode(viewMode === "list" ? "calendar" : "list");
  };

  return {
    viewMode,
    setViewMode,
    toggleView,
  };
};
