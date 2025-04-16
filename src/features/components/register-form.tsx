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
import { useMutation } from "@tanstack/react-query";
import { accountApi, createRequest, RegisterRequest, Request } from "@/features/accounts/api/account";
import { toast } from "sonner";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { captchaData, isLoading, errorMessage, fetchCaptcha } = useCaptcha();
  const ref = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (data: Request<RegisterRequest>) => {
      return accountApi.register(data);
    },
    onSuccess: (data) => {
      console.log("register success", data);
      if(data.isSuccess()) {
        toast.success("Register success, please login")
        router.push("/account/login")
      } else {
        fetchCaptcha();
        toast.error(data.message || "Error occured while registering, please try again later")
      }
    },
    onError: (error) => {
      console.log("register error", error);
      fetchCaptcha();
      toast.error("Error occured while registering, please try again later")
    }
  })

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutation.mutate(createRequest<RegisterRequest>({
      phone: "18611485593",
      password: "123456",
      confirm_password: "123456",
      email: "18611485593@163.com",
      user_name: "jack",
      tenant_name: "Jack's Family",
      captcha_value: ref.current?.value??'',
      captcha_id: captchaData?.captcha_id??'',
    } as RegisterRequest));
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Register</h1>
                <p className="text-muted-foreground text-balance">
                  Register your family finance account
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="user_name">User Name</Label>
                  <Input
                    id="user_name"
                    type="text"
                    placeholder="Your Name"
                    required
                  />
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
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirm Password</Label>
                  </div>
                  <Input id="confirmPassword" type="password" required />
                </div>
                <div className="grid gap-3 col-span-full">
                  <div className="flex items-center">
                    <Label htmlFor="tenant_name">Family Name</Label>
                  </div>
                  <Input id="tenant_name" placeholder="Your Family Name" required />
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
                  Register
                </Button>
              </div>
              
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or
                </span>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/account/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
