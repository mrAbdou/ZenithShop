import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GQL_URL;
const client = new GraphQLClient(endpoint, {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    credentials: 'include',
});
// Client-side request function with credentials for cookies
export const graphqlRequest = (query, variables = {}) => {

    return client.request(query, variables);
};

export { client, graphqlRequest };