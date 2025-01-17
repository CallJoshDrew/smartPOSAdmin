'use client';

import { createContext, useState, ReactNode } from 'react';

type OutletData = {
  name: string;
  businessRegNo: string;
  tradingLicense: string;
  address1: string;
  address2?: string;
  address3?: string;
  postcode: string;
  state: string;
  contactNumber: string;
  countryCode: string;
  email: string;
};

type OutletContextType = {
  outlets: OutletData[];
  setOutlets: (outlets: OutletData[]) => void;
};

const defaultOutletData: OutletData[] = [];

export const OutletContext = createContext<OutletContextType>({
  outlets: defaultOutletData,
  setOutlets: () => {},
});

type Props = {
  children: ReactNode;
};

export function OutletProvider({ children }: Props) {
  const [outlets, setOutlets] = useState<OutletData[]>(defaultOutletData);

  return (
    <OutletContext.Provider value={{ outlets, setOutlets }}>
      {children}
    </OutletContext.Provider>
  );
}
