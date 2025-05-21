
import React from "react";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  forgotPasswordLink?: boolean;
  onForgotPasswordClick?: () => void;
  disabled?: boolean;
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label = "Senha",
  placeholder = "********",
  forgotPasswordLink = false,
  onForgotPasswordClick,
  disabled
}: PasswordFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            {forgotPasswordLink && (
              <Button
                variant="link"
                className="p-0 h-auto text-xs"
                type="button"
                onClick={onForgotPasswordClick}
                disabled={disabled}
              >
                Esqueceu a senha?
              </Button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <FormControl>
              <Input
                placeholder={placeholder}
                className="pl-10"
                type="password"
                disabled={disabled}
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
