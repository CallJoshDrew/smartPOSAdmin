'use client';

import { useState, useEffect, useContext } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemList } from '@/components/item-list';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { ItemContext } from '@/context/item-context';
import { ItemForm } from '@/components/item-form'; // Import ItemForm

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
  selection: z.boolean().default(false),
  choices: z.array(
    z.object({
      name: z.string().min(1, { message: 'Choice name is required' }),
      price: z.number({
        required_error: 'Please enter a price',
        invalid_type_error: 'Price must be a number',
      }).min(0, { message: 'Price must be at least 0' }),
    })
  ).optional(),
});

type ItemSchema = z.infer<typeof itemSchema>;

export default function ItemsPage() {
  const [categories, setCategories] = useState(dummyCategories);
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const { items, setItems } = useContext(ItemContext);
  const [editingItem, setEditingItem] = useState<ItemSchema | null>(null);
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
      selection: false,
      choices: [],
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
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    form.reset();
  };

  const handleEdit = (item: ItemSchema) => {
    setEditingItem(item);
    form.reset(item);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Items</h1>
        {!showForm && (
          <Button size="sm" onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            form.reset({
              id: '',
              name: '',
              price: 0,
              category: '',
              image: '',
              imageName: '',
              selection: false,
              choices: [],
            });
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
        <ItemForm
          showForm={showForm}
          setShowForm={setShowForm}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          categories={categories}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}
