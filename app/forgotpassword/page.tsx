"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

export default function ForgotPassword() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("Reset Code Sent", {
      description: `We have sent a verification code to ${data.email}`,
    })
    // Mock navigation to code verification
    setTimeout(() => {
        router.push("/Code")
    }, 1000)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address to receive a verification code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className={fieldState.invalid ? "border-destructive" : ""}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" form="forgot-password-form" className="w-full">
              Send Code
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="underline underline-offset-4 text-primary">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
