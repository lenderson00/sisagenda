"use client";

import {
  FileUploader,
  FileMetadata,
} from "@/app/(shared)/agendar/_component/file-uploader";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { useScheduleStore } from "../../_store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function Step3Documents() {
  const form = useFormContext();
  const { schedule, setSchedule } = useScheduleStore();

  const handleUploadComplete = (metadata: FileMetadata) => {
    if ((schedule?.attachments?.length ?? 0) >= 5) {
      return;
    }
    const newAttachments = [...(schedule?.attachments ?? []), metadata];
    setSchedule({ attachments: newAttachments });
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...(schedule?.attachments ?? [])];
    newAttachments.splice(index, 1);
    setSchedule({ attachments: newAttachments });
  };

  const handleObservationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setSchedule({ observation: e.target.value });
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="notaFiscal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Qual o número da Nota Fiscal que será entregue?
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-2">
        <FormLabel>Anexar Documentação Extra (Até 5 arquivos)</FormLabel>
        <p className="text-sm text-muted-foreground">
          Se houver alguma documentação extra que precise ser enviada, anexe
          aqui.
        </p>
        {schedule?.attachments && schedule.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {schedule.attachments.map((file, index) => (
              <Badge key={index} variant="secondary">
                {file.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-2"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
        {(schedule?.attachments?.length ?? 0) < 5 && (
          <FileUploader onUploadComplete={handleUploadComplete} />
        )}
      </div>
      <div className="space-y-2">
        <FormLabel>Observações</FormLabel>
        <Textarea
          value={schedule?.observation ?? ""}
          onChange={handleObservationChange}
          placeholder="Adicione qualquer informação relevante aqui..."
        />
      </div>
    </div>
  );
}
