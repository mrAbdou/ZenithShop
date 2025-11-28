import 'dotenv/config';
import { createYoga, createSchema } from "graphql-yoga";
import { createServer } from "node:http";
import { auth } from "../../lib/auth.js";
import prisma from "../../lib/prisma.js";
import typeDefs from "./TypeDefinitions.js";
import resolvers from "./resolvers.js";


const schema = createSchema({
    typeDefs,
    resolvers,
});

const yoga = createYoga({
    schema,
    context: async ({ req }) => {
        let session = null;
        try {
            session = await auth.api.getSession({ req });
        } catch (error) {
            console.log("Session error:", error);
        }
        return { prisma, session };
    },
});

const server = createServer(yoga);

server.listen(4000, () => {
    console.log("GraphQL Server is running on http://localhost:4000/graphql");
});
