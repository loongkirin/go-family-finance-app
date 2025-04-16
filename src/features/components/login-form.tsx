"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Captcha } from "@/components/captcha"
import useCaptcha from "@/hooks/use-captcha"
import { useRef } from "react";
import { accountApi, LoginRequest } from "@/features/accounts/api/account";
import {toast} from "sonner"
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { captchaData, isLoading, errorMessage, fetchCaptcha } = useCaptcha();
  const ref = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => {
      return accountApi.signIn(data);
    },
    onSuccess: (data) => {
      // console.log("login success", data);
      if(data.code === 200) {
        router.push("/demo")
      } else {
        fetchCaptcha();
        toast.error(data.message || "Error occured while logging, please try again later")
      }
    },
    onError: (error) => {
      console.log("login error", error);
      fetchCaptcha();
      toast.error("Error occured while logging, please try again later")
    }
  })

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutation.mutate({ 
      email: "18611485593@163.com", 
      phone: "18611485593", 
      password: "123456", 
      captcha_value: ref.current?.value??'', 
      captcha_id: captchaData?.captcha_id??'' 
    });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your family finance account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-3">
                <Captcha 
                  isLoading={isLoading} 
                  errorMessage={errorMessage} 
                  captchaData={captchaData} 
                  fetchCaptcha={fetchCaptcha} 
                  imageSize="md"
                  ref={ref}
                />
              </div>
              <Button type="submit" className="w-full" onClick={onSubmit}>
                Login
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or
                </span>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/account/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/images/login-bg.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={1000}
              height={1000}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
