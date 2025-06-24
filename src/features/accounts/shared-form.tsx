import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'
import { format } from "date-fns"
import { CaptchaSchema } from '@/types/ui-componet-types';

export const PeopleSchema = z.object({
  fullName: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3')
    .startsWith('A', "[Zod] First name must start with 'A'"),
  firstName: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3'),
  age: z.nullable(z.number().gte(18, "Must 18 years old")),
  email: z.string().email("Invalid email address"),  
  phone: z.string().min(3, '[Zod] You must have a length of at least 3'),
  allow: z.boolean(),
  agree: z.boolean(),
  birthday:z.date().array(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  emergencyContact: z.object({
    fullName: z.string().min(1, "Emergency contact name is required"),
    phone: z.string().min(1, "Emergency contact phone is required"),
    framework: z.string(),
    tech:z.string(),
    tech2:z.string(),
  }),
  captcha: CaptchaSchema,
});

type Peopele = z.infer<typeof PeopleSchema>

export const peopleFormOpts = formOptions({
  defaultValues: {
    fullName: '',
    firstName: '',
    email: '',
    phone: '',
    allow: false,
    agree: true,
    age: 20,
    birthday: [new Date()],
    address: {
      line1: '',
      line2: undefined,
      city: '',
      state: '',
      zip: '',
    },
    emergencyContact: {
      fullName: '',
      phone: '',
      framework: "",
      tech: "",
      tech2: "",
    },
    captcha: {
      captcha_id: "",
      captcha_value: "",
    }
  } as Peopele,
})
