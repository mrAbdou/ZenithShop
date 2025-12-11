"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ApolloProvider } from "@apollo/client/react";
import client from "@/lib/apollo-client.client";
import { useState } from "react";
export default function RQProvider({ children }) {
    // Create QueryClient only once per app lifecycle
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 0,
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    }));
    return (
        <ApolloProvider client={client}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ApolloProvider>
    );
}