import { atom, useAtom } from "jotai";

type ScheduleStore = {
  organizationId: string;
  deliveryTypeId: string;
  dateTime: Date;
}

export const scheduleStore = atom<ScheduleStore | null>(null);

export const useScheduleStore = () => {
  const [schedule, setSchedule] = useAtom(scheduleStore);
  return { schedule, setSchedule };
};