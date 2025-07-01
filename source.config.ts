import { defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

const roles = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
  "COMIMSUP_ADMIN",
  "COMRJ_ADMIN",
  "USER",
  "FORNECEDOR",
]);

// const schema = frontmatterSchema.extend({
//   role: z.array(roles).optional().default(["USER"]),
// });

export const docs = defineDocs({
  dir: "content/docs",
  // docs: {
  //   //   schema,
  // },
});
