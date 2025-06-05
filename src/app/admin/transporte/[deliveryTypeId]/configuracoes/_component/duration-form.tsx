"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface DurationFormProps {
  title: string;
  description: string;
  helpText: string;
  onSubmit: (data: { [key: string]: string }) => Promise<void>;
  initialDuration: number;
}

const timeOptions = [
  { value: "30", label: "30min" },
  { value: "60", label: "1h" },
  { value: "90", label: "1h30" },
  { value: "120", label: "2h" },
  { value: "150", label: "2h30" },
  { value: "180", label: "3h" },
];

export default function DurationForm({
  title,
  description,
  helpText,
  onSubmit,
  initialDuration,
}: DurationFormProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      time: initialDuration.toString(),
    },
  });

  // Update form value when initialDuration changes
  useEffect(() => {
    form.setValue("time", initialDuration.toString());
  }, [initialDuration, form]);

  const handleSubmit = async (data: { [key: string]: string }) => {
    try {
      await onSubmit(data);
      await queryClient.invalidateQueries({ queryKey: ["deliveryTypeConfig"] });
      toast.success("Duration updated successfully");
    } catch (error) {
      toast.error("Failed to update duration");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Duration</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-gray-500">{helpText}</p>
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
