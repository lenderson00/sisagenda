import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Appointment, DeliveryType, User } from "@prisma/client";
import {
  Briefcase,
  Clock,
  FileText,
  Mail,
  Paperclip,
  Phone,
  Settings,
  Users,
} from "lucide-react";
import type React from "react";

interface AppointmentFormDetailsSidebarProps {
  appointment: Appointment & {
    deliveryType: DeliveryType;
    user: User;
  };
}

const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value?: string | string[] | null;
}> = ({ icon: Icon, label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {Array.isArray(value) ? (
          <ul className="list-disc list-inside">
            {value.map((item, index) => (
              <li key={index} className="text-sm text-gray-600">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">{JSON.stringify(value)}</p>
        )}
      </div>
    </div>
  );
};

export function AppointmentFormDetailsSidebar({
  appointment,
}: AppointmentFormDetailsSidebarProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Submitted Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailItem
          icon={Briefcase}
          label="Service Type"
          value={appointment.deliveryType.name}
        />
        <DetailItem
          icon={Clock}
          label="Estimated Duration"
          value={appointment.deliveryType.description}
        />
        <DetailItem
          icon={Settings}
          label="Equipment Needed"
          value={appointment.deliveryType.description}
        />

        <Separator />

        <p className="text-sm font-semibold text-gray-800 pt-2">
          Client Contact
        </p>
        <DetailItem
          icon={Users}
          label="Contact Person"
          value={appointment.user.name}
        />
        <DetailItem
          icon={Mail}
          label="Contact Email"
          value={appointment.user.email}
        />
        <DetailItem
          icon={Phone}
          label="Contact Phone"
          value={appointment.user.whatsapp}
        />
      </CardContent>
    </Card>
  );
}
