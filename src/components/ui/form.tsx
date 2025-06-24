"use client"

import { lazy } from "react"
import { createFormHook } from "@tanstack/react-form"
import { useFormContext, useFieldContext, fieldContext, formContext } from "@/hooks/use-form"
import { FormCaptchaField, FormCheckboxField, FormComboboxField, FormDatePicker, FormDatePickerField, FormDatePickerField1, FormDatePickerMultipleField, FormDatePickerRangeField, FormDatePickerTestField, FormField, FormNumberField, FormRadioGroupField, FormSelectField, FormSubscribeButton, FormSwitchField, FormTextareaField, FormTextField } from "@/components/ui/form-component"
// const { FormCaptchaField, FormCheckboxField, FormComboboxField, FormDatePickerField, FormField, FormNumberField, FormRadioGroupField, FormSelectField, FormSubscribeButton, FormSwitchField, FormTextareaField, FormTextField } = lazy(() => import('@/components/ui/form-component.tsx'))

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    FormField,
    FormTextField,
    FormTextareaField,
    FormNumberField,
    FormCheckboxField,
    FormSwitchField,
    FormDatePickerField,
    FormDatePicker,
    FormDatePickerRangeField,
    FormDatePickerMultipleField,
    FormComboboxField,
    FormSelectField,
    FormRadioGroupField,
    FormCaptchaField,
    FormDatePickerTestField,
    FormDatePickerField1,
  },
  formComponents: {
    FormSubscribeButton,
  },
  fieldContext,
  formContext,
})

export {
  fieldContext,
  useFieldContext,
  formContext,
  useFormContext,
  useAppForm,
  withForm,
}