import { z } from "zod";

const FormSchemaSecondStep = z.object({
  quantity: z.coerce
    .number({
      message: "Please enter a number",
    })
    .min(0.0000000001, { message: "Please enter at least one number" }),
  price: z.coerce
    .number({
      message: "Please enter a number",
    })
    .min(0.0000000001, { message: "Please enter at least one number" }),
  spent: z.coerce
    .number({
      message: "Please enter a number",
    })
    .min(0.0000000001, { message: "Please enter at least one number" }),
  date: z.coerce
    .date()
    .refine((date) => date <= new Date(), "Please enter a valid date"),
});

export default FormSchemaSecondStep;
