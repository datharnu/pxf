"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminSignup } from "@/app/utils/admin";

const adminSignupSchema = z
  .object({
    fullname: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
    adminKey: z.string().min(1, "Admin key is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AdminSignupFormData = z.infer<typeof adminSignupSchema>;

export default function AdminSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSignupFormData>({
    resolver: zodResolver(adminSignupSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AdminSignupFormData) => {
      return await adminSignup(data);
    },
    onSuccess: (data) => {
      toast("Admin account created successfully!", {
        description: data.message,
        style: { backgroundColor: "#16a34a", color: "white" },
      });
      router.push("/sign-in");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Something went wrong";
      toast("Error", {
        description: errorMessage,
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    },
  });

  const onSubmit = (data: AdminSignupFormData) => {
    mutate(data);
  };

  return (
    <section className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-12 w-12 text-orange-500" />
        </div>
        <h1 className="text-center text-3xl font-extrabold text-white">
          Admin Account Setup
        </h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          Create an administrative account with special privileges
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black/15 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-800">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-300"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullname"
                  {...register("fullname")}
                  type="text"
                  autoComplete="name"
                  className="appearance-none block w-full px-4 py-3 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-800 text-white"
                  placeholder="Admin User"
                />
                {errors.fullname && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.fullname.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-4 py-3 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-800 text-white"
                  placeholder="admin@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="appearance-none block w-full px-4 py-3 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-800 text-white pr-12"
                  placeholder="Enter password (min 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-orange-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="appearance-none block w-full px-4 py-3 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-800 text-white pr-12"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-orange-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Admin Key */}
            <div>
              <label
                htmlFor="adminKey"
                className="block text-sm font-medium text-gray-300"
              >
                Admin Key
              </label>
              <div className="mt-1 relative">
                <input
                  id="adminKey"
                  {...register("adminKey")}
                  type={showAdminKey ? "text" : "password"}
                  className="appearance-none block w-full px-4 py-3 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-800 text-white pr-12"
                  placeholder="Enter admin key"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminKey(!showAdminKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-orange-400"
                >
                  {showAdminKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.adminKey && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.adminKey.message}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Contact your system administrator for the admin key
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isPending ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Admin Account...
                  </span>
                ) : (
                  "Create Admin Account"
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-orange-900/20 border border-orange-800 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-orange-300">
                  Security Notice
                </h3>
                <p className="mt-1 text-xs text-orange-200">
                  Admin accounts have elevated privileges and can access
                  sensitive system data. Only create admin accounts for trusted
                  personnel.
                </p>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>
              Already have an admin account?{" "}
              <button
                onClick={() => router.push("/sign-in")}
                className="font-medium text-orange-500 hover:text-orange-400"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
