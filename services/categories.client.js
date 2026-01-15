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
export const CREATE_CATEGORY_MUTATION = `
    mutation CreateCategory($name: String!) {
      createCategory(name: $name) {
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
export const UPDATE_CATEGORY_MUTATION = `
    mutation UpdateCategory($id: String!, $name: String!) {
      updateCategory(id: $id, name: $name) {
        id
        name
        createdAt
        updatedAt
      }
    }
  `;

export const DELETE_CATEGORY_MUTATION = `
    mutation DeleteCategory($id: String!) {
      deleteCategory(id: $id) {
        id
        name
        createdAt
        updatedAt
      }
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

export const COUNT_CATEGORIES_QUERY = `
    query CountCategories {
      countCategories
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
export async function createCategory(variables) {
  try {
    const response = await graphqlRequest(CREATE_CATEGORY_MUTATION, variables);
    return response.createCategory;
  } catch (gqlError) {
    throw gqlError;
  }
}
export async function updateCategory(variables) {
  try {
    const response = await graphqlRequest(UPDATE_CATEGORY_MUTATION, variables);
    return response.updateCategory;
  } catch (gqlError) {
    throw gqlError;
  }
}

export async function fetchCategory(variables) {
  try {
    const response = await graphqlRequest(CATEGORY_QUERY, variables);
    return response.category ?? null;
  } catch (gqlError) {
    throw gqlError;
  }
}

export async function deleteCategory(variables) {
  try {
    const response = await graphqlRequest(DELETE_CATEGORY_MUTATION, variables);
    return response.deleteCategory;
  } catch (gqlError) {
    throw gqlError;
  }
}

export async function fetchCategoriesCount() {
  try {
    const response = await graphqlRequest(COUNT_CATEGORIES_QUERY, {});
    return response.countCategories ?? 0;
  } catch (gqlError) {
    throw gqlError;
  }
}