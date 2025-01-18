'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserContext } from '@/context/user-context';
import { v4 as uuidv4 } from 'uuid';

const roles = [
  'Admin',
  'Staff',
  'Owner',
];

const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  image: z.string().optional(),
  imageName: z.string().optional(),
});

type UserSchema = z.infer<typeof userSchema>;

export function UserSettings() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const { users, setUsers } = useContext(UserContext);
  const [editingUser, setEditingUser] = useState<UserSchema | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserSchema | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: '',
      name: '',
      role: '',
      password: '',
      image: '',
      imageName: '',
    },
  });

  const onSubmit = (data: UserSchema) => {
    const isDuplicate = users.some(
      (user) =>
        user.name.toLowerCase() === data.name.toLowerCase() &&
        (editingUser ? user.id !== editingUser.id : true)
    );

    if (isDuplicate) {
      form.setError('name', {
        type: 'manual',
        message: 'User name already exists.',
      });
      return;
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...data, id: u.id } : u));
      toast({
        title: 'User Updated',
        description: 'User settings have been updated successfully.',
      });
    } else {
      const newUser = { ...data, id: uuidv4() };
      setUsers([...users, newUser]);
      toast({
        title: 'User Created',
        description: 'User has been created successfully.',
      });
    }
    setShowForm(false);
    setEditingUser(null);
    form.reset();
    setSelectedImage(null);
  };

  const handleEdit = (user: UserSchema) => {
    setEditingUser(user);
    form.reset(user);
    setShowForm(true);
    setSelectedImage(user.image || null);
  };
	

  const handleDelete = (user: UserSchema) => {
    setUserToDelete(user);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      toast({
        title: 'User Deleted',
        description: 'User has been deleted successfully.',
      });
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    form.reset();
    setSelectedImage(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('image', reader.result as string);
        form.setValue('imageName', file.name);
        setSelectedImage(reader.result as string);
        setImageFileName(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue('image', '');
      form.setValue('imageName', '');
      setSelectedImage(null);
      setImageFileName(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">User Settings</h2>
        {!showForm && (
          <Button size="sm" onClick={() => {
            setShowForm(true);
            form.reset({
              id: '',
              name: '',
              role: '',
              password: '',
              image: '',
              imageName: '',
            });
            setSelectedImage(null);
          }}>
            + User
          </Button>
        )}
      </div>

      {users.length === 0 && !showForm && (
        <p>There are no users, please add a user.</p>
      )}

      {users.length > 0 && !showForm && (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between border p-2 rounded-md">
              <div className="flex items-center space-x-4">
                {user.image && (
                  <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.role}</div>
                </div>
              </div>
              <div>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={cancelDelete}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" id="name" placeholder="Enter user name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="role">Role <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Input type="password" id="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
  control={form.control}
  name="imageName"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="image">Image</FormLabel>
      <FormControl>
        <Input type="file" id="image" accept="image/*" onChange={handleImageChange} />
      </FormControl>
      {selectedImage && (
        <div className="mt-2 flex items-center space-x-2">
          <img src={selectedImage} alt="User Image" className="w-32 h-32 object-cover rounded-md" />
          <FormControl>
            <Input
              type="text"
              {...field}
              placeholder="Enter image filename"
            />
          </FormControl>
        </div>
      )}
      <FormMessage />
    </FormItem>
  )}
/>
            <div className="flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" type="submit">Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
