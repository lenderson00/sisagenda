"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import { Users } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormType = "text" | "time";

const formSchema = z.object({
  value: z.string().min(1, "This field is required"),
});

type FormValues = z.infer<typeof formSchema>;

const generateTimeOptions = () => {
  const options = [
    { value: "30", label: "30min" },
    { value: "45", label: "45min" },
    { value: "60", label: "1h" },
    { value: "90", label: "1h30" },
    { value: "120", label: "2h" },
    { value: "150", label: "2h30" },
    { value: "180", label: "3h" },
  ];
  return options;
};

type TeamNameFormProps = {
  title: string;
  description: string;
  helpText: string;
  onSubmit?: (data: { [key: string]: string }) => void;
  className?: string;
};

export default function DurationForm({
  title,
  description,
  helpText,

  onSubmit,
  className,
}: TeamNameFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "60",
    },
  });

  const timeOptions = generateTimeOptions();

  const onSubmitForm = async (data: FormValues) => {
    onSubmit?.({ time: data.value });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={cn(className)}>
      <Card className="w-full pb-0 gap-0 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-foreground">
              {title}
            </Label>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {description}
            </p>
          </div>
          <div className="relative flex items-center gap-6 justify-between">
            <Select
              onValueChange={(value) => setValue("value", value)}
              defaultValue="60"
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select duration" defaultValue="60" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <IconCalendar className="size-6 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-between items-center bg-neutral-100 h-14 mt-2 border-t">
          <p className="text-xs text-muted-foreground">{helpText}</p>
          <div className="flex justify-end">
            <FormButton isSubmitting={isSubmitting} />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

type FormButtonProps = {
  isSubmitting: boolean;
};

function FormButton({ isSubmitting }: FormButtonProps) {
  return (
    <button
      type="submit"
      className={cn(
        "flex !h-8 md:w-fit px-4 text-xs items-center justify-center space-x-2 rounded-md w-full border  transition-all focus:outline-none sm:h-10",
        isSubmitting
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400  "
          : "border-black bg-black text-white  hover:opacity-80 cursor-pointer  ",
      )}
      disabled={isSubmitting}
    >
      {isSubmitting ? <LoadingDots color="#808080" /> : <p>Salvar</p>}
    </button>
  );
}
