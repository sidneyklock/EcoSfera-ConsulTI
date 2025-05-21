
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordValidatorProps {
  password: string;
  onValidationChange: (isValid: boolean) => void;
}

interface ValidationState {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  notExposed: boolean;
  isCheckingExposure: boolean;
  exposureError: string | null;
}

export const PasswordValidator = ({ 
  password, 
  onValidationChange 
}: PasswordValidatorProps) => {
  const [validations, setValidations] = useState<ValidationState>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false,
    notExposed: true,
    isCheckingExposure: false,
    exposureError: null
  });

  // Check if password has been exposed in data breaches
  useEffect(() => {
    const checkPasswordExposure = async () => {
      // Don't check very short passwords or empty strings
      if (password.length < 5) {
        setValidations(prev => ({ ...prev, notExposed: true, isCheckingExposure: false }));
        return;
      }

      try {
        setValidations(prev => ({ ...prev, isCheckingExposure: true, exposureError: null }));
        
        // Calculate SHA-1 hash of the password
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        
        // Convert hash to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Get first 5 characters for k-anonymity
        const prefix = hashHex.substring(0, 5);
        const suffix = hashHex.substring(5);
        
        // Query the API with the prefix only (k-anonymity)
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        
        if (!response.ok) {
          throw new Error('Failed to check password exposure');
        }
        
        const text = await response.text();
        const hashes = text.split('\r\n');
        
        // Check if our suffix is in the returned list
        const match = hashes.find(h => h.split(':')[0].toLowerCase() === suffix.toLowerCase());
        const isExposed = Boolean(match);
        
        setValidations(prev => ({ 
          ...prev, 
          notExposed: !isExposed, 
          isCheckingExposure: false 
        }));
      } catch (error) {
        console.error('Error checking password exposure:', error);
        setValidations(prev => ({ 
          ...prev, 
          isCheckingExposure: false, 
          exposureError: 'Não foi possível verificar vazamentos. Continue com cautela.' 
        }));
      }
    };

    // Debounce the check to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (password) {
        checkPasswordExposure();
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [password]);

  // Check password criteria in real-time
  useEffect(() => {
    const newValidations = {
      minLength: password.length >= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      notExposed: validations.notExposed,
      isCheckingExposure: validations.isCheckingExposure,
      exposureError: validations.exposureError
    };

    setValidations(prev => ({ ...prev, ...newValidations }));

    // Inform parent component about overall validation state
    const isValid = Object.keys(newValidations)
      .filter(key => !['isCheckingExposure', 'exposureError'].includes(key))
      .every(key => newValidations[key as keyof typeof newValidations]);

    onValidationChange(isValid);
  }, [password, validations.notExposed, validations.isCheckingExposure, onValidationChange]);

  const renderValidationItem = (
    label: string, 
    isValid: boolean, 
    isLoading = false
  ) => {
    return (
      <li className="flex items-center gap-2 text-sm">
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : isValid ? (
          <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
        ) : (
          <X className="h-4 w-4 text-red-500" aria-hidden="true" />
        )}
        <span className={cn(
          isValid ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400",
          "transition-colors"
        )}>
          {label}
        </span>
      </li>
    );
  };

  return (
    <div 
      className="mt-2 rounded-md border border-input bg-background/50 p-3 text-sm"
      aria-live="polite"
      role="status"
    >
      <p className="font-medium mb-2">Sua senha deve conter:</p>
      <ul className="space-y-1">
        {renderValidationItem("Mínimo de 12 caracteres", validations.minLength)}
        {renderValidationItem("Pelo menos 1 letra maiúscula", validations.hasUppercase)}
        {renderValidationItem("Pelo menos 1 letra minúscula", validations.hasLowercase)}
        {renderValidationItem("Pelo menos 1 número", validations.hasNumber)}
        {renderValidationItem("Pelo menos 1 símbolo", validations.hasSymbol)}
        {renderValidationItem(
          "Não encontrada em vazamentos de dados", 
          validations.notExposed,
          validations.isCheckingExposure
        )}
      </ul>
      {validations.exposureError && (
        <p className="mt-2 text-amber-600 text-sm">{validations.exposureError}</p>
      )}
    </div>
  );
};
