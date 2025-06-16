import { source } from "@/lib/source";
import { UserRole } from "@prisma/client";

// We infer the PageTree shape directly from the loaded source to avoid relying on
// external type exports that may change between versions of fumadocs.
type PageTree = typeof source.pageTree;
type Node = PageTree["children"][number];

export function filterPageTreeByRole(tree: PageTree, userRole: UserRole): any {
  const filteredChildren = addRolesToPageTree(tree).children.map((item) => {
    item.children = item.children.filter((child: any) => {
      if (child.type === "page") {
        const roles = child.role as string[] | undefined;
        const isVisible = roles && roles.includes(userRole);
        return isVisible;
      }
      return true;
    });
    return item;
  });

  return { ...tree, children: filteredChildren };
}

/**
 * Returns a new page tree with `role` information attached to every page node.
 * This does **not** mutate the original `tree` coming from `source.pageTree`.
 */
export function addRolesToPageTree(tree: PageTree) {
  const attachRole = (node: Node): any => {
    if (node.type === "page") {
      const slug = node.url.replace(/^\/docs\/?/, "");
      const slugs = slug ? slug.split("/") : [];
      const page = source.getPage(slugs);

      // Extract roles from front-matter if available
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore – front-matter `role` is not part of the official type
      const roles = page?.data?.role as UserRole[] | undefined;

      return { ...node, role: roles };
    }

    if (node.type === "folder") {
      return {
        ...node,
        children: node.children.map((child: Node) => attachRole(child)),
      };
    }

    return node;
  };

  return {
    ...tree,
    children: tree.children.map((child: Node) => attachRole(child)),
  };
}
