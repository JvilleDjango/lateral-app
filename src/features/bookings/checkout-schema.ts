import { z } from "zod";

export const checkoutFormSchema = z.object({
  guestName: z.string().trim().min(2, "Enter your full name.").max(80),
  guestEmail: z.email("Enter a valid email address."),
  cardName: z.string().trim().min(2, "Enter the name shown on the card.").max(80),
  cardNumber: z
    .string()
    .transform((value) => value.replaceAll(" ", ""))
    .pipe(z.string().regex(/^[0-9]{16}$/, "Enter a 16-digit card number.")),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])[/][0-9]{2}$/, "Use MM/YY format.")
    .refine((value) => {
      const [month, year] = value.split("/").map(Number);
      const expiryMonth = new Date(2000 + year, month, 1);
      const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      return expiryMonth > currentMonth;
    }, "Use a future expiry date."),
  cvc: z.string().regex(/^[0-9]{3,4}$/, "Enter a 3 or 4-digit security code."),
});

export type CheckoutFormInput = z.input<typeof checkoutFormSchema>;
