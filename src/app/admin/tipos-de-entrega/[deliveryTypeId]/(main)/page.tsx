import DeliveryTypePageClient from "./page-client";

type DeliveryTypePageProps = {
  params: {
    deliveryTypeId: string;
  };
};

const DeliveryTypePage = ({ params }: DeliveryTypePageProps) => {
  return <DeliveryTypePageClient deliveryTypeId={params.deliveryTypeId} />;
};

export default DeliveryTypePage;
