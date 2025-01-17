'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/profile-settings';
import { OutletSettings } from '@/components/outlet-settings';
import { UserSettings } from '@/components/user-settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mt-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="outlet">Outlet</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="outlet">
            <OutletSettings />
          </TabsContent>
          <TabsContent value="users">
            <UserSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
