export interface DateSpecificBlock {
  date: string; // "YYYY-MM-DD"
  startTime: number;
  endTime: number;
}

export interface BlockMultiDateRule {
  type: "BLOCK_MULTI_DATE";
  dates: DateSpecificBlock[];
  comment: string;
}

export type AvailabilityExceptionRule = BlockMultiDateRule;

export interface RulesSidebarProps {
  open: boolean;
  onClose: () => void;
  editingRule?: { rule: AvailabilityExceptionRule; index: number } | null;
  rules: AvailabilityExceptionRule[];
  deliveryTypeIds: string[];
  onRuleCreated?: (
    rules: AvailabilityExceptionRule[],
    deliveryTypeIds: string[],
  ) => void;
  onRulesUpdated?: (
    rules: AvailabilityExceptionRule[],
    deliveryTypeIds: string[],
  ) => void;
}
