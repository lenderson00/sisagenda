// src/types/availability-rule.ts

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
