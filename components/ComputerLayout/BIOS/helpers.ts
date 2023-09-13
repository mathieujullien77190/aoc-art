import { ITEMS } from "./constants";
import { Item } from "./types";

export const getItem = (id: number): Item | undefined => {
  const search = ITEMS.filter((item) => item !== "-" && item.id === id);
  return (search[0] as Item) || undefined;
};
