"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandFilter } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownOption } from "@/types/ui-componet-types"

export type ComboboxProps = {
  className?: string,
  id?: string,
  name?: string,
  dropdownOptions?: DropdownOption[],
  selectPlaceholder?: string,
  searchPlaceholder?: string,
  emptyDataContent?: string,
  value?: string,
  onSelect?: (value: string | undefined) => void,
  commandFilter?: typeof CommandFilter,
}

function Combobox({id, name, dropdownOptions, selectPlaceholder, searchPlaceholder, emptyDataContent, value, onSelect, className, commandFilter } : ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between grow", className)}
          id={id}
          name={name}
        >
          {value
            ? dropdownOptions?.find((item) => item.value === value)?.label
            : <div className="opacity-50">{selectPlaceholder}</div>}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={"start"}>
        <Command filter={commandFilter}>
          <CommandInput placeholder={searchPlaceholder}/>
          <CommandList>
            <CommandEmpty>{emptyDataContent}</CommandEmpty>
            <CommandGroup>
              {dropdownOptions?.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const finalvalue = currentValue === selectedValue ? "" : currentValue
                    setSelectedValue(finalvalue)
                    onSelect && onSelect(finalvalue)
                    setOpen(false)
                  }}
                  disabled={item.disabled}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
