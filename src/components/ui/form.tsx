"use client"

import { lazy } from "react"
import { createFormHook } from "@tanstack/react-form"
import { useFormContext, useFieldContext, fieldContext, formContext } from "@/hooks/use-form"
import { FormCheckboxField, FormComboboxField, FormDatePickerField, FormField, FormNumberField, FormSubscribeButton, FormSwitchField, FormTextField } from "@/components/ui/form-component"


const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    FormTextField,
    FormNumberField,
    FormCheckboxField,
    FormSwitchField,
    FormDatePickerField,
    FormComboboxField,
    FormField,
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
  FormTextField,
  FormSubscribeButton,
}