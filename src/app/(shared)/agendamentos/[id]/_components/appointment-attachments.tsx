"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Paperclip } from "lucide-react";

type Attachment = {
  url: string;
  name: string;
};

interface AppointmentAttachmentsProps {
  attachments: Attachment[];
}

export function AppointmentAttachments({
  attachments,
}: AppointmentAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Paperclip className="h-5 w-5 text-gray-600" />
          Anexos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {attachments.map((attachment, index) => (
            <li key={index} className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {attachment.name}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
