"use client"

import { Button } from "@/components/ui/button"
import { useAppForm } from "@/components/ui/form"
import { Form, FormAction, FormContent, FormFooter, FormHeader, FormTitle } from "@/components/ui/form-component"
import React from "react"
import { peopleFormOpts, PeopleSchema } from "../accounts/shared-form"
import { AddressFields } from "./address_fields"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export const FormDist = () => {
  const form = useAppForm({
    ...peopleFormOpts,
    validators: {
      onChange: PeopleSchema,
    },
    onSubmit: ({ value }) => {
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
            children={(field) => <field.FormTextField label="Full Name" />}
          />
          <form.AppField
            name="emergencyContact.phone"
            children={(field) => <field.FormTextField label="Phone" />}
          />
          <form.AppField
            name="emergencyContact.framework"
            children={(field) => <field.FormComboboxField label="Framework" comboboxItems={frameworks} selectPlaceholder="Select a framework" searchPlaceholder="Search a framwork" emptyDataContent="No framework yet"/>}
          />
          <form.AppField
            name="allow"
            children={(field) => <field.FormCheckboxField label="Allow" orientation="horizontal" classesName={{content: "bg-green-400"}}/>}
          />
          <form.AppField
            name="agree"
            children={(field) => <field.FormSwitchField label="Agree" orientation="horizontal"/>}
          />
          <form.AppField 
            name="birthday"
            children={(field) => <field.FormDatePickerField label="Birthday" orientation={"horizontal"} />}
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