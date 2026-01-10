import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GQL_URL;

// Create a custom fetch function that handles file uploads
const customFetch = (url, options) => {
    // Check if we have file uploads in the variables
    const hasFiles = options?.body && (
        options.body instanceof FormData ||
        (typeof options.body === 'string' && options.body.includes('filename'))
    );

    if (hasFiles) {
        // For file uploads, use fetch directly with FormData
        return fetch(url, {
            ...options,
            credentials: 'include',
        });
    }

    // For regular requests, use the default fetch
    return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        },
    });
};

const client = new GraphQLClient(endpoint, {
    fetch: customFetch,
});

// Enhanced request function that handles file uploads
// Enhanced request function that handles file uploads following GraphQL Multipart Request Spec
export const graphqlRequest = async (query, variables = {}) => {
    // internal helper to extract files
    const extractFiles = (tree, path = []) => {
        const files = [];
        const recurse = (node, currentPath) => {
            if (node instanceof File) {
                files.push({ file: node, path: currentPath.join('.') });
                return null;
            } else if (Array.isArray(node)) {
                return node.map((item, index) => recurse(item, [...currentPath, index]));
            } else if (typeof node === 'object' && node !== null) {
                const newNode = {};
                for (const key in node) {
                    newNode[key] = recurse(node[key], [...currentPath, key]);
                }
                return newNode;
            }
            return node;
        };
        const newVariables = recurse(tree, path);
        return { newVariables, files };
    };

    const { newVariables, files } = extractFiles(variables, ['variables']);

    if (files.length > 0) {
        // Use FormData for file uploads
        const formData = new FormData();

        // 1. Operations
        const operations = JSON.stringify({
            query,
            variables: newVariables
        });
        formData.append('operations', operations);

        // 2. Map
        const map = {};
        files.forEach((item, index) => {
            map[index] = [item.path];
        });
        formData.append('map', JSON.stringify(map));

        // 3. Files
        files.forEach((item, index) => {
            formData.append(index, item.file);
        });

        // Make request with FormData
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                // Do NOT set Content-Type, let browser set it with boundary
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL error');
        }

        return result.data;
    } else {
        // Use regular GraphQL client for non-file requests
        return client.request(query, variables);
    }
};

export { client, graphqlRequest };
