import { LoginRequest, Request } from "@/features/accounts/api/account";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default {
  trustHost: true,  // 信任所有主机在上线服务Nginx时需要设置防止登录失败TLS拦截
  providers: [
    CredentialsProvider({
      async authorize(credentials, request) {
        // console.log("credentials", credentials);
        const loginRequest : Request<LoginRequest> = {
          data: {
            email: credentials.email as string,
            phone: credentials.phone as string,
            password: credentials.password as string,
            captcha_value: credentials.captcha_value as string,
            captcha_id: credentials.captcha_id as string
          }
        }
        const response = await axios.post("http://localhost:3000/api/v1/auth/login", loginRequest);
        console.log("login response", response);
        const result = response.data;
        console.log("login result", result);
        if(result.code !== 200) {
          console.log("login error", result.message);
          return Promise.reject(new Error(result.message || "Login failed"));
        }
        console.log("login result.data", result.result.data)
        return result.result.data;
      }
    })
  ],
} satisfies NextAuthConfig