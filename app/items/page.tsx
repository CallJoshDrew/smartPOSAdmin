'use client';

import { useState, useEffect, useContext } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemList } from '@/components/item-list';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ItemContext } from '@/context/item-context';

const dummyCategories = [
  { id: '1', name: 'Dishes' },
  { id: '2', name: 'Drinks' },
  { id: '3', name: 'Cakes' },
  { id: '4', name: 'Promo' },
  { id: '5', name: 'Special' },
  { id: '6', name: 'Add On' },
];

const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Item name is required' }),
  price: z.number({
    required_error: 'Please enter a price',
    invalid_type_error: 'Price must be a number',
  }).min(0, { message: 'Price must be at least 0' }),
  category: z.string().min(1, { message: 'Category is required' }),
  image: z.string().optional(),
  imageName: z.string().optional(),
});

type ItemSchema = z.infer<typeof itemSchema>;

export default function ItemsPage() {
  const [categories, setCategories] = useState(dummyCategories);
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const { items, setItems } = useContext(ItemContext);
  const [editingItem, setEditingItem] = useState<ItemSchema | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ItemSchema>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      id: '',
      name: '',
      price: 0,
      category: '',
      image: '',
      imageName: '',
    },
  });

  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab('all');
    }
  }, [categories]);

  const onSubmit = (data: ItemSchema) => {
    const isDuplicate = items.some(
      (item) =>
        item.name.toLowerCase() === data.name.toLowerCase() &&
        (editingItem ? item.id !== editingItem.id : true)
    );

    if (isDuplicate) {
      form.setError('name', {
        type: 'manual',
        message: 'Item name already exists.',
      });
      return;
    }

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? data : item));
      toast({
        title: 'Item Updated',
        description: 'Your item has been updated successfully.',
      });
    } else {
      const newItem = { ...data, id: uuidv4() };
      setItems([...items, newItem]);
      toast({
        title: 'Item Created',
        description: 'Your item has been created successfully.',
      });
    }
    setShowForm(false);
    setEditingItem(null);
    form.reset();
    setSelectedImage(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    form.reset();
    setSelectedImage(null);
  };

  const handleEdit = (item: ItemSchema) => {
    setEditingItem(item);
    form.reset(item);
    setShowForm(true);
    setSelectedImage(item.image || null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('image', reader.result as string);
        form.setValue('imageName', file.name);
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue('image', '');
      form.setValue('imageName', '');
      setSelectedImage(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Items</h1>
        {!showForm && (
          <Button size="sm" onClick={() => {
            setShowForm(true);
            form.reset({
              id: '',
              name: '',
              price: 0,
              category: '',
              image: '',
              imageName: '',
            });
            setSelectedImage(null);
          }}>
            + Item
          </Button>
        )}
      </div>
      <Input type="text" placeholder="Search items..." className="mb-4" />
      {categories.length === 0 ? (
        <p className="mt-4">Please create categories.</p>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="flex-nowrap overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <ItemList items={items} categoryId="all" handleEdit={handleEdit} />
          </TabsContent>
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <ItemList items={items.filter(item => item.category === category.id)} categoryId={category.id} handleEdit={handleEdit} />
            </TabsContent>
          ))}
        </Tabs>
      )}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Create New Item'}</DialogTitle>
              <DialogDescription>
                Please fill in the details for the {editingItem ? 'item' : 'new item'}.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Item Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="text" id="name" placeholder="Enter item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="price">Price (RM) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" id="price" placeholder="Enter price" {...field} onChange={(e) => field.onChange(+e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="category">Category <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
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
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="image">Image</FormLabel>
                      <FormControl>
                        <Input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                      </FormControl>
                      {selectedImage && (
                        <img src={selectedImage} alt="Item Image" className="w-32 h-32 object-cover rounded-md mt-2" />
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button type="submit">{editingItem ? 'Save' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
