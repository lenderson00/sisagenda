import DeliveryTypePageClient from "./page-client";

type DeliveryTypePageProps = {
  params: Promise<{
    deliveryTypeId: string;
  }>;
};

const DeliveryTypePage = async ({ params }: DeliveryTypePageProps) => {
  const { deliveryTypeId } = await params;
  return <DeliveryTypePageClient deliveryTypeId={deliveryTypeId} />;
};

export default DeliveryTypePage;
