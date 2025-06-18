"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Edit,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StepIndicator } from "./step-indicator";
import { Step1RuleType } from "./steps/step-1-rule-type";
import { Step2Recurrence } from "./steps/step-2-recurrence";
import { Step3Configuration } from "./steps/step-3-configuration";
import { Step4DeliveryTypes } from "./steps/step-4-delivery-types";
import { Step5Comment } from "./steps/step-5-comment";
import type {
  AvailabilityExceptionRule,
  RecurrenceType,
  RulesSidebarProps,
  WeekOfMonth,
} from "./types";
import { minutesToTime, timeToMinutes } from "./utils";

dayjs.locale("pt-br");

export default function RuleBuilder({
  open,
  onClose,
  editingRule,
  rules,
  deliveryTypeIds: initialDeliveryTypeIds,
  onRuleCreated,
  onRulesUpdated,
}: RulesSidebarProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [ruleType, setRuleType] = useState<string>("BLOCK_WHOLE_DAY");
  const [dateValue, setDateValue] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [weekDayValue, setWeekDayValue] = useState<number>(0);
  const [weekOfMonthValue, setWeekOfMonthValue] = useState<WeekOfMonth | "">(
    "",
  );
  const [startTimeValue, setStartTimeValue] = useState<string>("09:00");
  const [endTimeValue, setEndTimeValue] = useState<string>("10:00");
  const [specificWeekDays, setSpecificWeekDays] = useState<number[]>([]);
  const [useSpecificDate, setUseSpecificDate] = useState<boolean>(true);
  const [recurrenceType, setRecurrenceType] =
    useState<RecurrenceType>("ONE_TIME");
  const [commentValue, setCommentValue] = useState<string>("");
  const [deliveryTypeIds, setDeliveryTypeIds] = useState<string[]>([]);

  const isEditMode = editingRule !== null;

  useEffect(() => {
    if (open) {
      if (isEditMode && editingRule) {
        const rule = editingRule.rule;
        setRuleType(rule.type);
        setRecurrenceType(rule.recurrence);
        setCommentValue(rule.comment);

        if (
          rule.type === "BLOCK_WHOLE_DAY" ||
          rule.type === "BLOCK_TIME_RANGE"
        ) {
          if (rule.date) {
            setUseSpecificDate(true);
            setDateValue(rule.date);
          } else {
            setUseSpecificDate(false);
            setWeekDayValue(rule.weekDay || 0);
            setWeekOfMonthValue(rule.weekOfMonth || "");
          }
          if (rule.type === "BLOCK_TIME_RANGE") {
            setStartTimeValue(minutesToTime(rule.startTime));
            setEndTimeValue(minutesToTime(rule.endTime));
          }
        } else if (rule.type === "BLOCK_SPECIFIC_WEEK_DAYS") {
          setSpecificWeekDays([...rule.weekDays]);
        }
      } else {
        resetFields();
      }
      setDeliveryTypeIds(initialDeliveryTypeIds);
    }
  }, [open, editingRule, isEditMode, initialDeliveryTypeIds]);

  const validateRule = (): boolean => {
    if (ruleType === "BLOCK_SPECIFIC_WEEK_DAYS") {
      if (specificWeekDays.length === 0) {
        toast.error("Validation failed", {
          description: "Select at least one weekday.",
        });
        return false;
      }
    }
    if (ruleType === "BLOCK_TIME_RANGE") {
      if (timeToMinutes(startTimeValue) >= timeToMinutes(endTimeValue)) {
        toast.error("Validation failed", {
          description: "End time must be after start time.",
        });
        return false;
      }
    }
    if (!commentValue.trim()) {
      toast.error("Justification required", {
        description: "Please add a justification for the block.",
      });
      return false;
    }
    return true;
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!ruleType;
      case 2:
        return !!recurrenceType;
      case 3:
        if (ruleType === "BLOCK_SPECIFIC_WEEK_DAYS") {
          return specificWeekDays.length > 0;
        }
        if (ruleType === "BLOCK_TIME_RANGE") {
          return timeToMinutes(startTimeValue) < timeToMinutes(endTimeValue);
        }
        return true;
      case 4:
        return true;
      case 5:
        return !!commentValue.trim();
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
    } else {
      let errorMessage = "Please fill in all required fields.";
      if (
        currentStep === 3 &&
        ruleType === "BLOCK_SPECIFIC_WEEK_DAYS" &&
        specificWeekDays.length === 0
      ) {
        errorMessage = "Select at least one weekday.";
      } else if (
        currentStep === 3 &&
        ruleType === "BLOCK_TIME_RANGE" &&
        timeToMinutes(startTimeValue) >= timeToMinutes(endTimeValue)
      ) {
        errorMessage = "End time must be after start time.";
      } else if (currentStep === 5 && !commentValue.trim()) {
        errorMessage = "Justification is required to create the rule.";
      }
      toast.error("Validation failed", { description: errorMessage });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  function handleAddOrUpdateRule() {
    if (!validateRule()) return;

    let newRule: AvailabilityExceptionRule;
    if (ruleType === "BLOCK_WHOLE_DAY") {
      newRule = {
        type: "BLOCK_WHOLE_DAY",
        date: useSpecificDate ? dateValue : undefined,
        weekDay: !useSpecificDate ? weekDayValue : undefined,
        weekOfMonth:
          !useSpecificDate && weekOfMonthValue ? weekOfMonthValue : undefined,
        recurrence: recurrenceType,
        comment: commentValue.trim(),
      };
    } else if (ruleType === "BLOCK_TIME_RANGE") {
      newRule = {
        type: "BLOCK_TIME_RANGE",
        date: useSpecificDate ? dateValue : undefined,
        weekDay: !useSpecificDate ? weekDayValue : undefined,
        weekOfMonth:
          !useSpecificDate && weekOfMonthValue ? weekOfMonthValue : undefined,
        startTime: timeToMinutes(startTimeValue),
        endTime: timeToMinutes(endTimeValue),
        recurrence: recurrenceType,
        comment: commentValue.trim(),
      };
    } else {
      newRule = {
        type: "BLOCK_SPECIFIC_WEEK_DAYS",
        weekDays: [...specificWeekDays],
        recurrence: recurrenceType,
        comment: commentValue.trim(),
      };
    }

    if (isEditMode) {
      if (!editingRule) return;
      const newRules = [...rules];
      newRules[editingRule.index] = newRule;
      onRulesUpdated?.(newRules, deliveryTypeIds);
      toast.success("Rule updated successfully!");
    } else {
      onRuleCreated?.(newRule, deliveryTypeIds);
      toast.success("Rule created successfully!");
    }
    onClose();
  }

  function resetFields() {
    setRuleType("BLOCK_WHOLE_DAY");
    setDateValue(dayjs().format("YYYY-MM-DD"));
    setWeekDayValue(0);
    setWeekOfMonthValue("");
    setStartTimeValue("09:00");
    setEndTimeValue("10:00");
    setSpecificWeekDays([]);
    setUseSpecificDate(true);
    setRecurrenceType("ONE_TIME");
    setCommentValue("");
    setDeliveryTypeIds([]);
    setCurrentStep(1);
  }

  function handleDeleteCurrentRule() {
    if (isEditMode) {
      if (!editingRule) return;
      const newRules = rules.filter((_, i) => i !== editingRule.index);
      onRulesUpdated?.(newRules, deliveryTypeIds);
      toast.success("Rule removed successfully!");
      onClose();
    }
  }

  const renderWizard = () => (
    <>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
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
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1RuleType ruleType={ruleType} onRuleTypeChange={setRuleType} />
        );
      case 2:
        return (
          <Step2Recurrence
            recurrenceType={recurrenceType}
            onRecurrenceTypeChange={setRecurrenceType}
          />
        );
      case 3:
        return (
          <Step3Configuration
            ruleType={ruleType}
            recurrenceType={recurrenceType}
            dateValue={dateValue}
            onDateValueChange={setDateValue}
            weekDayValue={weekDayValue}
            onWeekDayValueChange={setWeekDayValue}
            weekOfMonthValue={weekOfMonthValue}
            onWeekOfMonthValueChange={setWeekOfMonthValue}
            startTimeValue={startTimeValue}
            onStartTimeValueChange={setStartTimeValue}
            endTimeValue={endTimeValue}
            onEndTimeValueChange={setEndTimeValue}
            specificWeekDays={specificWeekDays}
            onSpecificWeekDaysChange={setSpecificWeekDays}
            useSpecificDate={useSpecificDate}
            onUseSpecificDateChange={setUseSpecificDate}
          />
        );
      case 4:
        return (
          <Step4DeliveryTypes
            selectedDeliveryTypeIds={deliveryTypeIds}
            onDeliveryTypeIdsChange={setDeliveryTypeIds}
          />
        );
      case 5: {
        const tempRule: AvailabilityExceptionRule = {
          type: ruleType,
          recurrence: recurrenceType,
          comment: commentValue,
          ...(ruleType === "BLOCK_WHOLE_DAY" && {
            date: useSpecificDate ? dateValue : undefined,
            weekDay: !useSpecificDate ? weekDayValue : undefined,
            weekOfMonth: !useSpecificDate ? weekOfMonthValue : undefined,
          }),
          ...(ruleType === "BLOCK_TIME_RANGE" && {
            date: useSpecificDate ? dateValue : undefined,
            weekDay: !useSpecificDate ? weekDayValue : undefined,
            weekOfMonth: !useSpecificDate ? weekOfMonthValue : undefined,
            startTime: timeToMinutes(startTimeValue),
            endTime: timeToMinutes(endTimeValue),
          }),
          ...(ruleType === "BLOCK_SPECIFIC_WEEK_DAYS" && {
            weekDays: specificWeekDays,
          }),
        } as AvailabilityExceptionRule;

        return (
          <Step5Comment
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <Edit className="w-6 h-6 text-amber-600" />
                <DialogTitle>Edit Rule</DialogTitle>
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 text-sky-600" />
                <DialogTitle>New Rule</DialogTitle>
              </>
            )}
          </div>
        </DialogHeader>

        {renderWizard()}

        <DialogFooter className="pt-4">
          {isEditMode && (
            <Button
              variant="destructive"
              onClick={handleDeleteCurrentRule}
              className="mr-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Rule
            </Button>
          )}

          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={goToNextStep}
            className={cn(
              currentStep === totalSteps
                ? "bg-green-600 hover:bg-green-700"
                : "bg-sky-600 hover:bg-sky-700",
            )}
          >
            {currentStep === totalSteps ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {isEditMode ? "Save Changes" : "Create Rule"}
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
