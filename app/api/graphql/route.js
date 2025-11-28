import { createYoga, createSchema } from "graphql-yoga";
import prisma from "../../../lib/prisma.js";
import typeDefs from "../../graphql/TypeDefinitions.js";
import resolvers from "../../graphql/resolvers.js";

// Create schema ONCE (not per request)
const schema = createSchema({
  typeDefs,
  resolvers,
});

// Create Yoga instance ONCE (not per request)
const yoga = createYoga({
  schema,
  context: () => ({
    prisma,
  }),
});

// This is the clean way - same Yoga handles all requests!
export async function GET(request) {
  return yoga.handleRequest(request);
}

export async function POST(request) {
  return yoga.handleRequest(request);
}
