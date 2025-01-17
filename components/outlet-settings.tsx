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
import { OutletContext } from '@/context/outlet-context';
import { Pencil, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
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

const states = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Kuala Lumpur',
  'Labuan',
  'Putrajaya',
];

const countryCodes = [
  { label: 'Malaysia (+60)', value: '+60' },
  { label: 'Singapore (+65)', value: '+65' },
  { label: 'Indonesia (+62)', value: '+62' },
  { label: 'Thailand (+66)', value: '+66' },
  { label: 'Philippines (+63)', value: '+63' },
];

const outletSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  businessRegNo: z.string().min(1, { message: 'Business Registration Number is required' }),
  tradingLicense: z.string().min(1, { message: 'Trading License is required' }),
  address1: z.string().min(1, { message: 'Address 1 is required' }),
  address2: z.string().optional(),
  address3: z.string().optional(),
  postcode: z.string().min(1, { message: 'Postcode is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  contactNumber: z.string().min(1, { message: 'Contact Number is required' }),
  countryCode: z.string().min(1, { message: 'Country Code is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  image: z.string().optional(),
});

type OutletSchema = z.infer<typeof outletSchema>;

export function OutletSettings() {
  const [selectedCountryCode, setSelectedCountryCode] = useState('+60');
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const { outlets, setOutlets } = useContext(OutletContext);
  const [editingOutlet, setEditingOutlet] = useState<OutletSchema | null>(null);
  const [outletToDelete, setOutletToDelete] = useState<OutletSchema | null>(null);

  const form = useForm<OutletSchema>({
    resolver: zodResolver(outletSchema),
    defaultValues: {
      id: '',
      name: '',
      businessRegNo: '',
      tradingLicense: '',
      address1: '',
      address2: '',
      address3: '',
      postcode: '',
      state: '',
      contactNumber: '',
      countryCode: '+60',
      email: '',
      image: '',
    },
  });

  const onSubmit = (data: OutletSchema) => {
    if (editingOutlet) {
      setOutlets(outlets.map(o => o.id === editingOutlet.id ? { ...data, id: o.id } : o));
      toast({
        title: 'Outlet Updated',
        description: 'Your outlet has been updated successfully.',
      });
    } else {
      const newOutlet = { ...data, id: uuidv4() };
      setOutlets([...outlets, newOutlet]);
      toast({
        title: 'Outlet Created',
        description: 'Your outlet has been created successfully.',
      });
    }
    setShowForm(false);
    setEditingOutlet(null);
    form.reset();
  };

  const handleEdit = (outlet: OutletSchema) => {
    setEditingOutlet(outlet);
    setSelectedCountryCode(outlet.countryCode);
    form.reset(outlet);
    setShowForm(true);
  };

  const handleDelete = (outlet: OutletSchema) => {
    setOutletToDelete(outlet);
  };

  const confirmDelete = () => {
    if (outletToDelete) {
      setOutlets(outlets.filter((o) => o.id !== outletToDelete.id));
      toast({
        title: 'Outlet Deleted',
        description: 'Your outlet has been deleted successfully.',
      });
      setOutletToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOutletToDelete(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOutlet(null);
    form.reset();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Outlet Settings</h2>
        {!showForm && (
          <Button size="sm" onClick={() => {
            setShowForm(true);
            form.reset({
              id: '',
              name: '',
              businessRegNo: '',
              tradingLicense: '',
              address1: '',
              address2: '',
              address3: '',
              postcode: '',
              state: '',
              contactNumber: '',
              countryCode: '+60',
              email: '',
              image: '',
            });
          }}>
            + Outlet
          </Button>
        )}
      </div>

      {outlets.length === 0 && !showForm && (
        <p>There is no outlet, please set it now.</p>
      )}

      {outlets.length > 0 && !showForm && (
        <ul className="space-y-2">
          {outlets.map((outlet) => (
            <li key={outlet.id} className="flex items-center justify-between border p-2 rounded-md">
              {outlet.image && (
                <img src={outlet.image} alt={outlet.name} className="w-16 h-16 object-cover rounded-md mr-4" />
              )}
              <div className="flex-1">
                <span className="font-medium">{outlet.name}</span>
                <div className="text-xs text-gray-500">
                  <p>Business Registration Number: {outlet.businessRegNo}</p>
                  <p>Contact Number: {outlet.countryCode} {outlet.contactNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(outlet)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(outlet)}>
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
                    <Input type="text" id="name" placeholder="Enter outlet name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessRegNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="businessRegNo">Business Registration Number <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" id="businessRegNo" placeholder="Enter business registration number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tradingLicense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tradingLicense">Trading License <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" id="tradingLicense" placeholder="Enter trading license" {...field} />
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
                    <Input type="email" id="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="address1">Address 1 <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" id="address1" placeholder="Enter address line 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="address2">Address 2</FormLabel>
                  <FormControl>
                    <Input type="text" id="address2" placeholder="Enter address line 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="address3">Address 3</FormLabel>
                  <FormControl>
                    <Input type="text" id="address3" placeholder="Enter address line 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="postcode">Postcode <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" id="postcode" placeholder="Enter postcode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="state">State <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
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
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Select value={selectedCountryCode} onValueChange={(value) => {
                        setSelectedCountryCode(value);
                        form.setValue('countryCode', value);
                      }}>
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
                      <Input type="tel" id="contactNumber" placeholder="Enter contact number" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="image">Image</FormLabel>
                  <FormControl>
                    <Input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                  </FormControl>
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
