'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfileContext } from '@/context/profile-context';
import { v4 as uuidv4 } from 'uuid';

const countryCodes = [
  { label: 'Malaysia (+60)', value: '+60' },
  { label: 'Singapore (+65)', value: '+65' },
  { label: 'Indonesia (+62)', value: '+62' },
  { label: 'Thailand (+66)', value: '+66' },
  { label: 'Philippines (+63)', value: '+63' },
];

const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  contactNumber: z.string().min(1, { message: 'Contact Number is required' }),
  countryCode: z.string().min(1, { message: 'Country Code is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string().min(12, { message: 'Password must be at least 12 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
});

type ProfileSchema = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const [selectedCountryCode, setSelectedCountryCode] = useState('+60');
  const { toast } = useToast();
  const { profileData, setProfileData } = useContext(ProfileContext);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: profileData.id || '',
      name: profileData.name || '',
      contactNumber: profileData.contactNumber || '',
      countryCode: profileData.countryCode || '+60',
      email: profileData.email || '',
      password: '',
    },
  });

  useEffect(() => {
    if (profileData.id) {
      form.reset(profileData);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [profileData, form]);

  const onSubmit = (data: ProfileSchema) => {
    if (!profileData.id) {
      data.id = uuidv4();
    } else {
      data.id = profileData.id;
    }
    setProfileData(data);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const generateId = () => {
    form.setValue('id', uuidv4());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Client Profile Settings</h2>
        </div>
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="id">ID <span className="text-red-500">*</span></FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input type="text" id="id" {...field} disabled={!isEditing} />
                </FormControl>
                <Button type="button" variant="outline" onClick={generateId} disabled={!isEditing}>
                  Generate
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="text" id="name" placeholder="Enter your name" {...field} disabled={!isEditing} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="email" id="email" placeholder="Enter your email" {...field} disabled={!isEditing} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="password" id="password" placeholder="Enter your password" {...field} disabled={!isEditing} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Select
                    value={selectedCountryCode}
                    onValueChange={(value) => {
                      setSelectedCountryCode(value);
                      form.setValue('countryCode', value);
                    }}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((code) => (
                        <SelectItem key={code.value} value={code.value}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormControl>
                  <Input type="tel" id="contactNumber" placeholder="Enter contact number" {...field} disabled={!isEditing} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          {!isEditing && profileData.id && (
            <Button size="sm" type="button" onClick={handleEdit}>
              Edit
            </Button>
          )}
          {isEditing && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  form.reset(profileData);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit">Save</Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
