'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray, UseFormRegister, FieldErrors, Controller, ControllerRenderProps } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash2 } from 'lucide-react';

type ChoicesFormProps = {
  control: any;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  fields: any[];
  append: any;
  remove: any;
};

export function ChoicesForm({ control, register, errors, fields, append, remove }: ChoicesFormProps) {
  return (
    <div className="mb-4">
      <FormLabel>Choices</FormLabel>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2 mb-2">
          <input type="hidden" {...register(`choices.${index}.id`)} />
          <div className="flex-1">
            <Input placeholder="Enter choice name" {...register(`choices.${index}.name`, { required: 'Choice name is required' })} />
            {errors.choices?.[index]?.name && (
              <p className="text-red-500 text-sm">{errors.choices[index].name.message}</p>
            )}
          </div>
          <div className="flex-1">
            <Input type="number" placeholder="Enter choice price" {...register(`choices.${index}.price`, { required: 'Choice price is required', valueAsNumber: true })} />
            {errors.choices?.[index]?.price && (
              <p className="text-red-500 text-sm">{errors.choices[index].price.message}</p>
            )}
          </div>
          <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', price: 0 })}>
        + Add Choice
      </Button>
    </div>
  );
}
