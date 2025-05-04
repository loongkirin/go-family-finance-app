import { withForm } from "@/components/ui/form"
import { peopleFormOpts } from "../accounts/shared-form"

export const AddressFields = withForm({
  ...peopleFormOpts,
  render: ({ form }) => {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <h2>Address</h2>
        <form.AppField
          name="address.line1"
          children={(field) => <field.FormTextField label="Address Line 1" />}
        />
        <form.AppField
          name="address.line2"
          children={(field) => <field.FormTextField label="Address Line 2" />}
        />
        <form.AppField
          name="address.city"
          children={(field) => <field.FormTextField label="City" />}
        />
        <form.AppField
          name="address.state"
          children={(field) => <field.FormTextField label="State" />}
        />
        <form.AppField
          name="address.zip"
          children={(field) => <field.FormTextField label="ZIP Code" />}
        />
      </div>
    )
  },
})