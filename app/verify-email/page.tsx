"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/utils/FetchNodeServices"

const formSchema = z.object({
  digit1: z.string().length(1, { message: "Required" }),
  digit2: z.string().length(1, { message: "Required" }),
  digit3: z.string().length(1, { message: "Required" }),
  digit4: z.string().length(1, { message: "Required" }),
})

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
    },
  })

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setResendDisabled(false)
    }
    return () => clearTimeout(timer)
  }, [resendDisabled, countdown])

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Update the form value
    const fieldName = `digit${index + 1}` as keyof z.infer<typeof formSchema>
    form.setValue(fieldName, value)

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (
      e.key === "Backspace" &&
      !form.getValues()[`digit${index + 1}` as keyof z.infer<typeof formSchema>] &&
      index > 0
    ) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      // Fill all inputs with respective digits
      for (let i = 0; i < 4; i++) {
        form.setValue(`digit${i + 1}` as keyof z.infer<typeof formSchema>, pastedData[i])
      }
      // Focus the last input
      inputRefs[3].current?.focus()
    }
  }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
  
    const verificationCode = `${values.digit1}${values.digit2}${values.digit3}${values.digit4}`
  
    try {
      const res = await apiClient("POST", "/api/auth/verify", {
        otp: Number(verificationCode),
      });
  
      if (res.ok) {
        toast({
          title: "Email verified successfully",
          description: "Your account has been verified. You can now log in.",
        });
        router.push("/login");
      } else {
        toast({
          title: "Verification failed",
          description: res.message || "The verification code is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  }
  

  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   setIsLoading(true)

  //   // Combine the digits to form the verification code
  //   const verificationCode = `${values.digit1}${values.digit2}${values.digit3}${values.digit4}`

  //   try {
  //     // This would be an API call in a real app
  //     // For demo purposes, we'll simulate a successful verification
  //     await new Promise((resolve) => setTimeout(resolve, 1500))

  //     // Simulate verification success
  //     toast({
  //       title: "Email verified successfully",
  //       description: "Your account has been verified. You can now log in.",
  //     })

  //     // Redirect to login page
  //     router.push("/login")
  //   } catch (error) {
  //     toast({
  //       title: "Verification failed",
  //       description: "The verification code is incorrect. Please try again.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const handleResendCode = async () => {
    setResendDisabled(true)
    setCountdown(60)

    try {
      // This would be an API call in a real app
      // For demo purposes, we'll simulate sending a new code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Verification code resent",
        description: `A new verification code has been sent to ${email}.`,
      })
    } catch (error) {
      toast({
        title: "Failed to resend code",
        description: "There was an error sending a new verification code. Please try again.",
        variant: "destructive",
      })
      setResendDisabled(false)
    }
  }

  return (
    <div className="container max-w-md py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground">
            We've sent a verification code to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="text-center">
                <label className="text-sm font-medium">Enter 4-digit verification code</label>
              </div>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <Input
                    key={index}
                    ref={inputRefs[index]}
                    className="h-12 w-12 text-center text-lg"
                    maxLength={1}
                    value={form.watch(`digit${index + 1}` as keyof z.infer<typeof formSchema>)}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendDisabled}
              className={`text-primary underline-offset-4 hover:underline ${resendDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
