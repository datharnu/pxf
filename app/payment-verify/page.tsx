"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentVerifyPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const reference = url.searchParams.get("reference");
      if (!reference) return;
      router.replace(
        `/create-event?reference=${encodeURIComponent(reference)}`
      );
    } catch {
      // no-op
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        <span>Verifying payment...</span>
      </div>
    </div>
  );
}
