"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const toastMessage = searchParams.get("toast");
    const toastType = searchParams.get("toastType");

    if (toastMessage) {

      // Add a small delay to ensure the toast system is ready
      setTimeout(() => {
        // Show the toast based on type
        switch (toastType) {
          case "error":
            toast.error(toastMessage, {
              duration: 5000,
              style: {
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontWeight: '500'
              }
            });
            break;
          case "success":
            toast.success(toastMessage, {
              duration: 4000,
              style: {
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#16a34a',
                fontWeight: '500'
              }
            });
            break;
          case "info":
            toast.info(toastMessage, {
              duration: 4000,
              style: {
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#2563eb',
                fontWeight: '500'
              }
            });
            break;
          case "warning":
            toast.warning(toastMessage, {
              duration: 4000,
              style: {
                background: '#fefce8',
                border: '1px solid #fed7aa',
                color: '#d97706',
                fontWeight: '500'
              }
            });
            break;
          default:
            toast(toastMessage);
            break;
        }
      }, 100);

      // Clean up URL parameters after showing toast (with longer delay)
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("toast");
        url.searchParams.delete("toastType");

        // Replace current URL without the toast parameters
        router.replace(url.pathname + url.search, { scroll: false });
      }, 1000);
    } else {
      console.log('❌ No toast message found in URL params');
    }

  }, [searchParams, router]);

  return null; // This component doesn't render anything
}