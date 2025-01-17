'use client';

import { createContext, useState, ReactNode } from 'react';

type TableData = {
  id: string;
  name: string;
  seats: number;
};

type TableContextType = {
  tables: TableData[];
  setTables: (tables: TableData[]) => void;
};

const defaultTableData: TableData[] = [];

export const TableContext = createContext<TableContextType>({
  tables: defaultTableData,
  setTables: () => {},
});

type Props = {
  children: ReactNode;
};

export function TableProvider({ children }: Props) {
  const [tables, setTables] = useState<TableData[]>(defaultTableData);

  return (
    <TableContext.Provider value={{ tables, setTables }}>
      {children}
    </TableContext.Provider>
  );
}
