import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

const UserPage = async ({ params }: { params: Promise<{ user: string }> }) => {
  const session = await auth();
  const { user } = await params;

  if (!session) {
    redirect("/");
  }

  const orgId = session.user.organizationId;

  if (!orgId) {
    redirect("/");
  }

  const userResult = await prisma.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userResult) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Usuários", href: "/usuarios" },
    { label: userResult.name ?? "", current: true },
  ];
  return (
    <>
      {" "}
      <div className="border-b ">
        <div className="container mx-auto px-6 py-8">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {userResult.name}
              </h1>
              <p className="text-gray-600">{userResult.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
