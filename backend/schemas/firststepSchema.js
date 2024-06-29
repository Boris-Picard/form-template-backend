import { z } from "zod";

const FormSchemaFirstStep = z.object({
  name: z
    .string({
      required_error: "Please select a valid coin.",
    })
    .min(1, {
      message: "Please select a coin",
    }),
});

export default FormSchemaFirstStep;
