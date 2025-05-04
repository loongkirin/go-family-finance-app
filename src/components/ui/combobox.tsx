"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ComboboxItem } from "@/types/ui-componet-types"

export type ComboboxProps = {
  name?: string,
  comboboxItems: ComboboxItem[],
  selectPlaceholder?: string,
  searchPlaceholder?: string,
  emptyDataContent?: string,
  value?: string,
  onSelect?: (value: string | undefined) => void;
} & React.ComponentProps<typeof PopoverContent>

function Combobox({ name, comboboxItems, selectPlaceholder, searchPlaceholder, emptyDataContent, value, onSelect, className, ...props } : ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between")}
        >
          {value
            ? comboboxItems.find((item) => item.value === value)?.label
            : <div>{selectPlaceholder}</div>}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", className)} {...props}>
        <Command>
          <CommandInput placeholder={searchPlaceholder}/>
          <CommandList>
            <CommandEmpty>{emptyDataContent}</CommandEmpty>
            <CommandGroup>
              {comboboxItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const finalVlaue = currentValue === selectedValue ? "" : currentValue
                    setSelectedValue(finalVlaue)
                    onSelect && onSelect(finalVlaue)
                    setOpen(false)
                  }}
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
