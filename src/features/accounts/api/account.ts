import axios from "@/lib/axios";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { auth } from "../../../../auth";
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    captcha_value: z.string().min(4, "Captcha must be at least 4 characters"),
    captcha_id: z.string(),
  });

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string(),
  user_name: z.string().min(1, "User name is required"),
  tenant_name: z.string().min(1, "Tenant name is required"),
  captcha_value: z.string().min(4, "Captcha must be at least 4 characters"),
  captcha_id: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;

export interface Request<T> {
  data: T;
}

export const createRequest = <T>(data: T): Request<T> => ({
  data: data,
});

export interface Response<T> {
  code: number;
  message: string;
  result: {data: T};
  isSuccess(): boolean;
}

export const createResponse = <T>(code: number, message: string, data: T): Response<T> => ({
  code,
  message,
  result: {data: data},
  isSuccess() {
    return this.code === 200;
  }
});

export interface Tenant {
  tenant_id: string;
  tenant_name: string;
  created_at: number;
}

export interface OAuth {
  session_id: string;
  access_token: string;
  refresh_token: string;
  expired_at: number;
}

export interface User {
  user_id: string;
  user_name: string;
  phone: string;
  email: string;
  password: string;
  tenant: Tenant;
  oauth: OAuth;
  captcha: Captcha;
}

export interface Captcha {
  captcha_id: string;
  captcha_value: string;
}

export interface CaptchaData{
  captcha_id: string;
  pic_path: string;
  captcha_length: number;
}

export const accountApi = {
    signIn: async (data: LoginRequest): Promise<Response<User>> => {
      console.log("signIn data", data);
      const response = await signIn("credentials", { ...data, redirect: false });
      console.log("signIn response", response);
      if(response == null || response.error) {
        return createResponse(400, "Login failed", {} as User);
      }
      return createResponse(response.status, "Login successful", {} as User);
    },
    login: async (data: LoginRequest): Promise<Response<User>> => {
        console.log("login data", data);
        const response = await axios.post("/auth/login", data);
        console.log("login response", response);
        return response.data;
    },
    register: async (data: Request<RegisterRequest>): Promise<Response<User>> => {
        console.log("register data", data);
        const response = await axios.post("/auth/register", data);
        console.log("register response", response);
        // return response.data;
        return createResponse(response.data.code, response.data.message, { ...response.data.result?.data } as User);
    },
    logout: async (): Promise<Response<void>> => {
        const response = await axios.post("/auth/logout");
        console.log("logout response", response);
        return response.data;
    },
    fetchCaptcha: async (): Promise<Response<CaptchaData>> => {
        const response = await axios.get("/auth/captcha");
        // console.log("fetchCaptcha response", response);
        return response.data;
    },

    getSession: async (): Promise<Response<User>> => {
        const session = await auth();
        console.log("getSession response", session);
        return createResponse(200, "Get session successful", session?.user as User);
    }
};
