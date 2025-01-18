'use client';

import { useState, useContext, useEffect } from 'react';
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
import { TableContext } from '@/context/table-context';
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

const tableSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Table name is required' }),
  seats: z.number({
    required_error: 'Please enter a number',
    invalid_type_error: 'Seats must be a number',
  }).min(1, { message: 'Number of seats must be at least 1' }),
});

type TableSchema = z.infer<typeof tableSchema>;

export default function TablesPage() {
  const { tables, setTables } = useContext(TableContext);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState<TableSchema | null>(null);
  const [tableToDelete, setTableToDelete] = useState<TableSchema | null>(null);
  const { toast } = useToast();

  const form = useForm<TableSchema>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      id: '',
      name: '',
      seats: 1,
    },
  });

  const onSubmit = (data: TableSchema) => {
    const isDuplicate = tables.some(
      (table) =>
        table.name.toLowerCase() === data.name.toLowerCase() &&
        (editingTable ? table.id !== editingTable.id : true)
    );

    if (isDuplicate) {
      form.setError('name', {
        type: 'manual',
        message: 'Table name already exists.',
      });
      return;
    }

    if (editingTable) {
      setTables(tables.map(t => t.id === editingTable.id ? data : t));
      toast({
        title: 'Table Updated',
        description: 'Your table has been updated successfully.',
      });
    } else {
      const newTable = { ...data, id: uuidv4() };
      setTables([...tables, newTable]);
      toast({
        title: 'Table Created',
        description: 'Your table has been created successfully.',
      });
    }
    setShowForm(false);
    setEditingTable(null);
    form.reset();
  };

  const handleEdit = (table: TableSchema) => {
    setEditingTable(table);
    form.reset(table);
    setShowForm(true);
  };

  const handleDelete = (table: TableSchema) => {
    setTableToDelete(table);
  };

  const confirmDelete = () => {
    if (tableToDelete) {
      setTables(tables.filter((t) => t.id !== tableToDelete.id));
      toast({
        title: 'Table Deleted',
        description: 'Your table has been deleted successfully.',
      });
      setTableToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTableToDelete(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTable(null);
    form.reset();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tables</h1>
        {!showForm && (
          <Button size="sm" onClick={() => {
            setShowForm(true);
            form.reset({
              id: '',
              name: '',
              seats: 1,
            });
          }}>
            + Table
          </Button>
        )}
      </div>

      {tables.length === 0 && !showForm && (
        <p>Please create tables.</p>
      )}

      {tables.length > 0 && !showForm && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="border rounded-lg p-4 shadow-md flex flex-col items-start">
              <div className="flex items-center justify-between mb-2 w-full">
                <div>
                  <h2 className="font-medium">{table.name}</h2>
                  <p className="text-sm text-gray-500">Seats: {table.seats}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(table)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(table)}>
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
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTable ? 'Edit Table' : 'Create New Table'}</DialogTitle>
              <DialogDescription>
                Please fill in the details for the {editingTable ? 'table' : 'new table'}.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Table Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="text" id="name" placeholder="Enter table name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="seats">Number of Seats <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" id="seats" placeholder="Enter number of seats" {...field} onChange={(e) => field.onChange(+e.target.value)} min={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button type="submit">{editingTable ? 'Save' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
