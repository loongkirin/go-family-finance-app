"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { accountApi, LoginRequest, LoginSchema } from "@/features/accounts/api/account";
import {toast} from "sonner"
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useAppForm } from "@/components/ui/form"
import { Form, FormContent, FormFooter, FormHeader, FormTitle } from "@/components/ui/form-component"

export function LoginForm() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues:{
      email: "",
      phone: "",
      password: "",
      captcha: {
        captcha_id: "",
        captcha_value: "",
      }
    } as LoginRequest,
    validators: {
      onChange: LoginSchema,
    },
    onSubmit: ({ value }) => {
      // console.log("login form value:", value)
      // alert(JSON.stringify(value, null, 2))
      mutation.mutate(value);
    },
  })

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => {
      return accountApi.signIn(data);
    },
    onSuccess: (data) => {
      // console.log("login success", data);
      if(data.code === 200) {
        router.push("/demo")
      } else {
        toast.error(data.message || "Error occured while logging, please try again later")
      }
    },
    onError: (error) => {
      console.log("login error", error);
      toast.error("Error occured while logging, please try again later")
    }
  })

  return (
    <>
      <Card className="overflow-hidden p-0 min-w-[400px]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form>
            <FormHeader>
              <FormTitle>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your family finance account
                  </p>
                </div>
              </FormTitle>
            </FormHeader>
            <FormContent
              className="md:grid-cols-1 xl:grid-cols-1"
              onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}>
              <form.AppField
                name="email"
                children={(field) => <field.FormTextField label="Email" placeholder="exampe@exampe.com" />}
              />
              <form.AppField
                name="phone"
                children={(field) => <field.FormTextField label="Phone" placeholder="Your phone" />}
              />
              {/* <form.AppField
                name="password"
                children={(field) => <field.FormTextField label="Password" placeholder="Password" type="password" />}
              /> */}
              <form.AppField
                name="password"
                children={(field) => (
                  <field.FormField<string>
                    render={(field) => (
                      <>
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <a
                            href="#"
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          type="password"
                        />
                      </>
                    )}
                    classesName={{root: "", error: "hidden"}}
                  />
                )}
              />
              <form.AppField
                name="captcha"
                children={(field) => <field.FormCaptchaField label="Captcha"/>}
              />
              <form.AppForm>
                <form.FormSubscribeButton>Login</form.FormSubscribeButton>
              </form.AppForm>
            </FormContent>
            <FormFooter className="flex flex-col">
              <div className="w-full after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or
                </span>
              </div>
              <div className="text-center text-sm mt-2">
                Don&apos;t have an account?{" "}
                <Link href="/account/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </FormFooter>
          </Form>
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
      <div className="pt-4 text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>  
    </>
  )
}
