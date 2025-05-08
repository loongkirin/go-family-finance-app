"use client"

import React from "react"
import { JSX } from "react"
import { AnyFieldApi, useStore } from "@tanstack/react-form"
import { useFormContext, useFieldContext } from "@/hooks/use-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import {  Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Combobox, ComboboxProps } from "@/components/ui/combobox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Captcha } from "@/components/captcha"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { DropdownOption, Captcha as CaptchaValue } from "@/types/ui-componet-types"
import useCaptcha from "@/hooks/use-captcha"


function Form({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-md border px-2 py-6 shadow-sm h-full",
        className
      )}
      {...props}
    />
  )
}

function FormHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-header"
      className={cn(
        "@container/form-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=form-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function FormTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-title"
      className={cn("leading-none font-semibold m-auto col-span-full", className)}
      {...props}
    />
  )
}

function FormAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end mb-6",
        className
      )}
      {...props}
    />
  )
}

function FormContent({ className, ...props }: React.ComponentProps<"form">) {
  return (
    <form
      data-slot="form-content"
      className={cn("grid px-6 gap-6 md:grid-cols-2 xl:grid-cols-3", className)}
      {...props}
    />
  )
}

function FormFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

function FormSubscribeButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button disabled={isSubmitting} 
          className={cn(className)} 
          {...props}>
          {children}
        </Button>)}
    </form.Subscribe>
  )
}

const fieldContentVariants = cva(
  "flex w-full gap-2",
  {
    variants: {
      orientation: {
        horizontal:
          "flex-row items-center",
        vertical:
          "flex-col",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

type FormFieldProps = {
  classesName?: {
    root?: string | undefined,
    content?: string | undefined,
    label?: string | undefined,
    error?: string | undefined,
  }
  showLabel?: boolean,
  label?: string | undefined,
  placeholder?: string | undefined,
  showError?: boolean,
  className?: string,
} & VariantProps<typeof fieldContentVariants>

type FormFieldRenderProps = {
  render: (field : AnyFieldApi) => JSX.Element,
}

function FormFieldError({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-field-error"
      className={cn(
        "font-bold text-red-400 text-sm",
        className
      )}
      {...props}
    />
  )
}

function FormFieldRoot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-field-root"
      className={cn(
        className
      )}
      {...props}
    />
  )
}

function FormFieldContent({ className, orientation, ...props }: React.ComponentProps<"div"> & VariantProps<typeof fieldContentVariants>) {
  return (
    <div
      data-slot="form-field-content"
      className={cn(fieldContentVariants({orientation, className}))}
      {...props}
    />
  )
}

function FormField<TData>({ classesName, render, showLabel = true, label, orientation, showError = true } : FormFieldProps & FormFieldRenderProps) {
  const field = useFieldContext<TData>();
  const errors = useStore(field.store, (state) => state.meta.errors)

  return(
    <FormFieldRoot className={classesName?.root}>
      <FormFieldContent className={classesName?.content} orientation={orientation}>
        {showLabel && <Label htmlFor={field.name} className={classesName?.label}>{label}</Label>}
        {render(field)}
      </FormFieldContent>
      
      {showError && errors.map((error:any, index:number) => (
        <FormFieldError key={index} className={classesName?.error}>
          {error.message}
        </FormFieldError>
      ))}
    </FormFieldRoot>
  )
}

// function FormTextField({ label }: { label: string }) {
//   const field = useFieldContext<string>()
//   const errors = useStore(field.store, (state) => state.meta.errors)
  
//   return (
//     <FormFieldRoot>
//       <Label htmlFor={field.name}>{label}</Label>
//       <Input
//         id={field.name}
//         name={field.name}
//         value={field.state.value}
//         onChange={(e) => field.handleChange(e.target.value)}
//         onBlur={field.handleBlur}
//       />  
        
//       {errors.map((error:any, index:number) => (
//         <FormFieldError key={index}>
//           {error.message}
//         </FormFieldError>
//       ))}
//     </FormFieldRoot>
//   )
// }

function FormTextField({ classesName, label, showLabel=true, orientation, showError=true, placeholder, className, ...props } : FormFieldProps & React.ComponentProps<"input">) {
  return (
    <FormField<string> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <Input
            id={field.name}
            name={field.name}
            className={className}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            {...props}
          />
        </>
      )}
    />
  )
}

function FormTextareaField({ classesName, label, showLabel=true, orientation, showError=true, placeholder, className } : FormFieldProps) {
  return (
    <FormField<string> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <Textarea
            id={field.name}
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            className={className}
          />
        </>
      )}
    />
  )
}

function FormNumberField({ classesName, label, showLabel=true, orientation, showError=true, placeholder, className } : FormFieldProps) {
  return (
    <FormField<number | undefined> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <Input
            type="number"
            id={field.name}
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            className={className}
          />
        </>
      )}
    />
  )
}

// function FormCheckboxField({ label }: { label: string }) {
//   const field = useFieldContext<boolean>()
//   const errors = useStore(field.store, (state) => state.meta.errors)
  
//   return (
//     <FormFieldContainer>
//       <Label htmlFor={field.name}>{label}</Label>
//       <Checkbox
//         id={field.name}
//         name={field.name}
//         checked={field.state.value}
//         onCheckedChange={(e) => field.handleChange(e === true) }
//         onBlur={field.handleBlur}
//       />  
        
//       {/* {errors.map((error: string, index: number) => (
//         <div key={error+index} className="font-bold text-red-500">
//           {error}
//         </div>
//       ))} */}
//       {errors.map((error:any, index:number) => (
//         <FormFieldError key={index}>
//           {error.message}
//         </FormFieldError>
//       ))}
//     </FormFieldContainer>
//   )
// }

function FormCheckboxField({ classesName, label, showLabel=true, orientation, showError=true, className } : FormFieldProps) {
  return (
    <FormField<boolean> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <Checkbox
            id={field.name}
            name={field.name}
            checked={field.state.value}
            onCheckedChange={(e) => field.handleChange(e === true)}
            onBlur={field.handleBlur}
            className={className}
          />
        </>
      )}
    />
  )
}

function FormSwitchField({ classesName, label, showLabel=true, orientation, showError=true, className } : FormFieldProps) {
  return (
    <FormField<boolean> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <Switch
            id={field.name}
            name={field.name}
            checked={field.state.value}
            onCheckedChange={(e) => field.handleChange(e===true)}
            onBlur={field.handleBlur}
            className={className}
          />
        </>
      )}
    />
  )
}

// function FormDatePickerField({ label }: { label: string }) {
//   const field = useFieldContext<string>()
//   const errors = useStore(field.store, (state) => state.meta.errors)
  
//   return (
//     <FormFieldRoot>
//       <Label htmlFor={field.name}>{label}</Label>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant={"outline"}
//             className={cn(
//               "justify-start text-left font-normal item",
//               !field.state.value && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon />
//             {field.state.value ? format(field.state.value, "yyyy-MM-dd") : <span>Pick a date</span>}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0">
//           <Calendar
//             mode="single"
//             selected={new Date(field.state.value?? format(Date.now(), "yyyy-MM-dd"))}
//             onSelect={(e) => {
//               console.log("date", e)
//               if(e) {
//               const dateString = format(e, "yyyy-MM-dd")
//               console.log("dateString", dateString)
//               field.handleChange(dateString)
//               }
//             }}
//             onDayBlur={field.handleBlur}
//             captionLayout="dropdown"
//           />
//         </PopoverContent>
//       </Popover>
        
//       {errors.map((error:any, index:number) => (
//         <FormFieldError key={index}>
//           {error.message}
//         </FormFieldError>
//       ))}
//     </FormFieldRoot>
//   )
// }

function FormDatePickerField({ classesName, label, showLabel=true, orientation, showError=true, placeholder="Pick a date", className, defaultMonth, startMonth, endMonth, ...props } : FormFieldProps & {
  defaultMonth?: Date, startMonth?: Date, endMonth?: Date
}) {
  return (
    <FormField<boolean> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal item grow",
                  !field.state.value && "text-muted-foreground",
                  className
                )}
              >
                <CalendarIcon />
                {field.state.value ? format(field.state.value, "yyyy-MM-dd") : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(field.state.value?? format(Date.now(), "yyyy-MM-dd"))}
                onSelect={(e) => {
                  if(e) {
                    const dateString = format(e, "yyyy-MM-dd")
                    field.handleChange(dateString)
                  }
                }}
                onDayBlur={field.handleBlur}
                captionLayout="dropdown"
                defaultMonth={defaultMonth}
                startMonth={startMonth}
                endMonth={endMonth}
                {...props}
              />
            </PopoverContent>
          </Popover>
        </>
      )}
    />
  )
}

function FormComboboxField({ classesName, label, showLabel=true, orientation, showError=true, dropdownOptions, selectPlaceholder, searchPlaceholder, emptyDataContent, className, ...props } : FormFieldProps & ComboboxProps) {
  return (
    <FormField<string> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <Combobox
            id={field.name}
            name={field.name}
            value={field.state.value}
            onSelect={(e) => field.handleChange(e)}
            dropdownOptions={dropdownOptions}
            searchPlaceholder={searchPlaceholder}
            selectPlaceholder={selectPlaceholder}
            emptyDataContent={emptyDataContent}
            className={className}
            {...props}
          />
        </>
      )}
    />
  )
}

function FormSelectField({ classesName, label, showLabel=true, orientation, showError=true, dropdownOptions, placeholder, className } : FormFieldProps & {dropdownOptions?: DropdownOption[]}) {
  return (
    <FormField<string> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <Select
            name={field.name}
            value={field.state.value}
            onValueChange={(e) => field.handleChange(e)}
          >
            <SelectTrigger className={cn("grow w-auto", className)}>
              <SelectValue placeholder={placeholder}/>
            </SelectTrigger>
            <SelectGroup>
              <SelectContent>
                {dropdownOptions?.map(item => (
                  <SelectItem key={item.value} value={item.value} disabled={item.disabled}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </SelectGroup>
          </Select>
        </>
      )}
    />
  )
}

const radioGroupVariants = cva(
  "flex gap-3",
  {
    variants: {
      groupOrientation: {
        horizontal:
          "flex-row flex-wrap items-center",
        vertical:
          "flex-col",
      },
    },
    defaultVariants: {
      groupOrientation: "horizontal",
    },
  }
)
function FormRadioGroupField({ className, classesName, label, showLabel=true, orientation, showError=true, dropdownOptions,  groupOrientation, } : FormFieldProps & VariantProps<typeof radioGroupVariants> & { dropdownOptions?: DropdownOption[] }) {
  return (
    <FormField<string> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <RadioGroup
            id={field.name}
            name={field.name}
            defaultValue={field.state.value}
            onValueChange={(e) => field.handleChange(e)}
            onBlur={field.handleBlur}
          >
            <div className={cn(radioGroupVariants({groupOrientation, className}))}>
              {dropdownOptions?.map(item => (
                <div key={item.value} className="flex gap-1.5">
                  <RadioGroupItem value={item.value} disabled={item.disabled}/>
                  <Label>{item.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>  
        </>
      )}
    />
  )
}

function FormCaptchaField({ classesName, label, showLabel=true, orientation, showError=true, className, ...props } : FormFieldProps) {
  const { captchaData, isLoading, errorMessage, fetchCaptcha } = useCaptcha();
  return (
    <FormField<CaptchaValue> 
      classesName={classesName} 
      showLabel={showLabel}
      label={label}
      orientation={orientation}
      showError={showError}
      render={(field) => (
        <>
          <Captcha
            isLoading={isLoading}
            errorMessage={errorMessage} 
            captchaData={captchaData} 
            fetchCaptcha={fetchCaptcha}
            id={field.name}
            name={"captcha_value"}
            value={field.state.value.captcha_value}
            // onChange={(e) => field.handleChange(e.target.value)}
            onChange={(e) => {
              const captchaValue = {
                captcha_id: captchaData.captcha_id,
                captcha_value: e.target.value,
              } as CaptchaValue
              field.handleChange(captchaValue)
            }}
            onBlur={field.handleBlur}
            className={className}
            {...props}
          />
        </>
      )}
    />
  )
}

export {
  Form,
  FormHeader,
  FormAction,
  FormTitle,
  FormContent,
  FormSubscribeButton,
  FormFooter,
  FormField,
  FormTextField,
  FormTextareaField,
  FormNumberField,
  FormCheckboxField,
  FormSwitchField,
  FormDatePickerField,
  FormComboboxField,
  FormSelectField,
  FormRadioGroupField,
  FormCaptchaField,
}