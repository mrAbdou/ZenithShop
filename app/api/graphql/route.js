import { createYoga, createSchema } from "graphql-yoga";
import prisma from "@/lib/prisma.js";
import { auth } from "@/lib/auth.js";
import typeDefs from "@/app/graphql/TypeDefinitions.js";
import resolvers from "@/app/graphql/resolvers.js";

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
            session = await auth.api.getSession({
                headers: request.headers
            });
        } catch (error) {
            // Session retrieval failed, continue with null session (optional for public queries)
            session = null;
        }
        return {
            prisma,
            session,
        };
    },
    graphqlEndpoint: 'api/graphql',
    fetchAPI: { Response }
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }
