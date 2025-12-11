'use server';

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { cookies } from "next/headers";

export async function getServerApolloClient(cookieHeader = '') {

    return new ApolloClient({
        ssrMode: true,
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_GQL_URL,
            headers: {
                cookie: cookieHeader
            },
        }),
        cache: new InMemoryCache()
    });
}
