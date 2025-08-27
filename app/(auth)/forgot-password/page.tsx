"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import ButtonComponent from "@/components/shared/ButtonComponent";
import { ArrowRightIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiMail } from "react-icons/fi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useEmailStore } from "@/store/userStore";
import { toast } from "sonner";

const schema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (value) => {
        // If email field is not empty, apply email validation
        if (value.trim() !== "") {
          return true;
        }
        // Otherwise, skip email validation if the field is empty
        return false;
      },
      { message: "Email is required", path: ["email"] }
    ),
});

type FormData = z.infer<typeof schema>;
export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, // Destructure isValid from formState
  } = useForm<FormData>({ resolver: zodResolver(schema) }); // Destructure useForm hook

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        data.email = data.email.toLowerCase();
        const response = await api.post("/auth/forgot-password", data);
        const json = response.data;

        useEmailStore.setState({ email: data.email });

        if (json.success === true) {
          router.push("/forgot-password/verify-email");
          toast("Success", {
            description: json.message,
            duration: 2000,
            style: { backgroundColor: "#22c55e", color: "white" },
          });

          // setCookie("token", json.user.accessToken);
        }
      } catch (error) {
        toast("Error", {
          description: "User not found",
          style: { backgroundColor: "#dc2626", color: "white" },
          duration: 2000,
        });
        console.log(error);
      }
    },
  });

  const onSubmit = async (data: FormData) => {
    mutate(data);
  };

  return (
    <section className="fixed inset-0 flex   items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 md:p-8 mx-5 rounded-lg shadow-lg w-full max-w-md ">
        <div>
          <h1 className="lg:text-[28px] text-xl font-semibold">
            Forget Password?
          </h1>
          <p className="text-[#A1A1A1] font-light text-sm my-2 ">
            Please input your email below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="my-16 ">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                placeholder="rose123@gmail.com"
                className="pl-10"
                {...register("email", { required: true })}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiMail className="w-4 h-5" />
              </div>
            </div>
            {/* Error message for email field */}
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email?.message}
              </span>
            )}
          </div>

          <div className=" my-8 text-[14px]">
            <a href="/sign-in">
              <p>Back to sign in</p>
            </a>
          </div>

          {/* Next Button */}
          <div className="mt-[10rem] lg:mt-[10rem] ">
            <ButtonComponent
              title={isPending ? "Sending..." : "Send"}
              type="submit"
              className={`bg-primary hover:bg-primary/90 text-white ${
                !isValid && "opacity-50 cursor-not-allowed" // Conditionally add opacity and cursor styles based on form validity
              }`}
              withIcon
              icon={
                <ArrowRightIcon className="group-hover:scale-115 group-hover:translate-x-2 transition-all  opacity-0 group-hover:opacity-100" />
              }
              disabled={isPending} // Disable the button based on form validity
            />
          </div>
        </form>
      </div>
    </section>
  );
}
