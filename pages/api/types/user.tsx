import { z } from "zod";

const User = z.object({
  email: z.string({
    invalid_type_error: "Please enter an email address.",
  }),
  password: z
    .string({ invalid_type_error: "Enter a strong password." })
    .min(8, { message: "Must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, {
      message: "Must contain at least one letter.",
    })
    .regex(/[0-9]/, { message: "Must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Must contain at least one special character.",
    })
    .trim(),
});

export default User;
