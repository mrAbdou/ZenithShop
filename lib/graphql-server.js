import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GQL_URL;
// Server-side request function with credentials for cookies
export const graphqlServerRequest = (query, variables = {}, cookieHeader = '') => {
    const client = new GraphQLClient(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    if (cookieHeader) {
        client.setHeader('cookie', cookieHeader);
    }
    return client.request(query, variables);
};

export { graphqlServerRequest };