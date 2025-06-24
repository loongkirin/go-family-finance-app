"use client"

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { DateRange, DayPicker, Mode, OnSelectHandler } from "react-day-picker";
import { Separator } from "./separator";

type DatePickerBaseProps = {
  mode?: Mode,
  disabled?: boolean,
  placeholder?: string,
} & Omit<React.ComponentProps<typeof DayPicker>, "selected"|"onSelect"|"mode"|"disabled">;

 export type DatePickerSingleProps = {
  mode: "single",
  value?: Date,
  onChange?: OnSelectHandler<Date | undefined>,
} & DatePickerBaseProps;

function DatePickerSingle ({
  value,
  disabled,
  placeholder="Pick a date",
  onChange,
  ...props
}: DatePickerSingleProps) {
  const [open, setOpen] = React.useState(false)
  const [innerValue, setValue] = React.useState(value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "justify-start text-left font-normal grow",
            !innerValue && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {innerValue ? format(innerValue, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 min-w-[var(--radix-popover-trigger-width)]">
        <Calendar
          selected={innerValue}
          onSelect={(
            selected: Date | undefined,
            triggerDate: Date,
            modifiers: any,
            e: React.MouseEvent | React.KeyboardEvent
          ) => {
            if(onChange) {
              onChange(selected, triggerDate, modifiers, e)
            }
            setValue(selected)
            setOpen(false)
          }}
          disabled={disabled}
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}

type DatePickerRangeProps = {
  mode: "range",
  value?: DateRange,
  onChange?: OnSelectHandler<DateRange | undefined>,
} & DatePickerBaseProps;

function DatePickerRange ({
  // mode,
  value,
  disabled,
  placeholder="Pick a date",
  onChange,
  ...props
}: DatePickerRangeProps) {
  const [open, setOpen] = React.useState(false)
  const [innerValue, setValue] = React.useState(value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "justify-start text-left font-normal grow",
            !innerValue && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {innerValue ? `${innerValue?.from ? format(innerValue.from, "PPP") : ""}${innerValue?.to ? `${"-" + format(innerValue.to, "PPP")}`  : ""}` : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 min-w-[var(--radix-popover-trigger-width)]">
    
        <Calendar
          selected={innerValue}
          onSelect={(
            selected: DateRange | undefined,
            triggerDate: Date,
            modifiers: any,
            e: React.MouseEvent | React.KeyboardEvent
          ) => {
            if(onChange) {
              onChange(selected, triggerDate, modifiers, e)
            }
            setValue(selected)
            // if(selected?.from && selected?.to) {
            //   setOpen(false)
            // }
            // setOpen(false)
          }}
          disabled={disabled}
          {...props}
        />
        <Separator/>
        <div className="py-1.5 ml-auto w-fit px-2">
        <Button variant={"ghost"} size={"sm"} onClick={()=> setOpen(false)}>OK</Button>
        </div>
        
   
      </PopoverContent>
    </Popover>
  )
}

type DatePickerMultipleProps = {
  mode: "multiple",
  value?: Date[],
  onChange?: OnSelectHandler<Date[] | undefined>,
} & DatePickerBaseProps;

function DatePickerMultiple ({
  // mode,
  value,
  disabled,
  placeholder="Pick a date",
  onChange,
  ...props
}: DatePickerMultipleProps) {
  const [open, setOpen] = React.useState(false)
  const [innerValue, setValue] = React.useState(value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "justify-start text-left font-normal grow flex-wrap max-w-md h-auto",
            !innerValue && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {Array.isArray(innerValue) && innerValue.length > 0 ? (
            innerValue.map((date: Date) => (
              <div className="px-0.5" key={date.toLocaleDateString()}>{format(date, "PPP")}</div>
            ))
          ) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 min-w-[var(--radix-popover-trigger-width)]">
        <Calendar
          selected={innerValue}
          onSelect={(
            selected: Date[] | undefined,
            triggerDate: Date,
            modifiers: any,
            e: React.MouseEvent | React.KeyboardEvent
          ) => {
            if(onChange) {
              onChange(selected, triggerDate, modifiers, e)
            }
            setValue(selected)
          }}
          disabled={disabled}
          {...props}
        />
        <Separator/>
        <div className="py-1.5 ml-auto w-fit px-2">
        <Button variant={"ghost"} size={"sm"} onClick={()=> setOpen(false)}>OK</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export type DatePickerProps =  DatePickerBaseProps & (DatePickerSingleProps | DatePickerRangeProps | DatePickerMultipleProps);

function DatePicker ({
  mode,
  value,
  disabled,
  placeholder="Pick a date",
  onChange,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [innerValue, setValue] = React.useState(value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "justify-start text-left font-normal grow flex-wrap max-w-md h-auto",
            !innerValue && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {mode === "multiple" && Array.isArray(innerValue) && innerValue.length > 0 ? (
            innerValue.map((date: Date) => (
              <div className="px-0.5" key={date.toLocaleDateString()}>{format(date, "PPP")}</div>
            ))
          ) : mode === "range" && innerValue && (innerValue as DateRange)?.from ? (
            <span>
              {((innerValue as DateRange).from instanceof Date)
                ? format((innerValue as DateRange).from as Date, "PPP")
                : ""}
              {((innerValue as DateRange).to instanceof Date)
                ? `-${format((innerValue as DateRange).to as Date, "PPP")}`
                : ""}
            </span>
          ) : mode === "single" && innerValue ? (
            <span>{innerValue instanceof Date ? format(innerValue, "PPP") : ""}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 min-w-[var(--radix-popover-trigger-width)]">
        {mode === "single" && (
          <Calendar
            mode={mode}
            selected={typeof innerValue === "object" && innerValue instanceof Date ? innerValue : undefined}
            onSelect={(
              selected: Date | undefined,
              triggerDate: Date,
              modifiers: any,
              e: React.MouseEvent | React.KeyboardEvent
            ) => {
              if(onChange) {
                onChange(selected, triggerDate, modifiers, e)
              }
              setValue(selected)
            }}
            disabled={disabled}
            {...props}
          />
        )}
        {mode === "range" && (
          <Calendar
            mode={mode}
            selected={innerValue && typeof innerValue === "object" && "from" in innerValue ? (innerValue as DateRange) : undefined}
            onSelect={(
              selected: DateRange | undefined,
              triggerDate: Date,
              modifiers: any,
              e: React.MouseEvent | React.KeyboardEvent
            ) => {
              if(onChange) {
                onChange(selected, triggerDate, modifiers, e)
              }
              setValue(selected)
            }}
            disabled={disabled}
            {...props}
          />
        )}
        {mode === "multiple" && (
          <Calendar
            mode={mode}
            selected={Array.isArray(innerValue) ? innerValue as Date[] : undefined}
            onSelect={(
              selected: Date[] | undefined,
              triggerDate: Date,
              modifiers: any,
              e: React.MouseEvent | React.KeyboardEvent
            ) => {
              if(onChange) {
                onChange(selected, triggerDate, modifiers, e)
              }
              setValue(selected)
            }}
            disabled={disabled}
            {...props}
          />
        )}
        <Separator/>
        <div className="py-1.5 ml-auto w-fit px-2">
        <Button variant={"ghost"} size={"sm"} onClick={()=> setOpen(false)}>OK</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePickerSingle, DatePickerRange, DatePickerMultiple, DatePicker }