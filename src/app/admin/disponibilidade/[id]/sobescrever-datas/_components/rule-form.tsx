"use client";

import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StepIndicator } from "./step-indicator";
import { Step1Configuration } from "./steps/step-1-configuration";
import { Step2DeliveryTypes } from "./steps/step-2-delivery-types";
import { Step3Comment } from "./steps/step-3-comment";
import type {
  AvailabilityExceptionRule,
  DateSpecificBlock,
  RulesSidebarProps,
} from "./types";
import { timeToMinutes } from "./utils";

dayjs.locale("pt-br");

interface TimeBlock {
  startTime: string;
  endTime: string;
}

interface RuleFormProps {
  initialData?: AvailabilityExceptionRule;
  rules: AvailabilityExceptionRule[];
  deliveryTypeIds: string[];
  onSave: (
    rules: AvailabilityExceptionRule[],
    deliveryTypeIds: string[],
  ) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function RuleForm({
  initialData,
  rules,
  deliveryTypeIds: initialDeliveryTypeIds,
  onSave,
  onDelete,
}: RuleFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<Record<string, TimeBlock>>({});
  const [commentValue, setCommentValue] = useState<string>("");
  const [deliveryTypeIds, setDeliveryTypeIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      const { dates, comment } = initialData;
      const initialDates = dates.map((d) => dayjs(d.date).toDate());
      const initialTimeBlocks = dates.reduce(
        (acc, d) => {
          acc[d.date] = {
            startTime: dayjs()
              .startOf("day")
              .add(d.startTime, "minute")
              .format("HH:mm"),
            endTime: dayjs()
              .startOf("day")
              .add(d.endTime, "minute")
              .format("HH:mm"),
          };
          return acc;
        },
        {} as Record<string, TimeBlock>,
      );
      setSelectedDates(initialDates);
      setTimeBlocks(initialTimeBlocks);
      setCommentValue(comment);
    }
    setDeliveryTypeIds(initialDeliveryTypeIds);
  }, [initialData, initialDeliveryTypeIds]);

  const handleSelectedDatesChange = (dates: Date[]) => {
    setSelectedDates(dates);
    const newTimeBlocks: Record<string, TimeBlock> = {};
    const defaultTimeBlock = { startTime: "09:00", endTime: "18:00" };
    for (const date of dates) {
      const dateKey = dayjs(date).format("YYYY-MM-DD");
      newTimeBlocks[dateKey] = timeBlocks[dateKey] || defaultTimeBlock;
    }
    setTimeBlocks(newTimeBlocks);
  };

  const handleTimeBlockChange = (dateKey: string, timeBlock: TimeBlock) => {
    setTimeBlocks((prev) => ({ ...prev, [dateKey]: timeBlock }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (Object.keys(timeBlocks).length === 0) {
          toast.error("Selecione pelo menos uma data.");
          return false;
        }
        for (const key in timeBlocks) {
          if (
            timeToMinutes(timeBlocks[key].startTime) >=
            timeToMinutes(timeBlocks[key].endTime)
          ) {
            toast.error(
              `Em ${dayjs(key).format("DD/MM")}, o horário de fim deve ser após o de início.`,
            );
            return false;
          }
        }
        return true;
      case 2:
        return true;
      case 3:
        if (!commentValue.trim()) {
          toast.error("A justificativa é obrigatória.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleAddOrUpdateRule();
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function handleAddOrUpdateRule() {
    if (!validateCurrentStep()) return;

    setIsSaving(true);
    const dateBlocks: DateSpecificBlock[] = Object.entries(timeBlocks).map(
      ([date, times]) => ({
        date,
        startTime: timeToMinutes(times.startTime),
        endTime: timeToMinutes(times.endTime),
      }),
    );

    const newRule: AvailabilityExceptionRule = {
      type: "BLOCK_MULTI_DATE",
      dates: dateBlocks,
      comment: commentValue.trim(),
    };

    let newRules: AvailabilityExceptionRule[];
    if (isEditMode) {
      const ruleIndex = rules.findIndex((r) => r === initialData);
      newRules = [...rules];
      if (ruleIndex !== -1) {
        newRules[ruleIndex] = newRule;
      }
    } else {
      newRules = [newRule, ...rules];
    }

    try {
      await onSave(newRules, deliveryTypeIds);
      toast.success(
        isEditMode
          ? "Regra atualizada com sucesso!"
          : "Regra criada com sucesso!",
      );
      router.push("/bloqueio-de-datas");
    } catch (error) {
      toast.error("Falha ao salvar a regra.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (onDelete) {
      setIsSaving(true);
      try {
        await onDelete();
        toast.success("Regra removida com sucesso!");
        router.push("/bloqueio-de-datas");
      } catch (error) {
        toast.error("Falha ao remover a regra.");
      } finally {
        setIsSaving(false);
      }
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Configuration
            selectedDates={selectedDates}
            onSelectedDatesChange={handleSelectedDatesChange}
            timeBlocks={timeBlocks}
            onTimeBlockChange={handleTimeBlockChange}
          />
        );
      case 2:
        return (
          <Step2DeliveryTypes
            selectedDeliveryTypeIds={deliveryTypeIds}
            onDeliveryTypeIdsChange={setDeliveryTypeIds}
          />
        );
      case 3: {
        // This is tricky now. The summary needs to handle multiple dates.
        // For now, let's just pass a dummy rule to the comment component.
        // We will refactor the comment component and rule card next.
        const tempRule: AvailabilityExceptionRule = {
          type: "BLOCK_MULTI_DATE",
          dates: Object.entries(timeBlocks).map(([date, times]) => ({
            date,
            startTime: timeToMinutes(times.startTime),
            endTime: timeToMinutes(times.endTime),
          })),
          comment: commentValue,
        };

        return (
          <Step3Comment
            comment={commentValue}
            onCommentChange={setCommentValue}
            rule={tempRule}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Editar Regra de Bloqueio" : "Criar Nova Regra"}
          </h1>
          <p className="text-muted-foreground">
            Siga os passos para configurar a regra de bloqueio.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>

      <div className="py-4">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <div className="mt-6 min-h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="overflow-auto p-1"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between w-full mt-6">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        <div className="flex items-center gap-4">
          {isEditMode && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              type="button"
              disabled={isSaving}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          )}
          <Button onClick={goToNextStep} disabled={isSaving}>
            {currentStep === totalSteps ? "Salvar Regra" : "Próximo"}
            {currentStep === totalSteps ? (
              <Check className="w-4 h-4 ml-2" />
            ) : (
              <ArrowRight className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
