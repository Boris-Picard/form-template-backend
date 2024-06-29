import { z } from "zod";

export default FormSchemaFirstStep = z.object({
  coin: z
    .string({
      required_error: "Please select a valid coin.",
    })
    .min(1, {
      message: "Please select a coin",
    }),
});
