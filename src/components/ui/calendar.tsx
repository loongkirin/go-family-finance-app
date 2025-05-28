"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DropdownProps } from "react-day-picker"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import { DropdownOption } from "@/types/ui-componet-types"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root:"px-8 py-3",
        months: "flex flex-col sm:flex-row gap-2 justify-center",
        month: "flex flex-col gap-4",
        dropdowns: "w-full flex items-center justify-center gap-4",
        dropdown: "bg-popover text-popover-foreground", 
        months_dropdown: "w-max",
        years_dropdown: "w-max",
        month_caption: "flex pt-1 relative w-full items-center justify-center",
        caption_label: cn("text-sm font-medium", props.captionLayout === "label" ? "": "hidden"),
        nav: "flex items-center gap-1 justify-center",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
        ),
        month_grid: "w-full border-collapse space-x-1 mr-2",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("size-6", className)} {...props} />;
          }
          return <ChevronRight className={cn("size-6", className)} {...props} />;
        },
        Dropdown:(props: DropdownProps) => {
          const { options, value, onChange, "aria-label": ariaLabel } = props;
          const handleValueChange = (newValue: string | undefined) => {
            if (onChange) {
              const syntheticEvent = {
                target: {
                  value: newValue
                }
              } as React.ChangeEvent<HTMLSelectElement>;
        
              onChange(syntheticEvent);
            }
          };
          const dropdownOptions = options?.map(option => ({
              label: option.label, value: option.value.toString(), disabled: option.disabled 
            } as DropdownOption)
          );
          return (
            // <Select value={value?.toString()} onValueChange={handleValueChange}>
            //   <SelectTrigger aria-label={ariaLabel} size="sm" className="w-auto py-0">
            //     <SelectValue />
            //   </SelectTrigger>
            //   <SelectContent>
            //     <SelectGroup>
            //       {options?.map((option) => (
            //         <SelectItem
            //           key={option.value}
            //           value={option.value.toString()}
            //           disabled={option.disabled}
            //         >
            //           {option.label}
            //         </SelectItem>
            //       ))}
            //     </SelectGroup>
            //   </SelectContent>
            // </Select>
            <Combobox
              className="h-8 py-1" 
              value={value?.toString()} 
              onSelect={(e) => {
                handleValueChange(e)
              }} 
              dropdownOptions={dropdownOptions}
              commandFilter={(value, search) => {
                // Custom scoring algorithm
                const item = dropdownOptions?.find(i => i.value.toLocaleLowerCase() === value.toLocaleLowerCase());
                if (!item) {
                  return 0;
                }
                
                const labelScore = item.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
                return labelScore;
              }}
            />
          )
        }
      }}
      {...props}
    />
  )
}

export { Calendar }