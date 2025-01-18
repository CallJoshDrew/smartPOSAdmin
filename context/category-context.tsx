'use client';

import { createContext, useState, ReactNode } from 'react';

type CategoryData = {
  id: string;
  name: string;
};

type CategoryContextType = {
  categories: CategoryData[];
  setCategories: (categories: CategoryData[]) => void;
};

const defaultCategoryData: CategoryData[] = [
  { id: '1', name: 'Dishes' },
  { id: '2', name: 'Drinks' },
  { id: '3', name: 'Cakes' },
  { id: '4', name: 'Promo' },
  { id: '5', name: 'Special' },
  { id: '6', name: 'Add On' },
];

export const CategoryContext = createContext<CategoryContextType>({
  categories: defaultCategoryData,
  setCategories: () => {},
});

type Props = {
  children: ReactNode;
};

export function CategoryProvider({ children }: Props) {
  const [categories, setCategories] = useState<CategoryData[]>(defaultCategoryData);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}
