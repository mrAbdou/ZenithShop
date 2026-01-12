import { graphqlServerRequest } from '@/lib/graphql-server';
import { gql } from 'graphql-request';

export const FEATURED_CATEGORIES_QUERY = `
    query FeaturedCategories($head: Int!) {
      featuredCategories(head: $head) {
        id
        name
        product {
        id
        name
        }
      }
    }
  `;

export const CATEGORIES_QUERY = `
    query Categories {
      categories {
        id
        name
        createdAt
        updatedAt
      }
    }
  `;
export const COUNT_FILTERED_CATEGORIES = `
    query CountFilteredCategories($searchQuery: String!) {
      countFilteredCategories(searchQuery: $searchQuery)
    }
  `;

export const CATEGORY_QUERY = `
    query Category($id: String!) {
      category(id: $id) {
        id
        name
        createdAt
        updatedAt
      }
    }
  `;
export async function fetchFeaturedCategories(variables, cookieHeader) {
  try {
    const response = await graphqlServerRequest(FEATURED_CATEGORIES_QUERY, variables, cookieHeader);
    return response.featuredCategories ?? [];
  } catch (gqlError) {
    throw gqlError;
  }
}

export async function fetchCategories(variables, cookieHeader) {
  try {
    const response = await graphqlServerRequest(CATEGORIES_QUERY, variables, cookieHeader);
    return response.categories ?? [];
  } catch (gqlError) {
    throw gqlError;
  }
}
export async function countFilteredCategories(variables, cookieHeader) {
  try {
    const response = await graphqlServerRequest(COUNT_FILTERED_CATEGORIES, variables, cookieHeader);
    return response.countFilteredCategories ?? 0;
  } catch (gqlError) {
    throw gqlError;
  }
}

export async function fetchCategory(variables, cookieHeader) {
  try {
    const response = await graphqlServerRequest(CATEGORY_QUERY, variables, cookieHeader);
    return response.category;
  } catch (gqlError) {
    throw gqlError;
  }
}