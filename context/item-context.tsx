'use client';

import { createContext, useState, ReactNode } from 'react';

type ItemData = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  imageName?: string;
};

type ItemContextType = {
  items: ItemData[];
  setItems: (items: ItemData[]) => void;
};

const defaultItemData: ItemData[] = [];

export const ItemContext = createContext<ItemContextType>({
  items: defaultItemData,
  setItems: () => {},
});

type Props = {
  children: ReactNode;
};

export function ItemProvider({ children }: Props) {
  const [items, setItems] = useState<ItemData[]>(defaultItemData);

  return (
    <ItemContext.Provider value={{ items, setItems }}>
      {children}
    </ItemContext.Provider>
  );
}
