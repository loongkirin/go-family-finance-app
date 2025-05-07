import { z } from 'zod'

export type DropdownOption = {
  label: string,
  value: string,
  disabled: boolean,
}

// export interface Captcha {
//   captcha_id: string;
//   captcha_value: string;
// }

export const CaptchaSchema = z.object({
  captcha_id: z.string(),
  captcha_value: z.string(),
})

export type Captcha = z.infer<typeof CaptchaSchema>;

export interface CaptchaData{
  captcha_id: string;
  pic_path: string;
  captcha_length: number;
}

export type fff = {
  
}