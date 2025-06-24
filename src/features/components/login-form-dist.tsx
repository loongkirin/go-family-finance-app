"use client"

import { Button } from "@/components/ui/button"
import { useAppForm } from "@/components/ui/form"
import { Form, FormAction, FormContent, FormFooter, FormHeader, FormTitle } from "@/components/ui/form-component"
import React from "react"
import { peopleFormOpts, PeopleSchema } from "../accounts/shared-form"
import { AddressFields } from "./address_fields"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { es, zhCN } from "date-fns/locale";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
    disabled: false,
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    disabled: false,
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    disabled: false,
  },
  {
    value: "remix",
    label: "Remix",
    disabled: false,
  },
  {
    value: "astro",
    label: "Astro",
    disabled: true,
  },
  {
    value: "javascript",
    label: "Javascript",
    disabled: false,
  },
  {
    value: "typescript",
    label: "Typescript",
    disabled: false,
  },
]

export const FormDist = () => {
  const form = useAppForm({
    ...peopleFormOpts,
    validators: {
      onChange: PeopleSchema,
    },
    onSubmit: ({ value }) => {
      console.log("login form value:", value)
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <Form>
      <FormHeader>
        <FormAction>
          <Button>Aciton1</Button>
          <Button>Action2</Button>
          <Button>Action3</Button>
          <Button>Aciton1</Button>
          <Button>Action2</Button>
          <Button>Action3</Button>
          <Button>Aciton1</Button>
          <Button>Action2</Button>
          <Button>Action3</Button>
          <Button>Aciton1</Button>
          <Button>Action2</Button>
          <Button>Action3</Button>
        </FormAction>
        <FormTitle>Personal Information</FormTitle>
      </FormHeader>
      {/* <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      > */}
        <FormContent
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.AppField
            name="fullName"
            children={(field) => <field.FormTextField label="Full Name" />}
          />
          <form.AppField
            name="email"
            children={(field) => <field.FormTextField label="Email" />}
          />
          <form.AppField
            name="firstName"
            children={(field) => (
              <field.FormField<string>
                render={(field) => (
                
                  <>
                    <Label htmlFor={field.name}>AAAA</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </>
                )}
                classesName={{root: "", error: "hidden"}}
              />
            )}
          />
          <form.AppField
            name="phone"
            children={(field) => <field.FormTextField label="Phone"  showError={false}/>}
          />
          <form.AppField
            name="age"
            children={(field) => <field.FormNumberField label="Age" />}
          />
          <AddressFields form={form}/>
          <h2>Emergency Contact</h2>
          <form.AppField
            name="emergencyContact.fullName"
            children={(field) => <field.FormTextareaField label="Full Name" orientation={"horizontal"} />}
          />
          <form.AppField
            name="emergencyContact.phone"
            children={(field) => <field.FormTextField label="Phone" orientation={"horizontal"}/>}
          />
          <form.AppField
            name="emergencyContact.framework"
            children={(field) => <field.FormComboboxField label="Framework" dropdownOptions={frameworks} selectPlaceholder="Select a framework" searchPlaceholder="Search a framwork" 
              emptyDataContent="No framework yet" orientation={"horizontal"}/>}
          />
          <form.AppField
            name="emergencyContact.tech"
            children={(field) => <field.FormSelectField label="Tech" dropdownOptions={frameworks} placeholder="Select a tech" orientation="horizontal"/>}
          />
          <form.AppField
            name="emergencyContact.tech2"
            children={(field) => <field.FormRadioGroupField label="Tech2" dropdownOptions={frameworks} placeholder="Select a tech2" orientation="horizontal" groupOrientation={"horizontal"}/>}
          />
          <form.AppField
            name="allow"
            children={(field) => <field.FormCheckboxField label="Allow" orientation="horizontal" classesName={{content: "bg-green-400"}}/>}
          />
          <form.AppField
            name="agree"
            children={(field) => <field.FormSwitchField label="Agree" orientation={"vertical"}/>}
          />
          <form.AppField 
            name="birthday"
            children={(field) => <field.FormDatePickerMultipleField mode="multiple" captionLayout={"dropdown"} label="Birthday" orientation={"horizontal"} startMonth={new Date(1925, 1)}  endMonth={new Date(2099,12)} locale={zhCN}  classesName={{content:"h-4 py-0"}}/>}
          />
          <form.AppField
            name="captcha"
            children={(field) => <field.FormCaptchaField label="Captcha" orientation={"horizontal"}/>}
          />
          <form.AppForm>
            <form.FormSubscribeButton>Submit</form.FormSubscribeButton>
          </form.AppForm>
        </FormContent>
      {/* </form> */}
      <FormFooter>
        Form Footer
      </FormFooter>
    </Form>
  )
}