
import React from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

interface EmailFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function EmailField<T extends FieldValues>({ 
  control, 
  name, 
  label = "Email", 
  placeholder = "seu@email.com" 
}: EmailFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <FormControl>
              <Input
                placeholder={placeholder}
                className="pl-10"
                type="email"
                {...field}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
