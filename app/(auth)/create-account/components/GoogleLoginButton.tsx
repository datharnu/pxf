import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useFullnameStore,
  useIsUserLoggedInStore,
  usePortraitImageStore,
  useUserIdStore,
  useEmailStore,
} from "@/store/userStore";
import { setCookie } from "cookies-next";

export default function GoogleLoginButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    console.log("Full Google Response:", credentialResponse);

    if (!credentialResponse.credential) {
      console.error("No credential received");
      toast("Error", { description: "Google Sign-In failed." });
      return;
    }

    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      console.log("Decoded Token:", decodedToken);

      const response = await axios.post(
        "https://pxfbackend.onrender.com/api/v1/auth/google-signin",
        { token: credentialResponse.credential },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { user, accessToken, refreshToken } = response.data.data;

      if (!accessToken || typeof accessToken !== "string") {
        throw new Error("Invalid access token received");
      }

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setCookie("token", accessToken);
      setCookie("refresh_token", refreshToken);

      // Update Zustand state
      useIsUserLoggedInStore.getState().setIsUserLoggedIn(true);
      useUserIdStore.getState().setUserId(user.id);
      useFullnameStore.getState().setFullname(user.fullname);
      const profilePic = user.profile_pic || ""; // Fallback to empty string or a default image URL
      usePortraitImageStore.getState().setPortraitImage(profilePic);
      // Persist email for downstream flows (e.g., payments)
      if (user.email) {
        useEmailStore
          .getState()
          .setEmail(user.email?.toLowerCase?.() || user.email);
      }
      toast("Success", {
        description: `Welcome, ${user.fullname}!`,
        style: { backgroundColor: "#22c55e", color: "white" },
        duration: 3000,
      });

      // Redirect destination: use ?redirect=/path if provided, else home
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Google Sign-In Error:", err.response?.data || err);

      toast("Login Failed", {
        description:
          err.response?.data?.message ||
          "Something went wrong, please try again.",
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    }
  };

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        void handleGoogleSignIn(credentialResponse); // Prevent type error
      }}
      onError={() => {
        toast("Google Sign-In Failed", {
          description: "Unable to authenticate.",
        });
      }}
    />
  );
}
