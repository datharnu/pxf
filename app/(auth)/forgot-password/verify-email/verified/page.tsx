"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonComponent from "@/components/shared/ButtonComponent";

import { ArrowRightIcon, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/api/axios";
import { useEmailStore } from "@/store/userStore";
import { toast } from "sonner";

export default function Verified() {
  const router = useRouter();
  const email = useEmailStore((state) => state.email);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const schema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  type FormData = z.infer<typeof schema>;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const response = await api.post("/auth/reset-password", {
          email: email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        });
        const json = response.data;

        if (json.success === true) {
          router.push("/sign-in");
          // setCookie("token", json.user.accessToken);
          toast("Success", {
            description: json.message,
            duration: 2000, // 2 seconds
            style: { backgroundColor: "#22c55e", color: "white" },
          });
        }
      } catch (error) {
        toast("Error", {
          description: "Passwords do not match",
          style: { backgroundColor: "#dc2626", color: "white" },
          duration: 2000,
        });
        console.log(error);
      }
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
    if (data.password !== data.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
  };

  return (
    <section className="fixed inset-0 flex   items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 md:p-8 mx-5 rounded-lg shadow-lg w-full max-w-md ">
        <div>
          <h1 className="text-[28px] font-semibold">Verified!</h1>
          <p className="text-black font-light text-sm my-2 ">
            You can now set a new password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="my-16 ">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                {...register("password")}
                className="text-sm"
                required
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
              {/* Toggle password visibility button */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
                className="text-sm"
                required
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </span>
              )}
              {/* Toggle password visibility button */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error message for passwords mismatch */}
          {!passwordsMatch && (
            <p className="text-red-500 mt-2 text-xs">Passwords do not match.</p>
          )}

          {/* Next Button */}
          <div className="mt-[8rem] lg:mt-[10rem] ]">
            <ButtonComponent
              title={isPending ? "Signing in..." : "Submit"}
              type="submit"
              className={`bg-primary hover:bg-primary/90 text-white`}
              withIcon
              icon={
                <ArrowRightIcon className="group-hover:scale-115 group-hover:translate-x-2 transition-all  opacity-0 group-hover:opacity-100" />
              }
              disabled={isPending}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
