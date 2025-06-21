import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { DeliveryTypePageClient } from "./page-client";

const DeliveryTypePage = async ({
  params,
}: {
  params: Promise<{ deliveryTypeId: string }>;
}) => {
  return (
    <>
      <DeliveryTypePageClient />
    </>
  );
};

export default DeliveryTypePage;
