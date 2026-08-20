export type CheckoutInput = {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  export type CheckoutErrors = Partial<Record<keyof CheckoutInput, string>>;
  
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE = /^[+\d][\d\s-]{6,19}$/;
  
  export function validateCheckout(input: Partial<CheckoutInput>): CheckoutErrors {
    const errors: CheckoutErrors = {};
    const required: [keyof CheckoutInput, string][] = [
      ["fullName", "Enter your full name."],
      ["addressLine1", "Enter your street address."],
      ["city", "Enter your city."],
      ["state", "Enter your state or governorate."],
      ["postalCode", "Enter your postal code."],
      ["country", "Enter your country."],
    ];
  
    for (const [field, message] of required) {
      if (!input[field]?.toString().trim()) errors[field] = message;
    }
  
    if (!input.email?.trim()) errors.email = "Enter your email address.";
    else if (!EMAIL.test(input.email)) errors.email = "That email doesn't look right.";
  
    if (!input.phone?.trim()) errors.phone = "Enter a phone number.";
    else if (!PHONE.test(input.phone)) errors.phone = "Enter a valid phone number.";
  
    return errors;
  }
  