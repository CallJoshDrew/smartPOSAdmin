'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

type ItemFormProps = {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  onSubmit: (data: ItemSchema) => void;
  onCancel: () => void;
  categories: { id: string; name: string }[];
  editingItem?: ItemSchema | null;
};

export function ItemForm({ showForm, setShowForm, onSubmit, onCancel, categories, editingItem }: ItemFormProps) {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'choices',
  });

  useEffect(() => {
    if (editingItem) {
      form.reset(editingItem);
      setSelectedImage(editingItem.image || null);
    } else {
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
      setSelectedImage(null);
    }
  }, [editingItem, form]);

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
    <Dialog open={showForm} onOpenChange={setShowForm}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
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
            <FormField
              control={form.control}
              name="selection"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-x-2">
                  <FormLabel>Selection</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch('selection') && (
              <FormField
                control={form.control}
                name="choices"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Choices</FormLabel>
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2 mb-2">
                          <FormField
                            control={form.control}
                            name={`choices.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input placeholder="Enter choice name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`choices.${index}.price`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input type="number" placeholder="Enter choice price" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', price: 0 })}>
                        + Add Choice
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit">{editingItem ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
