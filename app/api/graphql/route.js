import { createYoga, createSchema } from "graphql-yoga";
import prisma from "@/lib/prisma.js";
import typeDefs from "@/app/graphql/TypeDefinitions.js";
import resolvers from "@/app/graphql/resolvers.js";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
// Create schema ONCE (not per request)
const schema = createSchema({
    typeDefs,
    resolvers,
});

// Create Yoga instance ONCE (not per request)
const { handleRequest } = createYoga({
    schema,
    context: async ({ request }) => {
        let session = null;
        try {
            const nextHeaders = await headers();
            const cookieHeader = nextHeaders.get('cookie');
            session = await auth.api.getSession({ headers: { cookie: cookieHeader ?? "" } });
        } catch (error) {
            console.error('GraphQL context: session error:', error);
        }
        return {
            prisma,
            session,
        };
    },
    graphqlEndpoint: 'api/graphql',
    fetchAPI: { Response },
    // Enable multipart handling for file uploads
    multipart: true
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }
