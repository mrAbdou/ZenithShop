import { graphqlRequest } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
export const FEATURED_CATEGORIES_QUERY = `
    query FeaturedCategories($head: Int!) {
      featuredCategories(head: $head) {
        id
        name
        products {
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
    query CountFilteredCategories($filter: CategoryFilterInput!) {
      countFilteredCategories(filter: $filter)
    }
  `;
export async function fetchFeaturedCategories(variables) {
  try {
    const response = await graphqlRequest(FEATURED_CATEGORIES_QUERY, variables);
    return response.featuredCategories ?? [];
  } catch (gqlError) {
    throw gqlError;
  }
}

export async function fetchCategories(variables) {
  try {
    const response = await graphqlRequest(CATEGORIES_QUERY, variables);
    return response.categories ?? [];
  } catch (gqlError) {
    throw gqlError;
  }
}

export async function countFilteredCategories(variables) {
  try {
    const response = await graphqlRequest(COUNT_FILTERED_CATEGORIES, variables);
    return response.countFilteredCategories ?? 0;
  } catch (gqlError) {
    throw gqlError;
  }
}