'use client';

import { createContext, useState, ReactNode } from 'react';

type ProfileData = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  countryCode: string;
};

type ProfileContextType = {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
};

const defaultProfileData: ProfileData = {
  id: '',
  name: '',
  email: '',
  contactNumber: '',
  countryCode: '+60',
};

export const ProfileContext = createContext<ProfileContextType>({
  profileData: defaultProfileData,
  setProfileData: () => {},
});

type Props = {
  children: ReactNode;
};

export function ProfileProvider({ children }: Props) {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
}
