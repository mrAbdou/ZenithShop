"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
export default function RQProvider({ children }) {
    // Create QueryClient only once per app lifecycle
    const router = useRouter();
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 0,
                refetchOnWindowFocus: false,
                retry: false,
                onError: (error) => {
                    if (error.message.includes("Unauthorized")) {
                        toast.error("You are not authorized to perform this action, please sign in / sign up first !");
                        setTimeout(() => router.push("/auth"), 2000);
                    }
                }
            },
            mutations: {
                onError: (error) => {
                    if (error.message.includes("Unauthorized")) {
                        toast.error("You are not authorized to perform this action, please sign in / sign up first !");
                        setTimeout(() => router.push("/auth"), 2000);
                    }
                }
            }
        },
    }));
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}