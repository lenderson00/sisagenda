import { Plus, Trash } from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ArrayPath,
  Control,
  ControllerRenderProps,
  FieldArrayWithId,
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFieldArrayRemove,
} from "react-hook-form";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs, { type ConfigType } from "dayjs";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

export interface TimeRange {
  start: Date;
  end: Date;
}
const DEFAULT_DAY_RANGE = {
  start: dayjs().startOf("day").add(9, "hour").toDate(),
  end: dayjs().startOf("day").add(17, "hour").toDate(),
};

const weekdayNames = (
  locale: string,
  weekStart: number,
  format: "long" | "short" = "long",
) => {
  const weekdays = [];
  // Fallback to English if locale is not supported
  const supportedLocale =
    Intl.DateTimeFormat.supportedLocalesOf(locale)[0] || "en-US";
  const formatter = new Intl.DateTimeFormat(supportedLocale, {
    weekday: format,
  });
  for (let i = weekStart; i < weekStart + 7; i++) {
    const day = new Date();
    day.setDate(day.getDate() - day.getDay() + i);
    weekdays.push(formatter.format(day));
  }
  return weekdays;
};

export type ScheduleLabelsType = {
  addTime: string;
  copyTime: string;
  deleteTime: string;
};

export type FieldPathByValue<TFieldValues extends FieldValues, TValue> = {
  [Key in FieldPath<TFieldValues>]: FieldPathValue<
    TFieldValues,
    Key
  > extends TValue
    ? Key
    : never;
}[FieldPath<TFieldValues>];

export const ScheduleDay = <TFieldValues extends FieldValues>({
  name,
  weekday,
  control,
  CopyButton,
  disabled,
  labels,
  userTimeFormat,
}: {
  name: ArrayPath<TFieldValues>;
  weekday: string;
  control: Control<TFieldValues>;
  CopyButton: React.ReactNode;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
  userTimeFormat: "12h" | "24h";
}) => {
  const { watch, setValue } = useFormContext();
  const watchDayRange = watch(name);
  const switchId = `${name}-switch`;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 last:mb-0 sm:flex-row sm:gap-6 sm:px-0",
      )}
      data-testid={weekday}
    >
      {/* Label & switch container */}
      <div className={cn("flex h-[36px] items-center justify-between sm:w-32")}>
        <div>
          <div className="text-default flex flex-row items-center space-x-2 rtl:space-x-reverse">
            <Switch
              id={switchId}
              disabled={!watchDayRange || disabled}
              defaultChecked={watchDayRange && watchDayRange.length > 0}
              checked={watchDayRange && !!watchDayRange.length}
              data-testid={`${weekday}-switch`}
              onCheckedChange={(isChecked) => {
                setValue(name, (isChecked ? [DEFAULT_DAY_RANGE] : []) as any);
              }}
            />
            <label
              htmlFor={switchId}
              className="inline-block min-w-[88px] text-sm capitalize"
            >
              {weekday}
            </label>
          </div>
        </div>
      </div>
      <>
        {!watchDayRange && <Skeleton className="ml-1 mt-2.5 h-6 w-48" />}
        {watchDayRange?.length > 0 && (
          <div className="flex sm:gap-2">
            <DayRanges
              userTimeFormat={userTimeFormat}
              labels={labels}
              control={control}
              name={name}
              disabled={disabled}
            />
            {!disabled && <div className="block">{CopyButton}</div>}
          </div>
        )}
      </>
    </div>
  );
};

const CopyButton = ({
  getValuesFromDayRange,
  weekStart,
  labels,
}: {
  getValuesFromDayRange: string;
  weekStart: number;
  labels?: ScheduleLabelsType;
}) => {
  const [open, setOpen] = useState(false);
  const fieldArrayName = getValuesFromDayRange.substring(
    0,
    getValuesFromDayRange.lastIndexOf("."),
  );
  const { setValue, getValues } = useFormContext();
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "text-default",
            open &&
              "ring-brand-500 !bg-subtle outline-none ring-2 ring-offset-1",
          )}
          data-testid="copy-button"
          type="button"
          aria-label={labels?.copyTime ?? "Copy times to..."}
          variant="outline"
        >
          Copy
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <CopyTimes
          weekStart={weekStart}
          disabled={Number.parseInt(
            getValuesFromDayRange.replace(`${fieldArrayName}.`, ""),
            10,
          )}
          onClick={(selected) => {
            for (const day of selected) {
              setValue(
                `${fieldArrayName}.${day}`,
                getValues(getValuesFromDayRange),
              );
            }
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Schedule = <
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, TimeRange[][]>,
>(props: {
  name: TPath;
  control: Control<TFieldValues>;
  weekStart?: number;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
  userTimeFormat?: "12h" | "24h";
}) => {
  const timeFormat = "24h";

  return <ScheduleComponent userTimeFormat={timeFormat} {...props} />;
};

export const ScheduleComponent = <
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, TimeRange[][]>,
>({
  name,
  control,
  disabled,
  weekStart = 0,
  labels,
  userTimeFormat,
}: {
  name: TPath;
  control: Control<TFieldValues>;
  weekStart?: number;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
  userTimeFormat: "12h" | "24h";
}) => {
  // Fallback to a default language if i18n is not available
  const language =
    typeof window !== "undefined" ? window.navigator.language : "en-US";

  return (
    <div className={cn("flex flex-col gap-4 p-2 sm:p-4")}>
      {/* First iterate for each day */}
      {weekdayNames(language, weekStart, "long").map(
        (weekday: string, num: number) => {
          const weekdayIndex = (num + weekStart) % 7;
          const dayRangeName =
            `${name}.${weekdayIndex}` as ArrayPath<TFieldValues>;
          return (
            <ScheduleDay
              userTimeFormat={userTimeFormat}
              labels={labels}
              disabled={disabled}
              name={dayRangeName}
              key={weekday}
              weekday={weekday}
              control={control}
              CopyButton={
                <CopyButton
                  weekStart={weekStart}
                  labels={labels}
                  getValuesFromDayRange={dayRangeName}
                />
              }
            />
          );
        },
      )}
    </div>
  );
};

export const DayRanges = <TFieldValues extends FieldValues>({
  name,
  disabled,
  control,
  labels,
  userTimeFormat,
}: {
  name: ArrayPath<TFieldValues>;
  control?: Control<TFieldValues>;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
  userTimeFormat: "12h" | "24h";
}) => {
  const { getValues } = useFormContext();

  const { remove, fields, prepend, append } = useFieldArray({
    control,
    name,
  });

  if (!fields.length) return null;

  return (
    <div className={cn("flex flex-col gap-2")}>
      {fields.map((field, index: number) => (
        <Fragment key={field.id}>
          <div className="flex gap-1 last:mb-0 sm:gap-2">
            <Controller
              name={`${name}.${index}`}
              render={({ field }) => (
                <TimeRangeField userTimeFormat={userTimeFormat} {...field} />
              )}
            />
            {index === 0 && (
              <Button
                disabled={disabled}
                data-testid="add-time-availability"
                aria-label={labels?.addTime ?? "Add time availability"}
                className="text-default"
                type="button"
                variant="outline"
                onClick={() => {
                  const slotRange: any = getDateSlotRange(
                    getValues(`${name}.${fields.length - 1}`),
                    getValues(`${name}.0`),
                  );

                  if (slotRange?.append) {
                    append(slotRange.append);
                  }

                  if (slotRange?.prepend) {
                    prepend(slotRange.prepend);
                  }
                }}
              >
                <Plus />
              </Button>
            )}
            {index !== 0 && (
              <RemoveTimeButton
                index={index}
                remove={remove}
                className="text-default border-none"
              />
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

const RemoveTimeButton = ({
  index,
  remove,
  disabled,
  className,
  labels,
}: {
  index: number | number[];
  remove: UseFieldArrayRemove;
  className?: string;
  disabled?: boolean;
  labels?: ScheduleLabelsType;
}) => {
  return (
    <Button
      disabled={disabled}
      type="button"
      variant="destructive"
      onClick={() => remove(index)}
      className={className}
      aria-label={labels?.deleteTime ?? "Delete"}
    >
      <Trash />
    </Button>
  );
};

const TimeRangeField = ({
  className,
  value,
  onChange,
  disabled,
  userTimeFormat,
}: {
  className?: string;
  disabled?: boolean;
  userTimeFormat: "12h" | "24h";
} & ControllerRenderProps) => {
  const INCREMENT =
    Number(process.env.NEXT_PUBLIC_AVAILABILITY_SCHEDULE_INTERVAL) || 15;
  return (
    <div className={cn("flex flex-row gap-2 sm:gap-3", className)}>
      <LazySelect
        userTimeFormat={userTimeFormat}
        className="block w-[90px] sm:w-[100px]"
        isDisabled={disabled}
        value={value.start}
        onChange={(option) => {
          if (!option) return;
          const newStart = new Date(option.value);
          if (newStart >= new Date(value.end)) {
            const newEnd = new Date(option.value);
            newEnd.setMinutes(newEnd.getMinutes() + INCREMENT);
            onChange({ ...value, start: newStart, end: newEnd });
          } else {
            onChange({ ...value, start: newStart });
          }
        }}
      />
      <span className="text-default w-2 self-center"> - </span>
      <LazySelect
        userTimeFormat={userTimeFormat}
        className="block w-[90px] rounded-md sm:w-[100px]"
        isDisabled={disabled}
        value={value.end}
        min={value.start}
        onChange={(option) => {
          if (!option) return;
          onChange({ ...value, end: new Date(option.value) });
        }}
      />
    </div>
  );
};

const LazySelect = ({
  value,
  min,
  max,
  userTimeFormat,
  onChange,
  isDisabled,
  className,
}: {
  value: ConfigType;
  min?: ConfigType;
  max?: ConfigType;
  userTimeFormat: "12h" | "24h";
  onChange: (option: IOption | null) => void;
  isDisabled?: boolean;
  className?: string;
}) => {
  const { options } = useOptions(userTimeFormat, { min, max });
  const selectedValue = options.find(
    (option) => option.value === dayjs(value).valueOf(),
  );

  return (
    <Select
      value={selectedValue?.value.toString()}
      onValueChange={(val) => {
        const option = options.find((o) => o.value === Number(val));
        onChange(option || null);
      }}
      disabled={isDisabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a time" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface IOption {
  readonly label: string;
  readonly value: number;
}

const INCREMENT =
  Number(process.env.NEXT_PUBLIC_AVAILABILITY_SCHEDULE_INTERVAL) || 15;
const useOptions = (
  timeFormat: "12h" | "24h",
  filter?: { min?: ConfigType; max?: ConfigType },
) => {
  const options = useMemo(() => {
    const end = dayjs().endOf("day");
    const options: IOption[] = [];
    for (
      let t = dayjs().startOf("day");
      t.isBefore(end);
      t = t.add(INCREMENT, "minutes")
    ) {
      options.push({
        value: t.toDate().valueOf(),
        label: t.format(timeFormat === "12h" ? "h:mma" : "HH:mm"),
      });
    }
    options.push({
      value: end.toDate().valueOf(),
      label: end.format(timeFormat === "12h" ? "h:mma" : "HH:mm"),
    });

    if (!filter) return options;

    return options.filter((option) => {
      const time = dayjs(option.value);
      const isAfterMin = !filter.min || time.isAfter(filter.min);
      const isBeforeMax = !filter.max || time.isBefore(filter.max);
      return isAfterMin && isBeforeMax;
    });
  }, [timeFormat, filter]);

  return { options };
};

const getDateSlotRange = (
  endField?: FieldArrayWithId,
  startField?: FieldArrayWithId,
) => {
  const timezoneStartRange = dayjs((startField as unknown as TimeRange).start);
  const nextRangeStart = dayjs((endField as unknown as TimeRange).end);
  const nextRangeEnd =
    nextRangeStart.hour() === 23
      ? dayjs(nextRangeStart)
          .add(59, "minutes")
          .add(59, "seconds")
          .add(999, "milliseconds")
      : dayjs(nextRangeStart).add(1, "hour");

  const endOfDay = nextRangeStart.endOf("day");

  if (!nextRangeStart.isSame(endOfDay)) {
    return {
      append: {
        start: nextRangeStart.toDate(),
        end: nextRangeEnd.isAfter(endOfDay)
          ? endOfDay.toDate()
          : nextRangeEnd.toDate(),
      },
    };
  }

  const previousRangeStart = dayjs(
    (startField as unknown as TimeRange).start,
  ).subtract(1, "hour");
  const startOfDay = timezoneStartRange.startOf("day");

  if (!timezoneStartRange.isSame(startOfDay)) {
    return {
      prepend: {
        start: previousRangeStart.isBefore(startOfDay)
          ? startOfDay.toDate()
          : previousRangeStart.toDate(),
        end: timezoneStartRange.toDate(),
      },
    };
  }
};

const CopyTimes = ({
  disabled,
  onClick,
  onCancel,
  weekStart,
}: {
  disabled: number;
  onClick: (selected: number[]) => void;
  onCancel: () => void;
  weekStart: number;
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const itteratablesByKeyRef = useRef<(HTMLInputElement | HTMLButtonElement)[]>(
    [],
  );
  const language =
    typeof window !== "undefined" ? window.navigator.language : "en-US";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const itteratables = itteratablesByKeyRef.current;
      const isActionRequired =
        event.key === "Tab" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "Enter";
      if (!isActionRequired || !itteratables.length) return;
      event.preventDefault();
      const currentFocused = document.activeElement as
        | HTMLInputElement
        | HTMLButtonElement;
      let currentIndex = itteratables.findIndex(
        (checkbox) => checkbox === currentFocused,
      );
      if (event.key === "Enter") {
        if (currentIndex === -1) return;
        currentFocused.click();
        return;
      }
      if (currentIndex === -1) {
        itteratables[0].focus();
      } else {
        if (event.key === "ArrowUp") {
          currentIndex =
            (currentIndex - 1 + itteratables.length) % itteratables.length;
        } else if (event.key === "ArrowDown" || event.key === "Tab") {
          currentIndex = (currentIndex + 1) % itteratables.length;
        }
        itteratables[currentIndex].focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="space-y-2 py-2">
      <div className="p-2">
        <p className="h6 text-emphasis pb-3 pl-1 text-xs font-medium uppercase">
          Copy times to
        </p>
        <ol className="space-y-2">
          <li key="select all">
            <div className="text-default flex w-full items-center justify-between">
              <label htmlFor="select-all-checkbox" className="px-1">
                Select all
              </label>
              <Checkbox
                id="select-all-checkbox"
                value="select_all"
                checked={selected.length === 7}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelected([0, 1, 2, 3, 4, 5, 6]);
                  } else {
                    setSelected([]);
                  }
                }}
                ref={(ref) => {
                  if (ref) {
                    itteratablesByKeyRef.current[0] = ref as HTMLInputElement;
                  }
                }}
              />
            </div>
          </li>
          {weekdayNames(language, weekStart, "short").map(
            (weekday: string, num: number) => {
              const weekdayIndex = (num + weekStart) % 7;
              const checkboxId = `weekday-checkbox-${weekdayIndex}`;
              return (
                <li key={weekday}>
                  <div className="text-default flex w-full items-center justify-between">
                    <label htmlFor={checkboxId} className="px-1">
                      {weekday}
                    </label>
                    <Checkbox
                      id={checkboxId}
                      value={weekdayIndex.toString()}
                      checked={
                        selected.includes(weekdayIndex) ||
                        disabled === weekdayIndex
                      }
                      disabled={disabled === weekdayIndex}
                      onCheckedChange={(checked) => {
                        if (checked && !selected.includes(weekdayIndex)) {
                          setSelected(selected.concat([weekdayIndex]));
                        } else if (
                          !checked &&
                          selected.includes(weekdayIndex)
                        ) {
                          setSelected(
                            selected.filter((item) => item !== weekdayIndex),
                          );
                        }
                      }}
                      ref={(ref) => {
                        if (ref && disabled !== weekdayIndex) {
                          itteratablesByKeyRef.current.push(
                            ref as HTMLInputElement,
                          );
                        }
                      }}
                    />
                  </div>
                </li>
              );
            },
          )}
        </ol>
      </div>
      <hr className="border-subtle" />
      <div className="space-x-2 px-2 rtl:space-x-reverse">
        <Button
          variant="ghost"
          onClick={() => onCancel()}
          ref={(ref) => {
            if (ref) {
              itteratablesByKeyRef.current.push(ref as HTMLButtonElement);
            }
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => onClick(selected)}
          ref={(ref) => {
            if (ref) {
              itteratablesByKeyRef.current.push(ref as HTMLButtonElement);
            }
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default Schedule;
