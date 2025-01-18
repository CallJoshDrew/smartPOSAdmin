'use client';

import { useState, useContext } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CategoryContext } from '@/context/category-context';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const dummyCategories = [
  { id: '1', name: 'Dishes' },
  { id: '2', name: 'Drinks' },
  { id: '3', name: 'Cakes' },
  { id: '4', name: 'Promo' },
  { id: '5', name: 'Special' },
  { id: '6', name: 'Add On' },
];

const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Category name is required' }),
});

type CategorySchema = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const { categories, setCategories } = useContext(CategoryContext);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategorySchema | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategorySchema | null>(null);
  const { toast } = useToast();

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: '',
      name: '',
    },
  });

  const onSubmit = (data: CategorySchema) => {
    const isDuplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === data.name.toLowerCase() &&
        (editingCategory ? category.id !== editingCategory.id : true)
    );

    if (isDuplicate) {
      form.setError('name', {
        type: 'manual',
        message: 'Category name already exists.',
      });
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? data : c));
      toast({
        title: 'Category Updated',
        description: 'Your category has been updated successfully.',
      });
    } else {
      const newCategory = { ...data, id: uuidv4() };
      setCategories([...categories, newCategory]);
      toast({
        title: 'Category Created',
        description: 'Your category has been created successfully.',
      });
    }
    setShowForm(false);
    setEditingCategory(null);
    form.reset();
  };

  const handleEdit = (category: CategorySchema) => {
    setEditingCategory(category);
    form.reset(category);
    setShowForm(true);
  };

  const handleDelete = (category: CategorySchema) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      toast({
        title: 'Category Deleted',
        description: 'Your category has been deleted successfully.',
      });
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    form.reset();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            + Category
          </Button>
        )}
      </div>

      {categories.length === 0 && !showForm && (
        <p>There is no categories, please set it now.</p>
      )}

      {categories.length > 0 && !showForm && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">No. of Items</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="flex justify-end">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(category)}>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
              <DialogDescription>
                Please fill in the details for the {editingCategory ? 'category' : 'new category'}.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Category Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="text" id="name" placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button type="submit">{editingCategory ? 'Save' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
