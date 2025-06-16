import { defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      role: z
        .array(z.enum(["SUPER_ADMIN", "ADMIN", "COMIMSUP  ", "USER"]))
        .optional(),
    }),
  },
});
