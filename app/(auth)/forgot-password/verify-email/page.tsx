"use client";
import React, { useEffect, useState } from "react";
import ButtonComponent from "@/components/shared/ButtonComponent";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/api/axios";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEmailStore } from "@/store/userStore";
import { toast } from "sonner";

const defaultSchema = z.object({
  code: z
    .string()
    .length(6, { message: "Code must be exactly 6 characters long" }),
});

type FormData = z.infer<typeof defaultSchema>;

export default function VerifyEmailPage() {
  const router = useRouter();
  const email = useEmailStore((state) => state.email);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(defaultSchema),
  });

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Function to format time into mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const response = await api.post("/auth/verify-password", {
          code: data.code,
          email: email,
        });
        const json = response.data;

        if (json.success) {
          router.push("/forgot-password/verify-email/verified");
          useEmailStore.setState({ email: email });
          toast("Success", {
            description: json.message,
            duration: 2000, // 2 seconds
            style: { backgroundColor: "#22c55e", color: "white" },
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast("Error", {
          description: "Invalid or expired code. Please try again.",
          style: { backgroundColor: "#dc2626", color: "white" },
          duration: 2000,
        });
      }
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  const handleGoBack = () => {
    router.back();
  };

  const otpValue = watch("code") || "";
  const isFullOTP = otpValue.length === 6;

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        {/* Back Button */}
        <div
          className="flex items-center gap-2 cursor-pointer text-gray-600"
          onClick={handleGoBack}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Verify Email</h1>
          <p className="text-sm text-gray-500 mt-2">
            We sent a verification code to
            <span className="font-medium text-green-600"> {email}</span>. Please
            enter the code below.
          </p>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center">
            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, value } }) => (
                <InputOTP maxLength={6} value={value} onChange={onChange}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>

          {errors.code && (
            <p className="text-red-500 text-center text-sm">
              {errors.code.message}
            </p>
          )}

          {/* Countdown Timer */}
          <p className="text-center text-sm text-gray-600">
            This code will expire in{" "}
            <span className="font-medium text-red-500">
              {formatTime(timeLeft)}
            </span>
          </p>

          {/* Submit Button */}
          <ButtonComponent
            title={isPending ? "Verifying..." : "Verify Code"}
            type="submit"
            className={`w-full py-3 text-white rounded-md ${
              isFullOTP
                ? "bg-primary hover:bg-primary/90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            // withIcon
            // icon={
            //   <ArrowRightIcon className="w-5 h-5 transition-transform opacity-0 group-hover:translate-x-1 group-hover:opacity-100" />
            // }
            disabled={!isFullOTP || isPending}
          />
        </form>
      </div>
    </section>
  );
}
