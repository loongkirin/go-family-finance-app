"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { useAppForm } from "@/components/ui/form"
import { peopleFormOpts, PeopleSchema } from "../accounts/shared-form"
import { AddressFields } from "./address_fields"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"


export const PeoplePage = () => {
  const form = useAppForm({
    ...peopleFormOpts,
    validators: {
      // onChange: ({ value }) => {
      //   const errors = {
      //     fields: {},
      //   } as {
      //     fields: Record<string, string>
      //   }
      //   if (!value.fullName) {
      //     errors.fields.fullName = 'Full name is required'
      //   }
      //   if (!value.phone) {
      //     errors.fields.phone = 'Phone is required'
      //   }
      //   if (!value.emergencyContact.fullName) {
      //     errors.fields['emergencyContact.fullName'] =
      //       'Emergency contact full name is required'
      //   }
      //   if (!value.emergencyContact.phone) {
      //     errors.fields['emergencyContact.phone'] =
      //       'Emergency contact phone is required'
      //   }

      //   return errors
      // },
      onChange: PeopleSchema,
      // onBlur: PeopleSchema
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      
      className="grid gap-6 md:grid-cols-2"
    >
      <h1>Personal Information</h1>
      <form.AppField
        name="fullName"
        children={(field) => <field.FormTextField label="Full Name" />}
      />
      <div>sdfs</div>
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
        name="email"
        children={(field) => <field.FormTextField label="Email" />}
      />
      <form.AppField
        name="phone"
        children={(field) => <field.FormTextField label="Phone" />}
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
      {/* <form.AppField
        name="allow"
        children={(field) => <field.FormCheckboxField label="Allow" />}
      /> */}
      <form.AppField 
        name="allow" 
        children={(field) => (
          <field.FormField<boolean> 
            render={(field) => (
             <>
              <Label htmlFor={field.name} className="hidden ">Allow</Label>
              <Checkbox
                id="allow"
                name= {field.name}
                checked={field.state.value}
                onCheckedChange={(e) => field.handleChange(e === true) }
                onBlur={field.handleBlur}/>
              </>
            )}
          />   
        )}
      />
      <form.AppForm>
        <form.FormSubscribeButton>Submit</form.FormSubscribeButton>
      </form.AppForm>
    </form>
  )
}