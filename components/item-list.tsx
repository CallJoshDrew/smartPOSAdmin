'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContext, useState } from 'react';
import { CategoryContext } from '@/context/category-context';
import { ItemContext } from '@/context/item-context';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

type Item = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  imageName?: string;
};

export function ItemList({ categoryId, items, handleEdit }: { categoryId: string, items: Item[], handleEdit: (item: Item) => void }) {
  const { categories } = useContext(CategoryContext);
  const { items: allItems, setItems } = useContext(ItemContext);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const handleDelete = (item: Item) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems(allItems.filter((i) => i.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          {item.image && (
            <CardHeader className="p-0 relative">
              <img src={item.image} alt={item.name} className="w-full h-[120px] object-cover rounded-t-lg" />
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white hover:bg-green-500" onClick={() => handleEdit(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
          )}
          <CardContent className="p-4">
            <div className="flex items-center justify-between mt-2">
              <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
              <div className="flex items-center space-x-1">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-red-500 p-0" onClick={() => handleDelete(item)}>
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
            <p className="text-sm text-gray-500">RM{item.price}</p>
            {categories.map(category => {
              if (category.id === item.category) {
                return <p className="text-sm text-gray-500">{category.name}</p>
              }
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
